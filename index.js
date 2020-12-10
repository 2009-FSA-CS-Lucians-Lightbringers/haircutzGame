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

//our players array
let players = [];

//socket rooms
var rooms = {};
// rooms = {
//   room#: {
//     players: [p1, p2],
//   }
// }
var openRoomQueue = [];

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
    rooms[roomCode] = { players: [socket.id] };
    //console.log(rooms);
    //console.log(io.sockets.adapter.rooms);
  });

  socket.on("findRoom", function (roomCode) {
    if (roomCode in rooms) {
      if (rooms[roomCode].players.length === 1) {
        socket.join(roomCode);
        io.to(roomCode).emit("isPlayerB");
        rooms[roomCode].players.push(socket.id);
        io.in(roomCode).emit("roomFound", roomCode);
      } else {
        io.to(socket.id).emit("roomNotFound");
      }
    } else {
      io.to(socket.id).emit("roomNotFound");
    }
  });

  socket.on("redPlayerReady", function (roomCode) {
    io.in(roomCode).emit("redPlayerReady");
  });

  socket.on("bluePlayerReady", function (roomCode) {
    io.in(roomCode).emit("bluePlayerReady");
  });

  socket.on("spawnScissor", function (event) {
    let roomCode = Array.from(socket.rooms).filter(
      (item) => item != socket.id
    )[0];
    io.in(roomCode).emit("spawnScissor", event);
  });

  socket.on("choosePath", function (event) {
    let roomCode = Array.from(socket.rooms).filter(
      (item) => item != socket.id
    )[0];
    io.in(roomCode).emit("choosePath", event);
  });

  socket.on("placeTurret", function (isPlayerA, x, y) {
    let roomCode = Array.from(socket.rooms).filter(
      (item) => item != socket.id
    )[0];
    io.in(roomCode).emit("placeTurret", isPlayerA, x, y);
  });

  socket.on("stopTheme", function () {
    let roomCode = Array.from(socket.rooms).filter(
      (item) => item != socket.id
    )[0];
    io.in(roomCode).emit("stopTheme");
  });

  socket.on("openRoom", function () {
    let roomCode = Array.from(socket.rooms).filter(
      (item) => item != socket.id
    )[0];
    openRoomQueue.push(roomCode);
    console.log(openRoomQueue);
  });

  socket.on("joinRandom", function () {
    if (openRoomQueue.length) {
      let roomCode = openRoomQueue.shift();
      socket.join(roomCode);
      rooms[roomCode].players.push(socket.id);
      io.in(roomCode).emit("randomJoin", roomCode);
    } else io.to(socket.id).emit("randomJoin");
  });

  socket.on("timer", function () {
    let roomCode = Array.from(socket.rooms).filter(
      (item) => item != socket.id
    )[0];
    io.in(roomCode).emit("timer");
  });

  socket.on("removeAttacker", function (number, createdByPlayerA) {
    let roomCode = Array.from(socket.rooms).filter(
      (item) => item != socket.id
    )[0];
    io.in(roomCode).emit("removeAttacker", number, createdByPlayerA);
  });

  socket.on("removeEnemy", function (number, createdByPlayerA) {
    let roomCode = Array.from(socket.rooms).filter(
      (item) => item != socket.id
    )[0];
    io.in(roomCode).emit("removeEnemy", number, createdByPlayerA);
  });

  socket.on("gameReady", function (isPlayerA) {
    let roomCode = Array.from(socket.rooms).filter(
      (item) => item != socket.id
    )[0];
    io.in(roomCode).emit("gameReady", isPlayerA);
  });

  //when a user disconnects, log and take player out of players array
  socket.on("disconnect", function () {
    let roomCode;
    console.log("A user disconnected: " + socket.id);
    players = players.filter((player) => player !== socket.id);
    for (let room in rooms) {
      if (rooms[room].players.includes(socket.id)) {
        roomCode = room;
        delete rooms[room];
      }
    }
    if (roomCode) {
      if (openRoomQueue.includes(roomCode)) {
        let idx = openRoomQueue.indexOf(roomCode);
        openRoomQueue.splice(idx, 1);
      }
      io.in(roomCode).emit("playerLeft");
    }
  });
});

//setting up our server on localhost:3000
http.listen(PORT, function () {
  console.log("Server started!");
});
