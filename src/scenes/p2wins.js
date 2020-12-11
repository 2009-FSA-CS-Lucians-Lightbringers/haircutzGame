class PlayerTwoWins extends Phaser.Scene {
  constructor() {
    super({ key: "p2Wins" });
    this.clickButton = this.clickButton.bind(this);
  }

  preload() {
    this.load.image("p2Wins", "/assets/p2-winner-screen.png");
    this.load.audio("theme", ["/assets/intro_theme2.mp3"]);
    this.load.image("play", "/assets/playing.png");
    this.load.image("pause", "/assets/muted.png");
  }

  create() {
    var bg = this.add.sprite(0, 0, "p2Wins");
    bg.setOrigin(0, 0);
    var play = this.add.image(70, 70, "play");
    var pause = this.add.image(70, 70, "pause");
    play.setVisible(false)
    play.setActive(false)
    this.theme = this.sound.add("theme", { loop: true, volume: 1 });
    this.theme.play();

    var playAgain = this.make.text({
      x: 240,
      y: 525,
      text: "BACK TO MAIN MENU",
      style: {
        font: "bold 30px Marker Felt",
        fill: "red",
        wordWrap: { width: 400 },
      },
    });

    playAgain.setInteractive({ useHandCursor: true });
    playAgain.on("pointerdown", () => this.clickButton());
    play.setInteractive({ useHandCursor: true });
    play.on("pointerdown", () => {
      this.game.sound.mute = false;
      play.setVisible(false)
      play.setActive(false)
      pause.setVisible(true)
      pause.setActive(true)
    });
    pause.setInteractive({ useHandCursor: true });
    pause.on("pointerdown", () => {
      this.game.sound.mute = true;
      play.setVisible(true)
      play.setActive(true)
      pause.setVisible(false)
      pause.setActive(false)
    });
  }

  clickButton() {
    location.reload();
  }
}

export default PlayerTwoWins;
