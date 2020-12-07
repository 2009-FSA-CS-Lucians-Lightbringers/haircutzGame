class WaitingRoom extends Phaser.Scene {
  constructor() {
    super({ key: "waitingRoom" });
    this.clickButton = this.clickButton.bind(this);
    this.theme;
  }

  preload() {
    this.load.image("waitingRoom", "/assets/waiting_room_background.png");
    this.load.spritesheet("waitingSprite", "/assets/waiting_room_sprite1.png", {frameWidth: 150, frameHeight: 178});
    this.load.image("play", "/assets/play.png");
    this.load.image("pause", "/assets/pause.png");
    this.load.audio("theme", ["/assets/intro_theme2.mp3"]);
  }

  create() {
    this.game.socket.emit('createGame');
    var bg = this.add.sprite(0, 0, "waitingRoom");
    bg.setOrigin(0, 0);
    let self = this

    this.game.socket.on('roomCode', function(roomCode){
      self.game.roomCode = roomCode
      waitingRoomCode.text = `ROOM CODE: ${self.game.roomCode}`
    })

    this.game.socket.on("preStart", function() {
      this.scene.switch("preStart")
    })

    var play = this.add.image(70, 70, "play" )
    var pause = this.add.image(125, 70, "pause" )
    this.theme = this.sound.add("theme", { loop: true, volume: 1 });
    this.theme.play()

    const waitingSprite = this.add.sprite(400, 295, "waitingSprite", 0);


   this.anims.create({
      key: "wait",
      repeat: -1,
      frameRate: 5,
      frames: this.anims.generateFrameNames("waitingSprite", {start: 10, end: 0})
    });
    waitingSprite.play("wait")

    var waiting = this.make.text({
      x: 165,
      y: 55,
      text: "WAITING FOR PLAYER 2",
      style: {
        font: "bold 40px Marker Felt",
        fill: "blue",
        wordWrap: { width: 500 },
      },
    });

    var waitingRoomCode = this.make.text({
      x: 172,
      y: 125,
      text: "ROOM CODE:",
      style: {
        font: "bold 40px Marker Felt",
        fill: "red",
        wordWrap: { width: 500 },
      },
    });

    waiting.setInteractive({ useHandCursor: true });
    waiting.on("pointerdown", () => this.clickButton());
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
    this.scene.switch("preStart");
  }


}

export default WaitingRoom;
