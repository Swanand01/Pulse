import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();
const server = http.Server(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

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

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
