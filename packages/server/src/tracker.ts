import { WebSocketServer, type WebSocket } from "ws";
import type { Server } from "node:http";

interface AnnounceMessage {
  action: "announce";
  info_hash: string;
  peer_id: string;
  offers?: Array<{ offer: RTCSessionDescriptionInit; offer_id: string }>;
  numwant?: number;
}

interface AnswerMessage {
  action: "announce";
  info_hash: string;
  peer_id: string;
  to_peer_id: string;
  answer: RTCSessionDescriptionInit;
  offer_id: string;
}

type TrackerMessage = AnnounceMessage | AnswerMessage;

// infoHash -> peerId -> WebSocket
const swarms = new Map<string, Map<string, WebSocket>>();

function removePeer(ws: WebSocket) {
  for (const [infoHash, swarm] of swarms) {
    for (const [peerId, peerWs] of swarm) {
      if (peerWs === ws) swarm.delete(peerId);
    }
    if (swarm.size === 0) swarms.delete(infoHash);
  }
}

export function attachTracker(server: Server) {
  const wss = new WebSocketServer({ server, path: "/announce" });

  wss.on("connection", (ws: WebSocket) => {
    ws.on("message", (data) => {
      let msg: TrackerMessage;
      try {
        msg = JSON.parse(data.toString());
      } catch {
        return;
      }

      if (msg.action !== "announce") return;

      const { info_hash, peer_id } = msg;
      if (!info_hash || !peer_id) return;

      if (!swarms.has(info_hash)) swarms.set(info_hash, new Map());
      const swarm = swarms.get(info_hash)!;
      swarm.set(peer_id, ws);

      if ("offers" in msg && msg.offers?.length) {
        // Announce with offers — send to other peers in the swarm
        let sent = 0;
        for (const [pid, peerWs] of swarm) {
          if (pid === peer_id || sent >= (msg.numwant ?? 5)) break;
          if (peerWs.readyState !== ws.OPEN) continue;
          peerWs.send(
            JSON.stringify({
              action: "announce",
              offer: msg.offers[sent].offer,
              offer_id: msg.offers[sent].offer_id,
              peer_id,
              info_hash,
            }),
          );
          sent++;
        }

        ws.send(
          JSON.stringify({
            action: "announce",
            interval: 120,
            info_hash,
            complete: 0,
            incomplete: swarm.size,
          }),
        );
      } else if ("answer" in msg) {
        // Relay answer back to the peer that sent the offer
        const target = swarm.get((msg as AnswerMessage).to_peer_id);
        if (target?.readyState === ws.OPEN) {
          target.send(
            JSON.stringify({
              action: "announce",
              answer: (msg as AnswerMessage).answer,
              offer_id: (msg as AnswerMessage).offer_id,
              peer_id,
              info_hash,
            }),
          );
        }
      }
    });

    ws.on("close", () => removePeer(ws));
    ws.on("error", () => removePeer(ws));
  });
}
