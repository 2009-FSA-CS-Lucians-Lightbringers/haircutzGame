//setting up express server
const express = require('express');
const server = express();
const http = require('http').createServer(server);
const path = require('path');
const PORT = process.env.PORT || 8080;
const morgan = require('morgan');
//setting up socket that works with CORS
const io = require('socket.io')(http);

// logging middleware
server.use(morgan('dev'));

// static file-serving middleware
server.use(express.static(path.join(__dirname, 'public')));

////get route to serve up entry point***
////combine our package.json files
////similar to boilermaker - webpack build then run server
////look at boilermaker webpack config
////add src/index.js script to html

//our players array
let players = [];

//socket rooms
var rooms = 0;

server.use('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

//socket logic
io.on('connection', function (socket) {
	console.log('A user connected: ' + socket.id);

	//when you want to create a socket room
	// socket.on('createGame', function(data){
	// 	socket.join('room-' + ++rooms);
	// 	socket.emit('newGame', {name: data.name, room: 'room-'+rooms});
	// });

	/**
 * Connect the Player 2 to the room he requested. Show error if room full.
 */
// socket.on('joinGame', function(data){
//   var room = io.nsps['/'].adapter.rooms[data.room];
//   if( room && room.length == 1){
//     socket.join(data.room);
//     socket.broadcast.to(data.room).emit('player1', {});
// 		socket.emit('player2', {name: data.name, room: data.room })
// 		console.log('connected to socket room')
//   }
//   else {
//     socket.emit('err', {message: 'Sorry, The room is full!'});
//   }
// });

// 	socket.on("spawnScissor", function(event){
// 		socket.broadcast.to(data.room).emit('spawnScissor', event);
// 	});

// 	socket.on("choosePath", function(event){
// 		socket.broadcast.to(data.room).emit('choosePath', event);
// 	});

// 	socket.on("placeTurret", function(event){
// 		socket.broadcast.to(data.room).emit('placeTurret', event);
// 	});


	//push new players' socket ID into players array
	players.push(socket.id);
	//determine and emit "Player A"
	if (players.length === 1) {
		io.emit('isPlayerA');
	}
	if (players.length === 2) {
		io.emit('isPlayerB');
	}

	//emit spawnEnemy
	socket.on('spawnScissor', function (event) {
		io.emit('spawnScissor', event);
	});

	//emit choosePath
	socket.on('choosePath', function (event) {
		io.emit('choosePath', event);
	});

	//emit cardPlayed
	socket.on('placeTurret', function (isPlayerA, x, y) {
		console.log('in socket');
		io.emit('placeTurret', isPlayerA, x, y);
	});

	//when a user disconnects, log and take player out of players array
	socket.on('disconnect', function () {
		console.log('A user disconnected: ' + socket.id);
		players = players.filter((player) => player !== socket.id);
	});
});

//setting up our server on localhost:3000
http.listen(PORT, function () {
	console.log('Server started!');
});
