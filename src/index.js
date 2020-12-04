import Phaser from "phaser";
import Game from "./scenes/game";
import IntroScene from "./scenes/intro";
import PlayerOneWins from "./scenes/p1wins"
import PlayerTwoWins from "./scenes/p2wins"


const config = {
  type: Phaser.AUTO,
  parent: "game",
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

//start title
game.scene.start("introScene");
