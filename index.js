const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

const router = require('./router');
//const { Socket } = require('dgram');
let users = [];
const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(router);
app.use(cors());


const addUser = (userId, peerId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, peerId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};


const getUser = (userId) => {
  return users.find((user) => user.userId === userId);;
};
io.on('connection', (socket) => {
  console.log("a user connected.");
  socket.on("addUser", (userId, peerId) => {
    addUser(userId, peerId, socket.id);
    io.emit("getUsers", users);
    console.log(users) 
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});


server.listen(PORT,
  () => console.log(`Server has started on port ${PORT}`));