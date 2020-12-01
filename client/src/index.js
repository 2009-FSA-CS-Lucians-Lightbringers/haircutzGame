import Phaser from "phaser";
import Game from "./scenes/game";
import SceneTwo from "./scenes/gameOver"

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
  },
  scene: [Game, SceneTwo],
};

const game = new Phaser.Game(config);
