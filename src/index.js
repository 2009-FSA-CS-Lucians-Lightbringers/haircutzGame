import Phaser from "phaser";
import Game from "./scenes/game";
import IntroScene from "./scenes/intro";
import PlayerOneWins from "./scenes/p1wins"
import PlayerTwoWins from "./scenes/p2wins"
import WaitingRoom from "./scenes/waitingRoom"
import PreStart from "./scenes/preStart"


const config = {
  type: Phaser.AUTO,
  parent: "game",
  dom: {
    createContainer: true
 },
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
  },
};

const game = new Phaser.Game(config);

//load scenes
game.scene.add("introScene", IntroScene);
game.scene.add("game", Game);
game.scene.add("p1Wins", PlayerOneWins);
game.scene.add("p2Wins", PlayerTwoWins);
game.scene.add('waitingRoom', WaitingRoom)
game.scene.add('preStart', PreStart)

//start title
game.scene.start("introScene");
