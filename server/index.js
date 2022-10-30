const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const http = require("http");
const { addUser, removeUser, getRoomUsers, getUser } = require("./data.js");
const server = http.createServer(app);
ORIGIN = "http://localhost:3000" || process.env.ORIGIN;
const { Server } = require("socket.io");
const io = new Server(server, {
	cors: {
		origin: ORIGIN,
		methods: ["GET", "POST"],
	},
});

PORT = 3001 || process.env.PORT;

app.get("/", (req, res) => {
	res.send("Hi");
});

io.on("connection", (socket) => {
	console.log(`socket: ${socket.id} connected`);

	socket.on("disconnect", () => {
		const user = getUser({ id: socket.id });
		if (user !== undefined) {
			const { id, name, room } = user;
			removeUser({ id: socket.id });
			io.to(room).emit("someone_left", { name: name });
			io.to(room).emit("users", { users: getRoomUsers({ room }) });
		}
		console.log(`socket: ${socket.id} disconnected`);
	});

	socket.on("join_room", ({ room, name }) => {
		socket.join(room);
		socket.emit("joined_room", { room, name });
		addUser({ id: socket.id, name: name, room: room });
		io.to(room).emit("someone_joined", { name: name });
		io.to(room).emit("users", { users: getRoomUsers({ room }) });
	});

	socket.on("send_message", ({ room, message }) => {
		const user = getUser({ id: socket.id });
		io.to(room).emit("receive_message", { message, name: user.name });
	});

	socket.on("play_request", ({ index, room, position }) => {
		io.to(room).emit("play_this_song", { index, position });
	});
});

server.listen(PORT, () => {
	console.log(`on ${PORT}`);
});
