//setting up express server
const server = require("express")();
const http = require("http").createServer(server);
//setting up socket that works with CORS
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

//our players array
let players = [];

//socket logic
io.on("connection", function (socket) {
  console.log("A user connected: " + socket.id);

  //push new players' socket ID into players array
  players.push(socket.id);
  //determine and emit "Player A"
  if (players.length === 1) {
    io.emit("isPlayerA");
  }
  if (players.length === 2) {
    io.emit("isPlayerB");
  }

  //emit spawnEnemy
  socket.on("spawnEnemy", function (event) {
    io.emit("spawnEnemy", event);
  });

  //emit choosePath
  socket.on("choosePath", function (event) {
    io.emit("choosePath", event);
  });

  //emit cardPlayed
  socket.on("placeTurret", function (isPlayerA, x, y) {
    console.log("in socket");
    io.emit("placeTurret", isPlayerA, x, y);
  });

  //when a user disconnects, log and take player out of players array
  socket.on("disconnect", function () {
    console.log("A user disconnected: " + socket.id);
    players = players.filter((player) => player !== socket.id);
  });
});

//setting up our server on localhost:3000
http.listen(3000, function () {
  console.log("Server started!");
});
