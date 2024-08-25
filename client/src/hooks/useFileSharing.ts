import { useState, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
// @ts-ignore
import WebTorrent from "webtorrent/dist/webtorrent.min.js";
import { download, formatBytes } from "../lib/utils";
import { WEBTORRENT_CONFIG } from "@/lib/constants";

interface UseFileSharingProps {
  roomId: string;
  username: string;
}

interface UseFileSharingReturn {
  connectionStatus: string;
  transferSpeed: string;
  sendFile: (file: File) => void;
  showDownloadDialog: boolean;
  setShowDownloadDialog: React.Dispatch<React.SetStateAction<boolean>>;
  showUsernameTakenDialog: boolean;
  downloadData: { file: WebTorrent.File } | null;
  handleDownload: () => void;
  peers: string[];
}

export function useFileSharing({
  roomId,
  username,
}: UseFileSharingProps): UseFileSharingReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [webtorrent] = useState(() => new WebTorrent(WEBTORRENT_CONFIG));
  const [connectionStatus, setConnectionStatus] = useState("");
  const [torrentBeingSent, setTorrentBeingSent] =
    useState<WebTorrent.Torrent | null>(null);
  const [transferSpeed, setTransferSpeed] = useState("0 kB/s");
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [showUsernameTakenDialog, setShowUsernameTakenDialog] = useState(false);
  const [downloadData, setDownloadData] = useState<{
    file: WebTorrent.File;
  } | null>(null);
  const [peers, setPeers] = useState<string[]>([]);

  const onUserConnected = (username: string) => {
    setPeers((peers) => Array.from(new Set([...peers, username])));
    setConnectionStatus("Connection established.");
  };

  const onFileUploadComplete = () => {
    setConnectionStatus("File sent.");
    setTransferSpeed("0 kB/s");
  };

  const onFileDownloadComplete = () => {
    setConnectionStatus("File received! Generating your download.");
    setTransferSpeed("0 kB/s");
  };

  const onUploadingFile = (
    filename: string,
    progress: number,
    uploadSpeed: string,
  ) => {
    setConnectionStatus(`Sending ${filename}: ${progress}%`);
    setTransferSpeed(uploadSpeed);
  };

  const onDownloadingFile = (progress: number, downloadSpeed: string) => {
    setConnectionStatus(`Receiving file: ${progress}%`);
    setTransferSpeed(downloadSpeed);
  };

  const reset = useCallback(() => {
    if (torrentBeingSent) {
      torrentBeingSent.destroy();
      setTorrentBeingSent(null);
    }
    setConnectionStatus("");
    setTransferSpeed("0 kB/s");
  }, [torrentBeingSent]);

  const sendFile = useCallback(
    (fileToSend: File) => {
      if (!fileToSend || !socket) return;
      setConnectionStatus("Preparing to send.");

      webtorrent.seed(fileToSend, (torrent: WebTorrent.Torrent) => {
        setTorrentBeingSent(torrent);

        socket.emit("file-link", torrent.magnetURI, socket.id);

        torrent.on("upload", () => {
          const progress = Math.round(
            (torrent.uploaded / torrent.length) * 100,
          );
          const uploadSpeed = `${formatBytes(torrent.uploadSpeed)}/s`;

          if (progress >= 100) {
            onFileUploadComplete();
            return;
          }

          onUploadingFile(fileToSend.name, progress, uploadSpeed);
        });

        torrent.on("error", (error: Error) => {
          console.error("WebTorrent error:", error);
        });
      });
    },
    [socket, webtorrent],
  );

  const handleDownload = useCallback(async () => {
    if (downloadData && downloadData.file) {
      const file = downloadData.file;
      const blob = await file.blob();
      download(blob, file.name);
      setShowDownloadDialog(false);
    }
  }, [downloadData]);

  useEffect(() => {
    const SOCKET_URL =
      process.env.NODE_ENV === "production"
        ? window.location.origin
        : "http://localhost:3001";

    const socket = io(SOCKET_URL);
    setSocket(socket);

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    webtorrent.on("error", (error: any) => {
      console.error("WebTorrent client error:", error);
    });
  }, [webtorrent]);

  useEffect(() => {
    if (!socket || !roomId || !username) return;

    const handleConnect = () => {
      socket.emit("join-room", roomId, username, socket.id);
    };

    const handleUserConnected = (username: string) => {
      onUserConnected(username);
      socket.emit("connection-established", username);
    };

    const handleConnectionEstablished = (username: string) => {
      onUserConnected(username);
    };

    const handleFileLink = async (fileLink: string, senderId: string) => {
      setConnectionStatus("Received magnet link.");

      const torrentHash = await webtorrent.get(fileLink);
      if (torrentHash) {
        webtorrent.remove(torrentHash);
      }

      webtorrent.add(fileLink, (torrent: WebTorrent.Torrent) => {
        setTorrentBeingSent(torrent);

        torrent.on("download", () => {
          const progress = Math.round(torrent.progress * 100);
          const downloadSpeed = `${formatBytes(torrent.downloadSpeed)}/s`;

          if (progress >= 100) {
            onFileDownloadComplete();
            return;
          }

          onDownloadingFile(progress, downloadSpeed);
        });

        torrent.on("done", async () => {
          onFileDownloadComplete();

          try {
            const file = torrent.files[0];
            setDownloadData({ file });
            setShowDownloadDialog(true);
          } catch (err) {
            console.error("Error generating download:", err);
          }

          socket.emit("done-downloading", senderId);
        });

        torrent.on("error", (err: Error) => {
          console.error("Torrent error:", err);
        });
      });
    };

    const handleDoneDownloading = () => {
      onFileUploadComplete();
    };

    const handleUserDisconnected = (username: string) => {
      const index = peers.indexOf(username);
      if (peers.indexOf(username) > -1) {
        peers.splice(index, 1);
        setPeers([...peers]);
      }
      reset();
    };

    const handleUsernameTaken = () => {
      setShowUsernameTakenDialog(true);
    };

    socket.on("connect", handleConnect);
    socket.on("username-taken", handleUsernameTaken);
    socket.on("user-connected", handleUserConnected);
    socket.on("connection-established", handleConnectionEstablished);
    socket.on("file-link", handleFileLink);
    socket.on("done-downloading", handleDoneDownloading);
    socket.on("user-disconnected", handleUserDisconnected);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("username-taken", handleUsernameTaken);
      socket.off("user-connected", handleUserConnected);
      socket.off("connection-established", handleConnectionEstablished);
      socket.off("file-link", handleFileLink);
      socket.off("done-downloading", handleDoneDownloading);
      socket.off("user-disconnected", handleUserDisconnected);
    };
  }, [socket, roomId, webtorrent, reset, username, peers]);

  return {
    connectionStatus,
    transferSpeed,
    sendFile,
    showDownloadDialog,
    setShowDownloadDialog,
    showUsernameTakenDialog,
    downloadData,
    handleDownload,
    peers,
  };
}
