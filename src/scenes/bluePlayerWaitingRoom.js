class BluePlayerWaitingRoom extends Phaser.Scene {
  constructor() {
    super({ key: "bluePlayerWaitingRoom" });
    this.theme;
  }

  preload() {
    this.load.image(
      "bluePlayerWaitingRoom",
      "/assets/waiting_room_background.png"
    );
    this.load.spritesheet("waitingSprite", "/assets/waiting_room_sprite1.png", {
      frameWidth: 150,
      frameHeight: 178,
    });
    this.load.image("play", "/assets/playing.png");
    this.load.image("pause", "/assets/muted.png");
    this.load.audio("theme", ["/assets/intro_theme2.mp3"]);
  }

  create() {
    this.game.socket.emit("createGame");
    var bg = this.add.sprite(0, 0, "bluePlayerWaitingRoom");
    bg.setOrigin(0, 0);
    let self = this;

    this.game.socket.on("roomCode", function (roomCode) {
      self.game.roomCode = roomCode;
      waitingRoomCode.text = `ROOM CODE: ${self.game.roomCode}`;
    });

    this.game.socket.on("roomFound", function () {
      self.game.switchTime = self.time.now;
    });

    this.game.socket.on("randomJoin", function () {
      self.game.switchTime = self.time.now;
    });

    var play = this.add.image(70, 70, "play");
    var pause = this.add.image(70, 70, "pause");
    play.setVisible(false)
    play.setActive(false)
    this.theme = this.sound.add("theme", { loop: true, volume: 1 });

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

    var button = this.add.rectangle(400, 140, 250, 30, 0x89cff0).setOrigin(0.5);
    button.setStrokeStyle(4, 0xffffff);
    button.setInteractive({ useHandCursor: true });

    button.on("pointerdown", function () {
      button.fillColor = "0x15a5ff";
      button.setStrokeStyle(2, 0xefc53f);
      playRandom.text = "Finding Opponent...";
      self.game.socket.emit("openRoom");
    });

    var waiting = this.make
      .text({
        x: 400,
        y: 80,
        text: "YOU ARE BLUE PLAYER, WAITING FOR RED PLAYER",
        style: {
          align: "center",
          font: "bold 30px Marker Felt",
          fill: "blue",
          wordWrap: { width: 500 },
        },
      })
      .setOrigin(0.5);

    var playRandom = this.make
      .text({
        x: 400,
        y: 140,
        text: "Match With Random Opponent",
        style: {
          align: "center",
          font: "bold 16px Marker Felt",
          fill: "black",
          wordWrap: { width: 500 },
        },
      })
      .setOrigin(0.5);

    var waitingRoomCode = this.make
      .text({
        x: 400,
        y: 185,
        text: "ROOM CODE:",
        style: {
          align: "center",
          font: "bold 40px Marker Felt",
          fill: "red",
          wordWrap: { width: 500 },
        },
      })
      .setOrigin(0.5);

    var backToMain = this.make
      .text({
        x: 650,
        y: 525,
        text: "Back to Main Menu",
        style: {
          align: "center",
          font: "bold 18px Marker Felt",
          fill: "blue",
          wordWrap: { width: 500 },
        },
      })
      .setOrigin(0.5);

    backToMain.setInteractive({ useHandCursor: true });
    backToMain.on("pointerdown", () => {
      location.reload();
    });

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
    if (this.game.switchTime) {
      if (this.game.switchTime + 5000 < this.time.now) {
        this.scene.switch("preStart");
      }
    }
  }
}

export default BluePlayerWaitingRoom;
