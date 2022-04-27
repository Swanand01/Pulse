
# PeerShare

PeerShare is a file sharing app that allows users to transfer files between multiple devices. It uses web technologies to eliminate the process of installing native apps for different devices and operating systems. It also supports instant file sharing with multiple devices at once.

PeerShare primarily uses WebTorrent to transfer files between multiple devices, and WebSockets to create temporary rooms. Files shared via WebTorrent are peer-to-peer(as they use WebRTC internally) which means there is direct transfer between the sender and receiver without any intermediate server. Do note that tracker servers in WebTorrent are used which carry metadata and facilitate the file transfer but do not get the complete file in any form.


## Features

- No signup needed.
- Supports one to many transfers.
- Works on almost all browsers.
- Cross platform, responsive.
- Easy to use, and no app installation required.


## Try it!

- Head over to the PeerShare website [here.](https://peer-share-app.herokuapp.com/)
- Share the link of the page to the other peer.
- A connection will be established once the other peer opens the link.
- Start sharing files!


## Tech Stack

**Server:** Node, Express, SocketIO, WebTorrent

**Client:** HTML, CSS, JS, ejs


## License

[MIT](https://choosealicense.com/licenses/mit/)

