import io from "socket.io-client";

class IntroScene extends Phaser.Scene {
  constructor() {
    super({ key: "introScene" });
    this.theme;
  }

  preload() {
    this.load.image("intro", "/assets/haircutz_intro.png");
    this.load.image("logo", "/assets/logo_underline.png");
    this.load.image("play", "/assets/play.png");
    this.load.image("pause", "/assets/pause.png");
    this.load.html("joinRoom", "/assets/joinRoom.html");
    this.load.audio("theme", ["/assets/intro_theme2.mp3"]);
  }

  create() {
    var bg = this.add.sprite(0, 0, "intro");
    bg.setOrigin(0, 0);
    var play = this.add.image(70, 70, "play");
    var pause = this.add.image(135, 70, "pause");
    this.theme = this.sound.add("theme", { loop: true, volume: 0.5 });
    this.theme.play();
    let self = this;

    this.add.image(415, 242, "logo");
    this.add.image(70, 70, "play");
    this.add.image(135, 70, "pause");

    var createGame = this.make.text({
      x: 295,
      y: 335,
      text: "CREATE GAME",
      style: {
        font: "bold 30px Marker Felt",
        fill: "blue",
        wordWrap: { width: 400 },
      },
    });

    var browseGames = this.make.text({
      x: 285,
      y: 380,
      text: "BROWSE GAMES",
      style: {
        font: "bold 30px Marker Felt",
        fill: "red",
        wordWrap: { width: 400 },
      },
    });

    var joinGame = this.make.text({
      x: 323,
      y: 425,
      text: "JOIN GAME",
      style: {
        font: "bold 30px Marker Felt",
        fill: "blue",
        wordWrap: { width: 400 },
      },
    });

    var credits = this.make.text({
      x: 342,
      y: 470,
      text: "CREDITS",
      style: {
        font: "bold 30px Marker Felt",
        fill: "red",
        wordWrap: { width: 400 },
      },
    });

    //Play button
    play.setInteractive({ useHandCursor: true });
    play.on("pointerdown", () => {
      self.game.sound.mute = false;
    });
    //Pause button
    pause.setInteractive({ useHandCursor: true });
    pause.on("pointerdown", () => {
      self.game.sound.mute = true;
    });

    //Create Game
    createGame.setInteractive({ useHandCursor: true });
    createGame.on("pointerdown", () => {
      this.scene.switch("bluePlayerWaitingRoom");
    });

    //Join Game
    joinGame.setInteractive({ useHandCursor: true });
    joinGame.on("pointerdown", () => {
      const form = this.add.dom(450, 360, "div").createFromCache("joinRoom");
      form.addListener("click");
      form.on("click", (event) => {
        event.preventDefault();
        if (event.target.name === "submit") {
          console.log("did this submit?");
          const roomCode = form.getChildByName("roomName").value; // Grabs the value from the text input
          console.log("room code length", roomCode.length);
          if (roomCode.length === 6) {
            this.game.socket.emit("findRoom", roomCode); // Look for room and checking if room exists
          } else console.log("ERROR: No room specified"); // Text input was left empty
        }
      });
    });

    this.game.socket.on("roomFound", (roomCode) => {
      self.game.roomCode = roomCode;
      if (!self.game.isPlayerA) {
        this.scene.switch("redPlayerWaitingRoom");
      }
    });

    this.game.socket.on("roomNotFound", () => {
      console.log("ROOM NOT FOUND!");
      //present a message in the canvas that says room not found
    });

    this.game.socket.on("stopTheme", () => {
      self.theme.stop();
    });
  }
}

export default IntroScene;
