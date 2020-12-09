class PreStart extends Phaser.Scene {
	constructor() {
		super({ key: 'preStart' });
		// this.clickButton = this.clickButton.bind(this);
		this.theme;
		this.redPlayerReady = false;
		this.bluePlayerReady = false;
	}

	preload() {
		this.load.image('preStart', '/assets/pre_start_screen2.png');
		this.load.spritesheet(
			'waitingSprite1',
			'/assets/waiting_room_sprite1_v2.png',
			{ frameWidth: 150, frameHeight: 179 }
		);
		this.load.spritesheet(
			'waitingSprite2',
			'/assets/waiting_room_sprite_2_v2.png',
			{ frameWidth: 150, frameHeight: 179 }
		);
		this.load.image('play', '/assets/play.png');
		this.load.image('pause', '/assets/pause.png');
		// this.load.audio("theme", ["/assets/intro_theme2.mp3"]);
	}

	create() {
		var bg = this.add.sprite(0, 0, 'preStart');
		bg.setOrigin(0, 0);
		var self = this;
		var roomCode = this.game.roomCode;

		const waitingSprite1 = this.add.sprite(275, 305, 'waitingSprite1', 0);
		const waitingSprite2 = this.add.sprite(525, 305, 'waitingSprite2', 0);

		var play = this.add.image(70, 70, 'play');
		var pause = this.add.image(125, 70, 'pause');
		this.theme = this.sound.add('theme', { loop: true, volume: 1 });

		this.anims.create({
			key: 'wait1',
			repeat: -1,
			frameRate: 5,
			frames: this.anims.generateFrameNames('waitingSprite1', {
				start: 10,
				end: 0,
			}),
		});
		waitingSprite1.play('wait1');

		this.anims.create({
			key: 'wait2',
			repeat: -1,
			frameRate: 5,
			frames: this.anims.generateFrameNames('waitingSprite2', {
				start: 10,
				end: 0,
			}),
		});
		waitingSprite2.play('wait2');

		var bluePlayerText = this.make.text({
			x: 125,
			y: 95,
			text: 'BLUE PLAYER READY?',
			style: {
				font: 'bold 40px Marker Felt',
				color: 'blue',
				wordWrap: { width: 300 },
			},
		});

		var blueClickText = this.make.text({
			x: 125,
			y: 180,
			text: '(CLICK ABOVE)',
			style: {
				font: 'bold 18px Marker Felt',
				color: 'blue',
				wordWrap: { width: 300 },
			},
		});

		var redPlayerText = this.make.text({
			x: 430,
			y: 95,
			text: 'RED PLAYER READY?',
			style: {
				font: 'bold 40px Marker Felt',
				color: 'red',
				wordWrap: { width: 300 },
			},
		});

		var redClickText = this.make.text({
			x: 430,
			y: 180,
			text: '(CLICK ABOVE)',
			style: {
				font: 'bold 18px Marker Felt',
				color: 'red',
				wordWrap: { width: 300 },
			},
		});

		bluePlayerText.setInteractive({ useHandCursor: true });
		bluePlayerText.on('pointerdown', () => {
			if (this.game.isPlayerA) {
				self.game.socket.emit('bluePlayerReady', roomCode);
			}
		});

		redPlayerText.setInteractive({ useHandCursor: true });
		redPlayerText.on('pointerdown', () => {
			if (this.game.isPlayerB) {
				self.game.socket.emit('redPlayerReady', roomCode);
			}
		});

		this.game.socket.on('redPlayerReady', function () {
			redPlayerText.text = 'RED PLAYER IS READY';
			redClickText.visible = false;
			self.redPlayerReady = true;
			self.playersReady();
		});

		this.game.socket.on('bluePlayerReady', function () {
			bluePlayerText.text = 'BLUE PLAYER IS READY';
			blueClickText.visible = false;
			self.bluePlayerReady = true;
			self.playersReady();
		});

		play.setInteractive({ useHandCursor: true });
		play.on('pointerdown', () => {
			self.game.sound.mute = false;
		});
		pause.setInteractive({ useHandCursor: true });
		pause.on('pointerdown', () => {
			self.game.sound.mute = true;
		});
	}

	playersReady() {
		if (this.bluePlayerReady && this.redPlayerReady) {
			this.theme.stop();
			this.scene.switch('game');
		}
	}
}

export default PreStart;
