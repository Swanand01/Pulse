# Pulse

Pulse is a file sharing web app that allows users to transfer files between multiple devices. It supports instant file sharing with multiple devices at once.

Pulse primarily uses WebTorrent to transfer files between multiple devices, and WebSockets to create temporary rooms. Files shared via WebTorrent are peer-to-peer(as they use WebRTC internally) which means there is direct transfer between the sender and receiver without any intermediate server. Do note that tracker servers in WebTorrent are used which carry metadata and facilitate the file transfer but do not get the complete file in any form.


## Features

**Easy to Use**: No login or sign-up needed. Open the web app and start sharing instantly!

**Secure**: Your files are transferred browser to browser and never stored on the server.

**Anywhere**: Effortlessly share files across any device, no matter where you are in the world.


## Try it!

- Head over to the Pulse website [here.]([https://Pulse-app.onrender.com/](https://pulse-zmn77.ondigitalocean.app/))
- Share the link of the page to the other peer.
- A connection will be established once the other peer opens the link.
- Start sharing files!

## Run locally

```bash
npm install
npm run dev
```

## Tech Stack

**Server:** Node, Express, SocketIO, WebTorrent

**Client:** React, Tailwind


## License

[MIT](https://choosealicense.com/licenses/mit/)
