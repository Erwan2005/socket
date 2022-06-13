const express = require("express");
const app = express();
const http = require("https");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get('/',(req,res)=>{
  res.write('<h1>Socket started at port: ${PORT}</h1>');
  res.end();
})

const server = http.createServer(app);
let users = [];

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

server.listen(PORT, () => {
  console.log("SERVER RUNNING");
});