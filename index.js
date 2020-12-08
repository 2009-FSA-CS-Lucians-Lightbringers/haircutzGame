//setting up express server
const express = require("express");
const server = express();
const http = require("http").createServer(server);
const path = require("path");
const PORT = process.env.PORT || 8080;
const morgan = require("morgan");
//setting up socket that works with CORS
const io = require("socket.io")(http);

// logging middleware
server.use(morgan("dev"));

// static file-serving middleware
server.use(express.static(path.join(__dirname, "public")));

////get route to serve up entry point***
////combine our package.json files
////similar to boilermaker - webpack build then run server
////look at boilermaker webpack config
////add src/index.js script to html

//our players array
let players = [];

//socket rooms
var rooms = {};

//random room code generator
const randomRoomCodeGenerator = () => {
  let roomCode = "";
  for (let i = 0; i < 6; i++) {
    roomCode += Math.floor(Math.random() * 10);
  }
  return roomCode;
};

server.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

//socket logic
io.on("connection", function (socket) {
  console.log("A user connected: " + socket.id);

  //when you want to create a socket room
  socket.on("createGame", function () {
    let roomCode = randomRoomCodeGenerator();
    console.log("A user created room " + roomCode);
    socket.join(roomCode);
    io.to(roomCode).emit("isPlayerA");
    io.to(roomCode).emit("roomCode", roomCode);
    rooms[roomCode] = [socket.id];
  });

  socket.on("findRoom", function (roomCode) {
    if (roomCode in rooms) {
      if (rooms[roomCode].length === 1) {
        socket.join(roomCode);
        io.to(roomCode).emit("isPlayerB");
        rooms[roomCode].push(socket.id);
        io.in(roomCode).emit("roomFound", roomCode);
      } else {
        io.to(socket.id).emit("roomNotFound");
      }
    } else {
      io.to(socket.id).emit("roomNotFound");
    }
  });

  socket.on("redPlayerReady", function (roomCode) {
    io.in(roomCode).emit("redPlayerReady")
  })

  socket.on("bluePlayerReady", function (roomCode) {
    io.in(roomCode).emit("bluePlayerReady")
  })

  //emit spawnEnemy
  socket.on("spawnScissor", function (event) {
    let roomCode = Array.from(socket.rooms).filter(item => item!=socket.id)[0]
    io.in(roomCode).emit("spawnScissor", event);
  });

  //emit choosePath
  socket.on("choosePath", function (event) {
    let roomCode = Array.from(socket.rooms).filter(item => item!=socket.id)[0]
    io.in(roomCode).emit("choosePath", event);
  });

  //emit cardPlayed
  socket.on("placeTurret", function (isPlayerA, x, y) {
    let roomCode = Array.from(socket.rooms).filter(item => item!=socket.id)[0]
    io.in(roomCode).emit("placeTurret", isPlayerA, x, y);
  });

  //when a user disconnects, log and take player out of players array
  socket.on("disconnect", function () {
    console.log("A user disconnected: " + socket.id);
    players = players.filter((player) => player !== socket.id);
  });
});

//setting up our server on localhost:3000
http.listen(PORT, function () {
  console.log("Server started!");
});
