import path from "path";
import http from "http";
import express from "express";
import { Server } from "socket.io";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.Server(app);
const io = new Server(server, {
  cors: {
    origin: process.env.WEB_APP_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3001;

app.set("view engine", "ejs");

const rooms = {};
io.on("connection", (socket) => {
  socket.on("join-room", (roomId, username, userId) => {
    if (rooms[roomId] && rooms[roomId].includes(username)) {
      io.to(userId).emit("username-taken");
      return;
    }

    socket.join(roomId);
    rooms[roomId] = [...(rooms[roomId] || []), username];
    socket.broadcast.to(roomId).emit("user-connected", username);

    socket.on("disconnect", () => {
      const users = rooms[roomId] || [];
      const index = users.indexOf(username);
      if (users.indexOf(username) > -1) {
        users.splice(index, 1);
      }
      rooms[roomId] = users;
      socket.broadcast.to(roomId).emit("user-disconnected", username);
    });

    socket.on("file-link", (fileLink, senderId) => {
      socket.broadcast.to(roomId).emit("file-link", fileLink, senderId);
    });

    socket.on("done-downloading", (senderId) => {
      io.to(senderId).emit("done-downloading");
    });

    socket.on("connection-established", () => {
      socket.broadcast.to(roomId).emit("connection-established", username);
    });
  });
});

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
