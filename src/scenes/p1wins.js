class PlayerOneWins extends Phaser.Scene {
  constructor() {
    super({ key: "p1Wins" });
    this.clickButton = this.clickButton.bind(this);
    this.theme;
  }

  preload() {
    this.load.image("p1Wins", "/assets/p1-winner-screen.png");
    this.load.audio("theme", ["/assets/intro_theme2.mp3"]);
    this.load.image("play", "/assets/play.png");
    this.load.image("pause", "/assets/pause.png");
  }

  create() {
    var bg = this.add.sprite(0, 0, "p1Wins");
    bg.setOrigin(0, 0);
    var play = this.add.image(70, 70, "play");
    var pause = this.add.image(135, 70, "pause");
    this.theme = this.sound.add("theme", { loop: true, volume: 1 });
    this.theme.play();

    var playAgain = this.make.text({
      x: 295,
      y: 525,
      text: "BACK TO MAIN MENU",
      style: {
        font: "bold 30px Marker Felt",
        fill: "blue",
        wordWrap: { width: 400 },
      },
    });

    playAgain.setInteractive({ useHandCursor: true });
    playAgain.on("pointerdown", () => this.clickButton());
    play.setInteractive({ useHandCursor: true });
    play.on("pointerdown", () => {
      self.game.sound.mute = false;
    });
    pause.setInteractive({ useHandCursor: true });
    pause.on("pointerdown", () => {
      self.game.sound.mute = true;
    });
  }

  clickButton() {
    location.reload();
  }
}

export default PlayerOneWins;
