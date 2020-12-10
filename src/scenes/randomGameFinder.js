class RandomGameFinder extends Phaser.Scene {
  constructor() {
    super({ key: "randomGameFinder" });
  }

  preload() {
    this.load.image(
      "redPlayerWaitingRoom",
      "/assets/waiting_room_background2.png"
    );
    this.load.spritesheet(
      "waitingSprite",
      "/assets/waiting_room_sprite2.png",
      {
        frameWidth: 150,
        frameHeight: 179,
      }
    );
    this.load.image("play", "/assets/playing.png");
    this.load.image("pause", "/assets/muted.png");
    this.load.audio("theme", ["/assets/intro_theme2.mp3"]);
  }

  create() {
    var bg = this.add.sprite(0, 0, "redPlayerWaitingRoom");
    bg.setOrigin(0, 0);
    let self = this;
    this.game.switchTime = this.time.now;

    var play = this.add.image(70, 70, "play");
    var pause = this.add.image(70, 70, "pause");
    play.setVisible(false)
    play.setActive(false)

    const waitingSprite = this.add.sprite(400, 295, "waitingSprite", 0);

    this.anims.create({
      key: "wait",
      repeat: -1,
      frameRate: 5,
      frames: this.anims.generateFrameNames("waitingSprite", {
        start: 10,
        end: 0,
      }),
    });
    waitingSprite.play("wait");

    this.waiting = this.make
      .text({
        x: 400,
        y: 80,
        text: "LOOKING FOR AN OPEN GAME...",
        style: {
          align: "center",
          font: "bold 30px Marker Felt",
          fill: "red",
          wordWrap: { width: 500 },
        },
      })
      .setOrigin(0.5);

    play.setInteractive({ useHandCursor: true });
    play.on("pointerdown", () => {
      self.game.sound.mute = false;
      play.setVisible(false)
      play.setActive(false)
      pause.setVisible(true)
      pause.setActive(true)
    });
    pause.setInteractive({ useHandCursor: true });
    pause.on("pointerdown", () => {
      self.game.sound.mute = true;
      play.setVisible(true)
      play.setActive(true)
      pause.setVisible(false)
      pause.setActive(false)
    });
  }

  update(time, delta) {
    if (this.resetTime) {
      this.game.switchTime = this.time.now;
      this.resetTime = false;
    }
    if (this.game.switchTime) {
      if (!this.game.roomCode) {
        if (this.game.switchTime + 3000 < this.time.now) {
          this.waiting.text = "NO OPEN GAMES FOUND. REDIRECTING TO MAIN MENU.";
        }
        if (this.game.switchTime + 6000 < this.time.now) {
          this.game.switchTime = this.time.now;
          this.resetTime = true;
          this.scene.switch("introScene");
          this.waiting.text = "LOOKING FOR AN OPEN GAME...";
        }
      } else {
        if (this.game.switchTime + 2000 < this.time.now) {
          this.waiting.text = "YOU ARE RED PLAYER. ENTERING ROOM...";
        }
        if (this.game.switchTime + 5000 < this.time.now) {
          this.scene.switch("preStart");
        }
      }
    }
  }
}

export default RandomGameFinder;
