import Phaser from "phaser";
import Game from "./scenes/game";
import IntroScene from "./scenes/intro";
import Credits from "./scenes/credits";
import PlayerOneWins from "./scenes/p1wins";
import PlayerTwoWins from "./scenes/p2wins";
import BluePlayerWaitingRoom from "./scenes/bluePlayerWaitingRoom";
import RedPlayerWaitingRoom from "./scenes/redPlayerWaitingRoom";
import RandomGameFinder from "./scenes/randomGameFinder";

import PreStart from "./scenes/preStart";
import io from "socket.io-client";

const config = {
  type: Phaser.AUTO,
  parent: "game",
  dom: {
    createContainer: true,
  },
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  physics: {
    default: "arcade",
  },
};

const game = new Phaser.Game(config);

//game sounds
game.sound.mute = false;

//load scenes
game.scene.add("introScene", IntroScene);
game.scene.add("game", Game);
game.scene.add("p1Wins", PlayerOneWins);
game.scene.add("p2Wins", PlayerTwoWins);
game.scene.add("bluePlayerWaitingRoom", BluePlayerWaitingRoom);
game.scene.add("redPlayerWaitingRoom", RedPlayerWaitingRoom);
game.scene.add("preStart", PreStart);
game.scene.add("randomGameFinder", RandomGameFinder);
game.scene.add("credits", Credits)

//start title
game.scene.start("introScene");

//socket connected
game.socket = io();
game.socket.on("connect", function () {
  console.log("Connected!");
});

game.isPlayerA = false;
game.isPlayerB = false;

game.socket.on("isPlayerA", function () {
  if (!game.isPlayerB) {
    game.isPlayerA = true;
    console.log("Welcome Blue Player A!");
  }
});
game.socket.on("isPlayerB", function () {
  if (!game.isPlayerA) {
    game.isPlayerB = true;
    console.log("Welcome Red Player B!");
  }
});
