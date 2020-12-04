import Phaser from "phaser";
import Game from "./scenes/game";
import GameOver from "./scenes/gameOver";
import IntroScene from "./scenes/intro";

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
game.scene.add("gameOver", GameOver);

//start title
game.scene.start("introScene");
