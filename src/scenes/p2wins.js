class PlayerTwoWins extends Phaser.Scene {
  constructor() {
    super({ key: "p2Wins" });
    this.clickButton = this.clickButton.bind(this);
  }

  preload() {
    this.load.image("p2Wins", "/assets/p2-winner-screen.png");
  }

  create() {
    var bg = this.add.sprite(0, 0, "p2Wins");
    bg.setOrigin(0, 0);

    var playAgain = this.make.text({
      x: 295,
      y: 525,
      text: "PLAY AGAIN?",
      style: {
        font: "bold 30px Marker Felt",
        fill: "red",
        wordWrap: { width: 400 },
      },
    });

    playAgain.setInteractive({ useHandCursor: true });
    playAgain.on("pointerdown", () => this.clickButton());
  }

  clickButton() {
    this.scene.switch("introScene");
  }
}

export default PlayerTwoWins;
