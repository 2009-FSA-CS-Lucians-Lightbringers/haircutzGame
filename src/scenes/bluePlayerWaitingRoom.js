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
    this.load.image("play", "/assets/play.png");
    this.load.image("pause", "/assets/pause.png");
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

    var play = this.add.image(70, 70, "play");
    var pause = this.add.image(125, 70, "pause");
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

    var waiting = this.make.text({
      x: 165,
      y: 55,
      text: "YOU ARE THE BLUE PLAYER, WAITING FOR THE RED PLAYER...",
      style: {
        font: "bold 30px Marker Felt",
        fill: "blue",
        wordWrap: { width: 515 },
      },
    });

    var waitingRoomCode = this.make.text({
      x: 172,
      y: 145,
      text: "ROOM CODE:",
      style: {
        font: "bold 40px Marker Felt",
        fill: "red",
        wordWrap: { width: 500 },
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

export default BluePlayerWaitingRoom;
