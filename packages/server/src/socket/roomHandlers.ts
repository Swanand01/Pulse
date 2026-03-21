import type { Server, Socket } from "socket.io";

type Rooms = Record<string, string[]>;
const rooms: Rooms = {};

export function registerRoomHandlers(io: Server, socket: Socket): void {
  socket.on("join-room", (roomId: string, initialUsername: string) => {
    let username = initialUsername;

    if (socket.rooms.has(roomId)) return;

    if (rooms[roomId]?.includes(username)) {
      socket.emit("username-taken");
      return;
    }

    socket.join(roomId);
    rooms[roomId] = [...(rooms[roomId] ?? []), username];
    socket.broadcast.to(roomId).emit("user-connected", username);

    socket.on("rename-user", (newUsername: string) => {
      if (rooms[roomId]?.includes(newUsername)) {
        io.to(socket.id).emit("username-taken");
        return;
      }
      const users = rooms[roomId] ?? [];
      const idx = users.indexOf(username);
      if (idx > -1) users[idx] = newUsername;
      rooms[roomId] = users;
      const oldUsername = username;
      username = newUsername;
      io.to(socket.id).emit("rename-confirmed");
      socket.broadcast
        .to(roomId)
        .emit("user-renamed", oldUsername, newUsername);
    });

    socket.on("disconnect", () => {
      const users = rooms[roomId] ?? [];
      const index = users.indexOf(username);
      if (index > -1) users.splice(index, 1);
      if (users.length === 0) {
        delete rooms[roomId];
      } else {
        rooms[roomId] = users;
      }
      socket.broadcast.to(roomId).emit("user-disconnected", username);
    });

    socket.on("file-link", (fileLink: string, senderId: string) => {
      socket.broadcast.to(roomId).emit("file-link", fileLink, senderId);
    });

    socket.on("done-downloading", (senderId: string) => {
      io.to(senderId).emit("done-downloading");
    });

    socket.on("connection-established", () => {
      socket.broadcast.to(roomId).emit("connection-established", username);
    });
  });
}
