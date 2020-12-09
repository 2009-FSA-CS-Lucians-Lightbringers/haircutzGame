class RedPlayerWaitingRoom extends Phaser.Scene {
  constructor() {
    super({ key: "redPlayerWaitingRoom" });
    this.theme;
  }

  preload() {
    this.load.image(
      "redPlayerWaitingRoom",
      "/assets/waiting_room_background2.png"
    );
    this.load.spritesheet("waitingSprite", "/assets/waiting_room_sprite2.png", {
      frameWidth: 150,
      frameHeight: 179,
    });
    this.load.image("play", "/assets/play.png");
    this.load.image("pause", "/assets/pause.png");
    this.load.audio("theme", ["/assets/intro_theme2.mp3"]);
  }

  create() {
    var bg = this.add.sprite(0, 0, "redPlayerWaitingRoom");
    bg.setOrigin(0, 0);
    let self = this;
    this.game.switchTime = this.time.now;

    var play = this.add.image(70, 70, "play");
    var pause = this.add.image(125, 70, "pause");
    this.theme = this.sound.add("theme", { loop: true, volume: 1 });

    const waitingSprite = this.add.sprite(390, 295, "waitingSprite", 0);

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

    var waiting = this.make.text({
      x: 165,
      y: 55,
      text: "YOU ARE THE RED PLAYER, ENTERING THE GAME SHORTLY...",
      style: {
        font: "bold 38px Marker Felt",
        fill: "red",
        wordWrap: { width: 600 },
      },
    });

    play.setInteractive({ useHandCursor: true });
    play.on("pointerdown", () => {
      self.game.sound.mute = false;
    });
    pause.setInteractive({ useHandCursor: true });
    pause.on("pointerdown", () => {
      self.game.sound.mute = true;
    });
  }

  update(time, delta) {
    if (this.game.switchTime) {
      if (this.game.switchTime + 5000 < this.time.now) {
        this.scene.switch("preStart");
      }
    }
  }
}

export default RedPlayerWaitingRoom;
