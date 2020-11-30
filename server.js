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

  // //emit dealCards
  // socket.on("dealCards", function () {
  //   io.emit("dealCards");
  // });

  // //emit cardPlayed
  // socket.on("cardPlayed", function (gameObject, isPlayerA) {
  //   io.emit("cardPlayed", gameObject, isPlayerA);
  // });

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
