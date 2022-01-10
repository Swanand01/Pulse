const express = require('express')
const app = express()
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.redirect(`/${uuidV4()}`)
});

app.get("/:room", (req, res) => {
	res.render("room", {
		roomId: req.params.room
	});
});

io.on("connection", socket => {
	socket.on("join-room", (roomId, userId) => {
		socket.join(roomId);
		socket.broadcast.to(roomId).emit("user-connected", userId);

		socket.on("disconnect", () => {
			socket.broadcast.to(roomId).emit("user-disconnected", userId);
		})

		socket.on("file-link", (fileLink, senderId) => {
			socket.broadcast.to(roomId).emit("file-link", fileLink, senderId);
		})

		socket.on("done-downloading", senderId => {
			io.to(senderId).emit("done-downloading");
		})

		socket.on("connection-established", (userId) => {
			socket.broadcast.to(roomId).emit("connection-established", userId);
		}) // Change later
	})
})

server.listen(3000);