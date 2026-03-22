# Pulse

Pulse is a peer-to-peer file sharing app that lets you transfer files between devices instantly — no login, no cloud storage, no intermediary.

It uses WebTorrent for peer-to-peer transfers over WebRTC, and Socket.IO for signaling and room management. Files go directly browser-to-browser. Tracker servers carry metadata to facilitate the connection but never see the file contents.

## Features

- **No login required** — open the app and start sharing instantly
- **Peer-to-peer** — files transfer directly between browsers, never stored on the server
- **Cross-device** — works across any device with a modern browser
- **Real-time** — see connected peers and transfer progress live

## Try it

- Open the app and share the room link with the other person
- A connection is established once they open the link
- Drop a file to send

## Run locally

```bash
npm install
```

Create `packages/server/.env`:

```
CLOUDFLARE_TURN_TOKEN_ID=your_token_id
CLOUDFLARE_API_TOKEN=your_api_token
```

```bash
npm run dev
```

## Tech Stack

**Client:** React 19, TypeScript, Vite, Tailwind CSS, WebTorrent, Socket.IO

**Server:** Node, Express, TypeScript, Socket.IO

**Infrastructure:** Cloudflare TURN for WebRTC relay

## License

[MIT](https://choosealicense.com/licenses/mit/)
