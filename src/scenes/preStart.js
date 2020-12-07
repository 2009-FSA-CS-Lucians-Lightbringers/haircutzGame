class PreStart extends Phaser.Scene {
  constructor() {
    super({ key: "preStart" });
    this.clickButton = this.clickButton.bind(this);
    this.theme;
  }

  preload() {
    this.load.image("preStart", "/assets/pre_start_screen.png");
    this.load.spritesheet("waitingSprite1", "/assets/waiting_room_sprite1.png", {frameWidth: 150, frameHeight: 179})
    this.load.spritesheet("waitingSprite2", "/assets/waiting_room_sprite2.png", {frameWidth: 150, frameHeight: 179})
    this.load.image("play", "/assets/play.png");
    this.load.image("pause", "/assets/pause.png");
    this.load.audio("theme", ["/assets/intro_theme2.mp3"]);
  }

  create() {
    var bg = this.add.sprite(0, 0, "preStart");
    bg.setOrigin(0, 0);

    const waitingSprite1 = this.add.sprite(525, 305, "waitingSprite1", 0);
    const waitingSprite2 = this.add.sprite(275, 305, "waitingSprite2", 0);

    var play = this.add.image(70, 70, "play" )
    var pause = this.add.image(125, 70, "pause" )
    this.theme = this.sound.add("theme", { loop: true, volume: 1 });
    this.theme.play()


   this.anims.create({
      key: "wait1",
      repeat: -1,
      frameRate: 5,
      frames: this.anims.generateFrameNames("waitingSprite1", {start: 10, end: 0})
    });
    waitingSprite1.play("wait1")

    this.anims.create({
      key: "wait2",
      repeat: -1,
      frameRate: 5,
      frames: this.anims.generateFrameNames("waitingSprite2", {start: 10, end: 0})
    });
    waitingSprite2.play("wait2")

    var start = this.make.text({
      x: 125,
      y: 85,
      text: "START",
      style: {
        font: "bold 80px Marker Felt",
        fill: "red",
        wordWrap: { width: 500 },
      },
    });

    var game= this.make.text({
      x: 430,
      y: 85,
      text: "GAME",
      style: {
        font: "bold 80px Marker Felt",
        fill: "blue",
        wordWrap: { width: 500 },
      },
    });

    start.setInteractive({ useHandCursor: true });
    start.on("pointerdown", () => this.clickButton());
    game.setInteractive({ useHandCursor: true });
    game.on("pointerdown", () => this.clickButton());
    play.setInteractive({ useHandCursor: true });
    play.on("pointerdown", () => {
      this.theme.play()
    })
    pause.setInteractive({ useHandCursor: true });
    pause.on("pointerdown", () => {
      this.theme.stop()
    })
  }

  clickButton() {
    this.theme.stop()
    this.scene.switch("game");
  }
}

export default PreStart;
