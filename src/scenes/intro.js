class IntroScene extends Phaser.Scene {
  constructor() {
    super({key: 'introScene'})
    this.clickButton = this.clickButton.bind(this);
  }

  preload() {
    this.load.image('intro', 'src/assets/haircutz_intro.png')
    this.load.image('logo', 'src/assets/logo_underline.png');

  }

  create() {
    var bg = this.add.sprite(0,0, 'intro');
    bg.setOrigin(0,0)

    this.add.image(415, 242, "logo");


    var createGame = this.make.text({
      x: 295,
      y: 335,
      text: 'CREATE GAME',
      style: {
          font: 'bold 30px Marker Felt',
          fill: 'blue',
          wordWrap: { width: 400}
      }
    });

    var browseGames = this.make.text({
      x: 285,
      y: 380,
      text: 'BROWSE GAMES',
      style: {
          font: 'bold 30px Marker Felt',
          fill: 'red',
          wordWrap: { width: 400}
      }
    });

    var joinGame = this.make.text({
      x: 323,
      y: 425,
      text: 'JOIN GAME',
      style: {
          font: 'bold 30px Marker Felt',
          fill: 'blue',
          wordWrap: { width: 400}
      }
    });

    var credits = this.make.text({
      x: 342,
      y: 470,
      text: 'CREDITS',
      style: {
          font: 'bold 30px Marker Felt',
          fill: 'red',
          wordWrap: { width: 400}
      }
    });

    joinGame.setInteractive({ useHandCursor: true });
    joinGame.on('pointerdown', () => this.clickButton());
  }

  clickButton() {
    this.scene.switch('game');
}

};

export default IntroScene

