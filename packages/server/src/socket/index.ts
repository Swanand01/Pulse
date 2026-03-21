import type http from "node:http";
import { Server } from "socket.io";
import { registerRoomHandlers } from "./roomHandlers";

export function attachSocketHandlers(server: http.Server): Server {
  const io = new Server(server, {
    cors: {
      origin: process.env.WEB_APP_URL ?? "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    registerRoomHandlers(io, socket);
  });

  return io;
}
