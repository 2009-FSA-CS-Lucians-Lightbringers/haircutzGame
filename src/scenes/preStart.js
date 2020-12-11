class PreStart extends Phaser.Scene {
  constructor() {
    super({ key: "preStart" });
    // this.clickButton = this.clickButton.bind(this);
    this.theme;
    this.redPlayerReady = false;
    this.bluePlayerReady = false;
  }

  preload() {
    this.load.image("preStart", "/assets/pre_start_screen2.png");
    this.load.spritesheet(
      "waitingSprite1",
      "/assets/waiting_room_sprite1_v2.png",
      { frameWidth: 150, frameHeight: 179 }
    );
    this.load.spritesheet(
      "waitingSprite2",
      "/assets/waiting_room_sprite_2_v2.png",
      { frameWidth: 150, frameHeight: 179 }
    );
    this.load.image("play", "/assets/playing.png");
    this.load.image("pause", "/assets/muted.png");
    this.load.image("readyPlayer1", "/assets/readyPlayer1.png");
    this.load.image("readyPlayer2", "/assets/readyPlayer2.png");
    this.load.audio("theme", ["/assets/intro_theme2.mp3"]);
  }

  create() {
    var bg = this.add.sprite(0, 0, "preStart");
    bg.setOrigin(0, 0);
    var self = this;
    var roomCode = this.game.roomCode;

    this.waitingSprite1 = this.add.sprite(275, 305, "waitingSprite1", 0);
    this.waitingSprite2 = this.add.sprite(525, 305, "waitingSprite2", 0);
    this.readyImage1 = this.add.image(275, 305, "readyPlayer1");
    this.readyImage2 = this.add.image(525, 305, "readyPlayer2");
    this.readyImage1.setVisible(false);
    this.readyImage2.setVisible(false);

    var play = this.add.image(70, 70, "play");
    var pause = this.add.image(70, 70, "pause");
    play.setVisible(false);
    play.setActive(false);
    this.theme = this.sound.add("theme", { loop: true, volume: 1 });

    this.anims.create({
      key: "wait1",
      repeat: -1,
      frameRate: 5,
      frames: this.anims.generateFrameNames("waitingSprite1", {
        start: 10,
        end: 0,
      }),
    });
    this.waitingSprite1.play("wait1");

    this.anims.create({
      key: "wait2",
      repeat: -1,
      frameRate: 5,
      frames: this.anims.generateFrameNames("waitingSprite2", {
        start: 10,
        end: 0,
      }),
    });
    this.waitingSprite2.play("wait2");

    this.bluePlayerText = this.make.text({
      x: 125,
      y: 95,
      text: "BLUE PLAYER READY?",
      style: {
        font: "bold 40px Marker Felt",
        color: "blue",
        wordWrap: { width: 300 },
      },
    });

    this.blueClickText = this.make.text({
      x: 125,
      y: 180,
      text: "(CLICK ABOVE)",
      style: {
        font: "bold 18px Marker Felt",
        color: "blue",
        wordWrap: { width: 300 },
      },
    });

    this.redPlayerText = this.make.text({
      x: 430,
      y: 95,
      text: "RED PLAYER READY?",
      style: {
        font: "bold 40px Marker Felt",
        color: "red",
        wordWrap: { width: 300 },
      },
    });

    this.redClickText = this.make.text({
      x: 430,
      y: 180,
      text: "(CLICK ABOVE)",
      style: {
        font: "bold 18px Marker Felt",
        color: "red",
        wordWrap: { width: 300 },
      },
    });

    var backToMain = this.make
      .text({
        x: 680,
        y: 525,
        text: "Back to Main Menu",
        style: {
          align: "center",
          font: "bold 18px Marker Felt",
          fill: "blue",
          wordWrap: { width: 100 },
        },
      })
      .setOrigin(0.5);

    backToMain.setInteractive({ useHandCursor: true });
    backToMain.on("pointerdown", () => {
      location.reload();
    });

    this.bluePlayerText.setInteractive({ useHandCursor: true });
    this.bluePlayerText.on("pointerdown", () => {
      if (this.game.isPlayerA) {
        self.game.socket.emit("bluePlayerReady", roomCode);
      }
    });

    this.redPlayerText.setInteractive({ useHandCursor: true });
    this.redPlayerText.on("pointerdown", () => {
      if (this.game.isPlayerB) {
        self.game.socket.emit("redPlayerReady", roomCode);
      }
    });

    play.setInteractive({ useHandCursor: true });
    play.on("pointerdown", () => {
      self.game.sound.mute = false;
      play.setVisible(false);
      play.setActive(false);
      pause.setVisible(true);
      pause.setActive(true);
    });
    pause.setInteractive({ useHandCursor: true });
    pause.on("pointerdown", () => {
      self.game.sound.mute = true;
      play.setVisible(true);
      play.setActive(true);
      pause.setVisible(false);
      pause.setActive(false);
    });
  }

  playersReady() {
    if (this.bluePlayerReady && this.redPlayerReady) {
      this.theme.stop();
      this.scene.switch("game");
    }
  }

  update(time, delta) {
    if (this.game.redPlayerReady && !this.redPlayerReady) {
      this.redPlayerText.text = "RED PLAYER IS READY";
      this.redClickText.visible = false;
      this.waitingSprite2.setVisible(false);
      this.waitingSprite2.setActive(false);
      this.readyImage2.setVisible(true);
      this.redPlayerReady = true;
      this.playersReady();
    }

    if (this.game.bluePlayerReady && !this.bluePlayerReady) {
      this.bluePlayerText.text = "BLUE PLAYER IS READY";
      this.blueClickText.visible = false;
      this.waitingSprite1.setVisible(false);
      this.waitingSprite1.setActive(false);
      this.readyImage1.setVisible(true);
      this.bluePlayerReady = true;
      this.playersReady();
    }
  }
}

export default PreStart;
