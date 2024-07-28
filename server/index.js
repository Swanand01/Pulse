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

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });

    socket.on("file-link", (fileLink, senderId) => {
      socket.broadcast.to(roomId).emit("file-link", fileLink, senderId);
    });

    socket.on("done-downloading", (senderId, fileLink) => {
      io.to(senderId).emit("done-downloading", fileLink);
    });

    socket.on("connection-established", (userId) => {
      socket.broadcast.to(roomId).emit("connection-established", userId);
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
