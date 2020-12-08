import io from 'socket.io-client';
import Zone from '../helpers/zone.js';
import Enemy from '../helpers/enemy.js';
import Attacker from '../helpers/attacker.js';
import Turret from '../helpers/turret.js';
import Bullet from '../helpers/bullet.js';
import HomeBase from '../helpers/homeBase.js';
import EnemyBase from '../helpers/enemyBase.js';

export default class Game extends Phaser.Scene {
	constructor() {
		super({
			key: 'game',
		});
		//game properties
		this.isPlayerA = false;
		this.isPlayerB = false;
		this.scissor;
		this.myEnemies = [];
		this.myAttackers = [];
		this.enemyNumber = -1;
		this.attackerNumber = -1;
		this.SCISSOR_SPEED = 1 / 10000;
		this.BULLET_DAMAGE = 20;
		this.gameTheme;
		this.ouch;
		this.snips;
		this.plop;
		this.bulletSound;
		this.play;
		this.pause;
		this.woohoo;
		this.path1;
		this.path2;
		this.path3;
		this.path1Zone;
		this.path2ZoneL;
		this.path2ZoneR;
		this.path3ZoneL;
		this.path3ZoneR;
		this.path4;
		this.enemies;
		this.attackers;
		this.turrets;
		this.bullets;
		this.enemyBase;
		this.blueScore = 5;
		this.redScore = 5;
		this.blueText;
		this.redText;
		this.resourcePoints = 12;
		this.oppResourcePoints = 12;
		this.resourceText;
		this.counter = 10;
		this.clock;
		this.timer;
		this.gameOver = false;
		this.attackerReleased = -2000;
		this.map = [
			[-1, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1, -1],
			[-1, 0, 0, -1, -1, 0, -1, -1, -1, -1, -1, -1],
			[-1, 0, -1, 0, 0, 0, -1, -1, -1, -1, -1, -1],
			[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
			[-1, 0, -1, 0, 0, 0, -1, -1, -1, -1, -1, -1],
			[-1, 0, 0, -1, -1, 0, -1, -1, -1, -1, -1, -1],
			[-1, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1, -1],
		];
		this.map2 = [
			[-1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, -1],
			[-1, -1, -1, -1, -1, -1, 0, -1, -1, 0, 0, -1],
			[-1, -1, -1, -1, -1, -1, 0, 0, 0, -1, 0, -1],
			[-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
			[-1, -1, -1, -1, -1, -1, 0, 0, 0, -1, 0, -1],
			[-1, -1, -1, -1, -1, -1, 0, -1, -1, 0, 0, -1],
			[-1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, -1],
		];
		this.spawnScissor = this.spawnScissor.bind(this);
		this.touchBase = this.touchBase.bind(this);
		this.choosePath = this.choosePath.bind(this);
		this.damageEnemy = this.damageEnemy.bind(this);
		this.damageAttacker = this.damageAttacker.bind(this);
		this.placeTurret = this.placeTurret.bind(this);
		this.canPlaceTurret = this.canPlaceTurret.bind(this);
		this.addBullet = this.addBullet.bind(this);
		this.getEnemy = this.getEnemy.bind(this);
		this.getAttacker = this.getAttacker.bind(this);
		this.decrementBlueScore = this.decrementBlueScore.bind(this);
		this.decrementRedScore = this.decrementRedScore.bind(this);
		this.resourceTimer = this.resourceTimer.bind(this);
		this.drawGrid = this.drawGrid.bind(this);
		this.drawZone = this.drawZone.bind(this);
	}

	//Game methods
	//Enemy methods

	touchBase(enemyBase, enemy) {
		// enemy.setActive(false);
		// enemy.setVisible(false);
		this.snips.stop();
		enemy.destroy();
		// }
	}

	choosePath(enemy, path) {
		enemy.startOnPath(path);
	}

	damageEnemy(enemy, bullet) {
		if (bullet.createdByPlayerA === this.isPlayerA) {
			// only if both enemy and bullet are alive
			if (enemy.active === true && bullet.active === true) {
				// we remove the bullet right away
				bullet.setActive(false);
				bullet.setVisible(false);

				// decrease the enemy hp with BULLET_DAMAGE
				let bulletDamage = this.BULLET_DAMAGE;
				//onsole.log(this.scene.BULLET_DAMAGE);
				enemy.receiveDamage(bulletDamage);
			}
		}
	}

	damageAttacker(attacker, bullet) {
		if (bullet.createdByPlayerA !== this.isPlayerA) {
			// only if both enemy and bullet are alive
			if (attacker.active === true && bullet.active === true) {
				// we remove the bullet right away
				bullet.setActive(false);
				bullet.setVisible(false);

				// decrease the enemy hp with BULLET_DAMAGE
				let bulletDamage = this.BULLET_DAMAGE;
				//onsole.log(this.scene.BULLET_DAMAGE);
				attacker.receiveDamage(bulletDamage);
			}
		}
	}

	spawnScissor(event) {
		let path;
		if (event.path === 1) path = this.path1;
		if (event.path === 2) path = this.path2;
		if (event.path === 3) path = this.path3;
		if (event.isPlayerA === this.isPlayerA) {
			if (this.resourcePoints > 1) {
				var attacker = this.attackers.get();
				this.resourcePoints -= 2;
				this.resourceText.setText('RESOURCE | ' + this.resourcePoints);
				if (attacker) {
					this.snips.play();
					attacker.setActive(true);
					attacker.setVisible(true);
					attacker.startOnPath(path);
					this.myAttackers.push(attacker);
				}
			}
		} else {
			if (this.oppResourcePoints > 1) {
				this.oppResourcePoints -= 2;
				//this.resourceText.setText("RESOURCE | " + this.oppResourcePoints);
				var enemy = this.enemies.get();
				if (enemy) {
					enemy.setActive(true);
					enemy.setVisible(true);
					enemy.startOnPath(path);
					this.myEnemies.push(enemy);
				}
			}
		}
	}

	//Turret methods
	placeTurret(isPlayerA, x, y) {
		var i = Math.floor(y / 64);
		var j = Math.floor(x / 64);
		if (this.canPlaceTurret(isPlayerA, i, j)) {
			if (isPlayerA === this.isPlayerA) {
				if (this.resourcePoints > 2) {
					var turret = this.turrets.get();
					this.resourcePoints -= 3;
					this.resourceText.setText('RESOURCE | ' + this.resourcePoints);
					if (turret) {
						this.plop.play();
						turret.setActive(true);
						turret.setVisible(true);
						turret.place(i, j);
					}
				}
			} else if (this.oppResourcePoints > 2) {
				var turret = this.turrets.get();
				this.oppResourcePoints -= 3;
				if (turret) {
					this.plop.play();
					turret.setActive(true);
					turret.setVisible(true);
					turret.place(i, j);
				}
			}
		}
	}

	canPlaceTurret(isPlayerA, i, j) {
		return isPlayerA ? this.map[i][j] === 0 : this.map2[i][j] === 0;
	}

	addBullet(x, y, angle, createdByPlayerA) {
		var bullet = this.bullets.get();
		bullet.createdByPlayerA = createdByPlayerA;
		if (bullet) {
			this.bulletSound.play();
			bullet.fire(x, y, angle);
		}
	}

	getEnemy(x, y, distance) {
		var enemyUnits = this.enemies.getChildren();
		for (var i = 0; i < enemyUnits.length; i++) {
			if (
				enemyUnits[i].active &&
				Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <=
					distance
			)
				return enemyUnits[i];
		}
		return false;
	}

	getAttacker(x, y, distance) {
		var attackerUnits = this.attackers.getChildren();
		for (var i = 0; i < attackerUnits.length; i++) {
			if (
				attackerUnits[i].active &&
				Phaser.Math.Distance.Between(
					x,
					y,
					attackerUnits[i].x,
					attackerUnits[i].y
				) <= distance
			)
				return attackerUnits[i];
		}
		return false;
	}

	//Score methods
	decrementBlueScore() {
		this.ouch.play();
		this.blueScore -= 1;
		this.blueText.setText('P1 | ' + this.blueScore);
		if (this.blueScore <= 0) {
			this.snips.stop();
			this.gameTheme.stop();
			this.scene.switch('p2Wins');
		}
		return null;
	}

	decrementRedScore() {
		this.ouch.play();
		this.redScore -= 1;
		// this.anims.anims.entries.startingpoint.frames[0].frame.name--
		this.redText.setText('P2 | ' + this.redScore);
		if (this.redScore <= 0) {
			this.snips.stop();
			this.gameTheme.stop();
			this.scene.switch('p1Wins');
		}
		return null;
	}

	resourceTimer() {
		this.counter--;
		this.clock.setText(` ${this.counter}`);
		if (this.counter <= 0) {
			this.resourcePoints += 3;
			this.oppResourcePoints += 3;
			this.resourceText.setText('RESOURCE | ' + this.resourcePoints);
			this.counter += 10;
			this.clock.setText(`${this.counter}`);
		}
	}

	//grid methods
	drawGrid(graphics) {
		for (var i = 1; i < 8; i++) {
			graphics.moveTo(80, i * 64);
			graphics.lineTo(720, i * 64);
		}
		for (var j = 0; j < 11; j++) {
			graphics.moveTo(80 + j * 64, 0);
			graphics.lineTo(80 + j * 64, 450);
		}
		graphics.lineStyle(1, 0x0000ff, 0);

		graphics.strokePath();
	}

	drawZone(graphics, zone) {
		graphics.lineStyle(2, 0xffff00, 0);
		graphics.strokeRect(
			zone.x,
			zone.y,
			zone.input.hitArea.width,
			zone.input.hitArea.height
		);
	}

	preload() {
		// load the game assets –
		this.load.image('background', '/assets/background.png');
		this.load.spritesheet('p1attackers', '/assets/player1_attackers.png', {
			frameWidth: 68,
			frameHeight: 45,
		});
		this.load.spritesheet('p2attackers', '/assets/player2_attackers.png', {
			frameWidth: 68,
			frameHeight: 45,
		});
		this.load.image('p2turret', '/assets/player2_turret.png');
		this.load.image('p1turret', '/assets/player1_turret.png');
		this.load.image('bullet', '/assets/bullet.png');
		this.load.image('scoreboard', '/assets/scoreboard.png');
		this.load.image('blackboard', '/assets/blackboard.png');
		this.load.spritesheet('p1base', '/assets/base1_v2.png', {
			frameWidth: 75,
			frameHeight: 89,
		});

		this.load.spritesheet('p2base', '/assets/p2_base.png', {
			frameWidth: 75,
			frameHeight: 89,
		});

		this.load.image('logo', '/assets/logo_underline.png');
		this.load.image('play', '/assets/play.png');
		this.load.image('clock', '/assets/clock.png');
		this.load.audio('gameTheme', ['/assets/intro_theme.mp3']);
		this.load.audio('snips', ['/assets/snips.mp3']);
		this.load.audio('bulletSound', ['/assets/bullet_sound.mp3']);
		this.load.audio('ouch', ['/assets/ouch.mp3']);
		this.load.audio('woohoo', ['/assets/woohoo.mp3']);
		this.load.audio('plop', ['/assets/plop.mp3']);
	}

	create() {
		this.add.image(400, 300, 'background');
		this.add.image(85, 508, 'scoreboard');
		this.add.image(400, 535, 'blackboard');
		this.add.image(700, 520, 'clock');
		this.play = this.add.image(50, 50, 'play');
		this.pause = this.add.image(105, 50, 'pause');
		this.gameTheme = this.sound.add('gameTheme', { loop: true, volume: 1 });
		// if (this.isPlayerA) {
		// 	self.scissor = self.add.sprite(85, 450, 'p1attackers').setInteractive();
		// 	self.input.setDraggable(self.scissor);
		// } else {
		// 	self.scissor = self.add.sprite(85, 450, 'p2attackers').setInteractive();
		// 	self.input.setDraggable(self.scissor);
		// }
		this.anims.create({
			key: 'blueWalk',
			frames: [
				{ key: 'p1attackers', frame: 1 },
				{ key: 'p1attackers', frame: 2 },
				{ key: 'p1attackers', frame: 3 },
			],
			frameRate: 10,
			repeat: -1,
		});

		this.anims.create({
			key: 'redWalk',
			frames: [
				{ key: 'p2attackers', frame: 1 },
				{ key: 'p2attackers', frame: 2 },
				{ key: 'p2attackers', frame: 3 },
			],
			frameRate: 10,
			repeat: -1,
		});

		this.anims.create({
			key: 'enemyStartingpoint',
			frames: [
				// { key: "p2base", frame: 0 },
				// { key: "p2base", frame: 1 },
				// { key: "p2base", frame: 2 },
				// { key: "p2base", frame: 3 },
				// { key: "p2base", frame: 4 },
				{ key: 'p2base', frame: 5 },
				// { key: "p2base", frame: 6 },
				// { key: "p2base", frame: 7 },
				// { key: "p2base", frame: 8 },
				// { key: "p2base", frame: 9 },
				// { key: "p2base", frame: 10 },
			],
			repeat: -1,
			frameRate: 5,
		});

		this.anims.create({
			key: 'homeStartingpoint',
			frames: [
				// { key: "p1base", frame: 0 },
				// { key: "p1base", frame: 1 },
				// { key: "p1base", frame: 2 },
				// { key: "p1base", frame: 3 },
				// { key: "p1base", frame: 4 },
				{ key: 'p1base', frame: 5 },
				// { key: "p1base", frame: 6 },
				// { key: "p1base", frame: 7 },
				// { key: "p1base", frame: 8 },
				// { key: "p1base", frame: 9 },
				// { key: "p1base", frame: 10 },
			],
			repeat: -1,
			frameRate: 5,
		});

		//sounds
		this.gameTheme = this.sound.add('gameTheme', { loop: true });
		this.snips = this.sound.add('snips', { loop: true, delay: 0, rate: 4 });
		this.ouch = this.sound.add('ouch', { loop: false });
		this.woohoo = this.sound.add('woohoo', { loop: false });
		this.bulletSound = this.sound.add('bulletSound', { loop: false });
		this.plop = this.sound.add('plop', { loop: false });

		this.play.setInteractive({ useHandCursor: true });
		this.play.on('pointerdown', () => {
			this.gameTheme.play();
		});
		this.pause.setInteractive({ useHandCursor: true });
		this.pause.on('pointerdown', () => {
			this.gameTheme.stop();
		});

		//sets the default to "you are not Player A"
		let self = this;

		var redArc1 = this.add.arc(450, 280, 230, 263, 347, false, 0xf4cccc);
		redArc1.setStrokeStyle(3, 0xffffff);
		var redArc2 = this.add.arc(450, 200, 230, 13, 97, false, 0xf4cccc);
		redArc2.setStrokeStyle(3, 0xffffff);
		var blueArc1 = this.add.arc(350, 200, 230, 83, 167, false, 0x9fc5e8);
		blueArc1.setStrokeStyle(3, 0xffffff);
		var blueArc2 = this.add.arc(350, 280, 230, 193, 277, false, 0x9fc5e8);
		blueArc2.setStrokeStyle(3, 0xffffff);
		var RUTri = this.add.triangle(520, 260, 5, 50, 235, 50, 5, -110, 0xf4cccc);
		RUTri.setStrokeStyle(4, 0xffffff);
		var RLTri = this.add.triangle(520, 280, 5, 50, 235, 50, 5, 210, 0xf4cccc);
		RLTri.setStrokeStyle(4, 0xffffff);
		var LUTri = this.add.triangle(
			510,
			260,
			-5,
			50,
			-235,
			50,
			-5,
			-110,
			0x9fc5e8
		);
		LUTri.setStrokeStyle(4, 0xffffff);
		var LUTri = this.add.triangle(
			510,
			280,
			-5,
			50,
			-235,
			50,
			-5,
			210,
			0x9fc5e8
		);
		LUTri.setStrokeStyle(4, 0xffffff);

		// this.zone = new Zone(this);
		// this.dropZone = this.zone.renderZone();
		// this.outline = this.zone.renderOutline(this.dropZone);

		//connecting to our socket on the client-side
		this.socket = io();

		this.socket.on('connect', function () {
			console.log('Connected!');
		});

		//If our client is the first to connect to the server, the server will emit
		//an event that tells the client that it will be Player A.  The client
		//socket receives that event and turns our "isPlayerA" boolean from
		//false to true.
		this.socket.on('isPlayerA', function () {
			self.isPlayerA = true;
			self.scissor = self.add.sprite(85, 450, 'p1attackers').setInteractive();
			self.input.setDraggable(self.scissor);
			console.log('Welcome Blue Player A!');
		});
		this.socket.on('isPlayerB', function () {
			if (!self.isPlayerA) {
				self.isPlayerB = true;
				self.scissor = self.add.sprite(85, 450, 'p2attackers').setInteractive();
				self.input.setDraggable(self.scissor);
				console.log('Welcome Red Player B!');
			}
		});

		// this graphics element is only for visualization,
		// its not related to our path
		var graphics = this.add.graphics();
		this.drawGrid(graphics);

		// the path for our enemies
		// parameters are the start x and y of our path
		this.path1 = this.add.path(125, 240);
		this.path1.lineTo(675, 240);
		this.path2 = this.add.path(125, 240);
		this.path2.lineTo(400, 48);
		this.path2.lineTo(675, 240);

		this.path3 = this.add.path(125, 240);
		this.path3.lineTo(400, 432);
		this.path3.lineTo(675, 240);

		// graphics.lineStyle(3, 0xffffff, 1);

		// visualize the path
		// this.path1.draw(graphics);
		// this.path2.draw(graphics);
		// this.path3.draw(graphics);

		//  A drop zone
		// var zone = this.add.zone(400, 220, 550, 40).setRectangleDropZone(550, 40);
		var path1Points = [132, 253, 673, 252, 673, 226, 132, 227];
		this.path1Zone = this.add.polygon(275, 13, path1Points, 0x00ff00, 0);
		this.path1Zone.setInteractive(
			new Phaser.Geom.Polygon(path1Points),
			Phaser.Geom.Polygon.Contains,
			true
		);
		//An array of paired numbers that represent point coordinates: [x1,y1, x2,y2, ...]
		var pointsFSlash = [132, 228, 153, 228, 389, 65, 379, 51];
		var pointsBSlash = [638, 227, 673, 227, 424, 53, 411, 71];
		var groupPoly = this.add.group();
		this.path2ZoneL = this.add.polygon(
			self.path2.startPoint.x,
			90,
			pointsFSlash,
			0x00ff00,
			0
		);
		this.path2ZoneL.setInteractive(
			new Phaser.Geom.Polygon(pointsFSlash),
			Phaser.Geom.Polygon.Contains,
			true
		);
		this.path2ZoneR = this.add.polygon(128, 90, pointsBSlash, 0x00ff00, 0);
		this.path2ZoneR.setInteractive(
			new Phaser.Geom.Polygon(pointsBSlash),
			Phaser.Geom.Polygon.Contains,
			true
		);

		this.path3ZoneL = this.add.polygon(-150, 274, pointsBSlash, 0x00ff00, 0);
		this.path3ZoneL.setInteractive(
			new Phaser.Geom.Polygon(pointsBSlash),
			Phaser.Geom.Polygon.Contains,
			true
		);
		this.path3ZoneL.name = 3;
		this.path3ZoneR = this.add.polygon(406, 284, pointsFSlash, 0x00ff00, 0);
		this.path3ZoneR.setInteractive(
			new Phaser.Geom.Polygon(pointsFSlash),
			Phaser.Geom.Polygon.Contains,
			true
		);
		this.path1Zone.name = 'path1';
		this.path2ZoneL.name = 'path2';
		this.path2ZoneR.name = 'path2';
		this.path3ZoneL.name = 'path3';
		this.path3ZoneR.name = 'path3';

		var groupZone2 = this.add.group();
		var groupZone3 = this.add.group();
		groupZone2.add(this.path2ZoneL);
		groupZone2.add(this.path2ZoneR);
		groupZone3.add(this.path3ZoneL);
		groupZone3.add(this.path3ZoneR);

		this.enemies = this.physics.add.group({
			classType: Enemy,
			runChildUpdate: true,
		});
		this.nextEnemy = 0;
		this.attackers = this.physics.add.group({
			classType: Attacker,
			runChildUpdate: true,
		});
		this.nextAttacker = 0;
		this.turrets = this.physics.add.group({
			classType: Turret,
			runChildUpdate: true,
		});

		this.resourceText = self.add.text(
			300,
			520,
			`RESOURCE | ` + this.resourcePoints,
			{
				fontFamily: 'Arial Black',
				fontStyle: 'bold',
				fontSize: '24px',
				fill: 'white',
			}
		);

		this.clock = self.add.text(678, 515, `${this.counter}`, {
			fontFamily: 'Arial Black',
			fontStyle: 'bold',
			fontSize: '35px',
			fill: 'black',
		});

		this.timer = this.time.addEvent({
			delay: 1000,
			callback: this.resourceTimer,
			callbackScope: this,
			loop: true,
		});

		this.redText = self.add.text(50, 540, `P2 | ` + this.redScore, {
			fontFamily: 'Arial Black',
			fontStyle: 'bold',
			fontSize: '24px',
			fill: 'white',
		});

		this.blueText = self.add.text(50, 505, `P1 | ` + this.blueScore, {
			fontFamily: 'Arial Black',
			fontStyle: 'bold',
			fontSize: '24px',
			fill: 'white',
		});

		this.bullets = this.physics.add.group({
			classType: Bullet,
			runChildUpdate: true,
		});

		this.homeBase = this.physics.add
			.group({
				classType: HomeBase,
				runChildUpdate: true,
			})
			.create();

		this.enemyBase = this.physics.add
			.group({
				classType: EnemyBase,
				runChildUpdate: true,
			})
			.create();

		this.physics.add.overlap(this.enemies, this.bullets, this.damageEnemy);
		this.physics.add.overlap(this.attackers, this.bullets, this.damageAttacker);

		this.socket.on('spawnScissor', (event) => {
			self.event = event.isPlayerA;
			self.spawnScissor(event);
		});

		this.input.keyboard.on('keydown', function (event) {
			if (self.time.now > self.attackerReleased + 2000) {
				if (event.key === '1') {
					self.socket.emit('spawnScissor', {
						isPlayerA: self.isPlayerA,
						path: 1,
					});
					self.attackerReleased = self.time.now;
				}
				if (event.key === '2') {
					self.socket.emit('spawnScissor', {
						isPlayerA: self.isPlayerA,
						path: 2,
					});
					self.attackerReleased = self.time.now;
				}
				if (event.key === '3') {
					self.socket.emit('spawnScissor', {
						isPlayerA: self.isPlayerA,
						path: 3,
					});
					self.attackerReleased = self.time.now;
				}
			}
		});

		this.input.on('pointerdown', function (event) {
			self.socket.emit('placeTurret', self.isPlayerA, event.x, event.y);
		});

		this.socket.on('placeTurret', function (isPlayerA, x, y) {
			self.turretPlacer = isPlayerA;
			self.placeTurret(isPlayerA, x, y);
		});
		this.input.dragDistanceThreshold = 16;

		this.input.on('dragstart', function (pointer, gameObject) {
			gameObject.setTint(0xff0000);
			self.children.bringToTop(gameObject);
		});

		this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
			gameObject.x = dragX;
			gameObject.y = dragY;
		});
		this.input.on('dragenter', function (pointer, gameObject, dropZone) {
			if (dropZone.name === 'path2') {
				for (const child of groupZone2.getChildren()) {
					child.fillAlpha = 1;
					child.setStrokeStyle(4, 0xefc53f);
				}
			}
			if (dropZone.name === 'path3') {
				for (const child of groupZone3.getChildren()) {
					child.fillAlpha = 1;
					child.setStrokeStyle(4, 0xefc53f);
				}
			} else {
				dropZone.fillAlpha = 1;
				dropZone.setStrokeStyle(4, 0xefc53f);
			}

			// graphics.lineStyle(2, 0x00ff00, 1);
			// graphics.strokeRect(
			// 	zone.x - zone.input.hitArea.width / 2,
			// 	zone.y,
			// 	zone.input.hitArea.width,
			// 	zone.input.hitArea.height
			// );

			gameObject.setTint(0x00ff00);
		});

		this.input.on('dragleave', function (pointer, gameObject, dropZone) {
			if (dropZone.name === 'path2') {
				for (const child of groupZone2.getChildren()) {
					child.fillAlpha = 0;
					child.strokeAlpha = 0;
				}
			}
			if (dropZone.name === 'path3') {
				for (const child of groupZone3.getChildren()) {
					child.fillAlpha = 0;
					child.strokeAlpha = 0;
				}
			} else {
				dropZone.fillAlpha = 0;
				dropZone.strokeAlpha = 0;
			}

			gameObject.setTint(0xff0000);
		});

		this.input.on('drop', function (pointer, gameObject, dropZone) {
			if (dropZone.name === 'path1') {
				dropZone.fillAlpha = 0;
				dropZone.strokeAlpha = 0;
				self.socket.emit('spawnScissor', {
					isPlayerA: self.isPlayerA,
					path: 1,
				});
			}
			if (dropZone.name === 'path2') {
				for (const child of groupZone2.getChildren()) {
					child.fillAlpha = 0;
					child.strokeAlpha = 0;
				}
				self.socket.emit('spawnScissor', {
					isPlayerA: self.isPlayerA,
					path: 2,
				});
			}
			if (dropZone.name === 'path3') {
				for (const child of groupZone3.getChildren()) {
					child.fillAlpha = 0;
					child.strokeAlpha = 0;
				}
				self.socket.emit('spawnScissor', {
					isPlayerA: self.isPlayerA,
					path: 3,
				});
			}

			self.attackerReleased = self.time.now;

			gameObject.clearTint();
		});
		this.input.on('dragend', function (pointer, gameObject, dropZone) {
			gameObject.x = gameObject.input.dragStartX;
			gameObject.y = gameObject.input.dragStartY;
		});

		//graphics.clear();
		// graphics.lineStyle(2, 0xffff00);
		// graphics.strokeRect(
		// 	zone.x - zone.input.hitArea.width / 2,
		// 	zone.y - zone.input.hitArea.height / 2,
		// 	zone.input.hitArea.width,
		// 	zone.input.hitArea.height
		// );
	}

	update(time, delta) {
		// console.log(this.input.mousePointer.x, this.input.mousePointer.y);
	}
}
