class Credits extends Phaser.Scene {
  constructor() {
    super({ key: "credits" });
    this.theme;
  }

  preload() {
    this.load.image("intro", "/assets/haircutz_intro.png");
    this.load.image("play", "/assets/play.png");
    this.load.image("pause", "/assets/pause.png");
    this.load.image("arrow1", "/assets/arrow1.png")
    this.load.image("arrow2", "/assets/arrow2.png")
    this.load.audio("theme", ["/assets/intro_theme2.mp3"]);
  }

  create() {
    var bg = this.add.sprite(0, 0, "intro");
    bg.setOrigin(0, 0);
    var play = this.add.image(70, 70, "play");
    var pause = this.add.image(135, 70, "pause");
    var arrow1 = this.add.image(195, 360, "arrow1")
    var arrow2 = this.add.image(625, 360, "arrow2")
    this.theme = this.sound.add("theme", { loop: true, volume: 0.5 });
    let self = this;
    this.add.image(70, 70, "play");
    this.add.image(135, 70, "pause");

    var creditsText = this.make
      .text({
        x: 415,
        y: 235,
        text: "CREATED AND DESIGNED BY:",
        style: {
          align: "center",
          font: "bold 30px Marker Felt",
          fill: "blue",
          wordWrap: { width: 450 },
        },
      })
      .setOrigin(0.5);

      var jesseText = this.make
      .text({
        x: 415,
        y: 272,
        text: "JESSE SWEDLUND",
        style: {
          align: "center",
          font: "bold 20px Marker Felt",
          fill: "red",
          wordWrap: { width: 450 },
        },
      })
      .setOrigin(0.5);

      var andrewText = this.make
      .text({
        x: 415,
        y: 302,
        text: "ANDREW COHEN",
        style: {
          align: "center",
          font: "bold 20px Marker Felt",
          fill: "red",
          wordWrap: { width: 450 },
        },
      })
      .setOrigin(0.5);

      var timText = this.make
      .text({
        x: 415,
        y: 332,
        text: "TIMOTHY SAMUEL",
        style: {
          align: "center",
          font: "bold 20px Marker Felt",
          fill: "red",
          wordWrap: { width: 450 },
        },
      })
      .setOrigin(0.5);

      var minText = this.make
      .text({
        x: 415,
        y: 362,
        text: "MIN KYU HAN",
        style: {
          align: "center",
          font: "bold 20px Marker Felt",
          fill: "red",
          wordWrap: { width: 450 },
        },
      })
      .setOrigin(0.5);

      var musicCreditsText = this.make
      .text({
        x: 415,
        y: 415,
        text: "MUSIC CREDITS:",
        style: {
          align: "center",
          font: "bold 30px Marker Felt",
          fill: "blue",
          wordWrap: { width: 450 },
        },
      })
      .setOrigin(0.5);

      var introMusicText = this.make
      .text({
        x: 415,
        y: 452,
        text: "ANDREW COHEN - INTRO THEME",
        style: {
          align: "center",
          font: "bold 20px Marker Felt",
          fill: "red",
          wordWrap: { width: 450 },
        },
      })
      .setOrigin(0.5);

      var lakeyText = this.make
      .text({
        x: 415,
        y: 482,
        text: "LAKEY - WATCHING THE CLOUDS",
        style: {
          align: "center",
          font: "bold 20px Marker Felt",
          fill: "red",
          wordWrap: { width: 450 },
        },
      })
      .setOrigin(0.5);

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

    arrow1.setInteractive({ useHandCursor: true });
    arrow1.on("pointerdown", () => {
      this.scene.switch("introScene");
    });

    arrow2.setInteractive({ useHandCursor: true });
    arrow2.on("pointerdown", () => {
      this.scene.switch("introScene");
    });

  }
}

export default Credits;
