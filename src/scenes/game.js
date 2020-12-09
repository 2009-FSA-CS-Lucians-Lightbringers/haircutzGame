//figures out how turrets are spawned
//then link turret spawn to drag and drop
//add conditionals for turrets based on who player is
import io from "socket.io-client";
import Zone from "../helpers/zone.js";
import Enemy from "../helpers/enemy.js";
import Attacker from "../helpers/attacker.js";
import Turret from "../helpers/turret.js";
import Bullet from "../helpers/bullet.js";
// import HomeBase from "../helpers/homeBase.js";
// import EnemyBase from "../helpers/enemyBase.js";

export default class Game extends Phaser.Scene {
  constructor() {
    super({
      key: "game",
    });
    //game properties
    this.isPlayerA = false;
    this.isPlayerB = false;
    this.myEnemies = [];
    this.myAttackers = [];
    this.enemyNumber = -1;
    this.attackerNumber = -1;
    this.SCISSOR_SPEED = 1 / 10000;
    this.BULLET_DAMAGE = 20;
    this.gameTheme;
    this.scissor;
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
    this.path5;
    this.path6;
    this.cursorPath;
    this.cursor;
    this.graphics;
    this.enemies;
    this.attackers;
    this.turrets;
    this.bullets;
    this.enemyBase;
    this.homeBase;
    this.blueScore = 5;
    this.redScore = 5;
    this.blueText;
    this.redText;
    this.resourcePoints = 12;
    this.oppResourcePoints = 12;
    this.resourceText;
    this.oppResourceText;
    this.counter = 10;
    this.clock;
    this.clockSize = 40;
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
    // this.turretTimer = this.turretTimer.bind(this);
    this.addBullet = this.addBullet.bind(this);
    this.getEnemy = this.getEnemy.bind(this);
    this.getAttacker = this.getAttacker.bind(this);
    this.incrementBlueScore = this.incrementBlueScore.bind(this);
    this.incrementRedScore = this.incrementRedScore.bind(this);
    this.decrementBlueScore = this.decrementBlueScore.bind(this);
    this.decrementRedScore = this.decrementRedScore.bind(this);
    this.resourceTimer = this.resourceTimer.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
    // this.drawClock = this.drawClock.bind(this);
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

    if (this.isPlayerA) {
      if (event.path === 1) path = this.path1;
      if (event.path === 2) path = this.path2;
      if (event.path === 3) path = this.path3;

      if (event.isPlayerA === this.isPlayerA) {
        if (this.resourcePoints > 1) {
          var attacker = this.attackers.get();
          this.resourcePoints -= 2;
          this.resourceText.setText("USER RP | " + this.resourcePoints);
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
          this.oppResourceText.setText("ENEMY RP | " + this.oppResourcePoints);
          var enemy = this.enemies.get();
          if (enemy) {
            if (event.path === 1) path = this.path4;
            if (event.path === 2) path = this.path5;
            if (event.path === 3) path = this.path6;
            this.snips.play();
            enemy.setActive(true);
            enemy.setVisible(true);
            enemy.startOnPath(path);
            this.myEnemies.push(enemy);
          }
        }
      }
    } else {
      if (event.path === 1) path = this.path4;
      if (event.path === 2) path = this.path5;
      if (event.path === 3) path = this.path6;

      if (event.isPlayerA === this.isPlayerA) {
        if (this.resourcePoints > 1) {
          var attacker = this.attackers.get();
          this.resourcePoints -= 2;
          this.resourceText.setText("USER RP | " + this.resourcePoints);
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
          this.oppResourceText.setText("ENEMY RP | " + this.oppResourcePoints);
          var enemy = this.enemies.get();
          if (enemy) {
            if (event.path === 1) path = this.path1;
            if (event.path === 2) path = this.path2;
            if (event.path === 3) path = this.path3;
            enemy.setActive(true);
            enemy.setVisible(true);
            enemy.startOnPath(path);
            this.myEnemies.push(enemy);
          }
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
          this.resourceText.setText("USER RP | " + this.resourcePoints);
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
        this.oppResourceText.setText("ENEMY RP | " + this.oppResourcePoints);
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
  incrementBlueScore() {
    this.blueScore += 1;
    this.homeBase.setFrame(this.blueScore);
    this.blueText.setText("P1 | " + this.blueScore);
    if (this.blueScore >= 10) {
      this.snips.stop();
      this.gameTheme.stop();
      this.scene.switch("p1Wins");
    }
  }

  incrementRedScore() {
    this.redScore += 1;
    this.enemyBase.setFrame(this.redScore);
    this.redText.setText("P2 | " + this.redScore);
    if (this.redScore >= 10) {
      this.snips.stop();
      this.gameTheme.stop();
      this.scene.switch("p2Wins");
    }
  }

  decrementBlueScore() {
    this.snips.stop();
    this.ouch.play();
    this.blueScore -= 1;
    this.homeBase.setFrame(this.blueScore);
    this.blueText.setText("P1 | " + this.blueScore);
  }

  decrementRedScore() {
    this.snips.stop();
    this.ouch.play();
    this.redScore -= 1;
    this.enemyBase.setFrame(this.redScore);
    this.redText.setText("P2 | " + this.redScore);
  }

  resourceTimer() {
    this.counter--;
    this.clock.setText(` ${this.counter}`);
    if (this.counter <= 0) {
      this.resourcePoints += 3;
      this.oppResourcePoints += 3;
      this.resourceText.setText("USER RP | " + this.resourcePoints);
      this.oppResourceText.setText("ENEMY RP | " + this.oppResourcePoints);
      this.counter += 10;
      this.clock.setText(`${this.counter}`);
    }
  }

//   drawClock (x, y, timer){
//     //  Progress is between 0 and 1, where 0 = the hand pointing up and then rotating clockwise a full 360

//     //  The frame
//     var graphics = this.add.graphics();
//     graphics.lineStyle(6, 0xffffff, 1);
//     graphics.strokeCircle(x, y, this.clockSize);

//     var angle;
//     var dest;
//     var p1;
//     var p2;
//     var size;


//     if (timer > 0)
//     {
//         size = this.clockSize * 0.9;

//         angle = (21600 * timer/1000) - 90;
//         dest = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle), size);

//         graphics.lineStyle(2, 0xff0000, 1);

//         graphics.beginPath();

//         graphics.moveTo(x, y);

//         p1 = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle - 5), size * 0.7);

//         graphics.lineTo(p1.x, p1.y);
//         graphics.lineTo(dest.x, dest.y);

//         graphics.moveTo(x, y);

//         p2 = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle + 5), size * 0.7);

//         graphics.lineTo(p2.x, p2.y);
//         graphics.lineTo(dest.x, dest.y);

//         graphics.strokePath();
//         graphics.closePath();
//     }
// }



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


  preload() {
    // load the game assets –
    this.load.image("background", "/assets/background.png");
    this.load.spritesheet("p1attackers", "/assets/player1_attackers.png", {
      frameWidth: 68,
      frameHeight: 45,
    });
    this.load.spritesheet(
      "p1return",
      "/assets/player1_returning_attackers.png",
      {
        frameWidth: 68,
        frameHeight: 65,
      }
    );
    this.load.spritesheet("p2attackers", "/assets/player2_attackers.png", {
      frameWidth: 68,
      frameHeight: 45,
    });
    this.load.spritesheet(
      "p2return",
      "/assets/player2_returning_attackers.png",
      {
        frameWidth: 68,
        frameHeight: 65,
      }
    );
    this.load.image("p2turret", "/assets/player2_turret.png");
    this.load.image("p1turret", "/assets/player1_turret.png");
    this.load.image("bullet", "/assets/bullet.png");
    this.load.image("scoreboard", "/assets/scoreboard.png");
    this.load.image("blackboard", "/assets/blackboard.png");
    this.load.spritesheet("p1base", "/assets/base1_v2.png", {
      frameWidth: 75,
      frameHeight: 89,
    });

    this.load.spritesheet("p2base", "/assets/p2_base.png", {
      frameWidth: 75,
      frameHeight: 89,
    });

    this.load.image("logo", "/assets/logo_underline.png");
    this.load.image("play", "/assets/play.png");
    this.load.image("clock", "/assets/clock.png");
    this.load.audio("gameTheme", ["/assets/intro_theme.mp3"]);
    this.load.audio("snips", ["/assets/snips.mp3"]);
    this.load.audio("bulletSound", ["/assets/bullet_sound.mp3"]);
    this.load.audio("ouch", ["/assets/ouch.mp3"]);
    this.load.audio("woohoo", ["/assets/woohoo.mp3"]);
    this.load.audio("plop", ["/assets/plop.mp3"]);
  }

  create() {
    this.isPlayerA = this.game.isPlayerA;
    this.isPlayerB = this.game.isPlayerB;
    this.add.image(400, 300, "background");
    this.add.image(85, 508, "scoreboard")
    this.add.image(400, 535, "blackboard");
    this.add.image(700, 520, "clock");
    this.play = this.add.image(50, 50, "play");
    this.pause = this.add.image(105, 50, "pause");
    this.gameTheme = this.sound.add("gameTheme", { loop: true, volume: 0.5 });
    let self = this;

    if (this.isPlayerA) {
      self.scissor = self.add
        .sprite(314, 555, "p1attackers")
        .setInteractive()
        .setScale(0.75);
      self.turret = self.add
        .sprite(465, 550, "p1turret")
        .setInteractive()
        .setScale(0.55);
    } else {
      self.scissor = self.add
        .sprite(314, 555, "p2attackers")
        .setInteractive()
        .setScale(0.75);
      self.turret = self.add
        .sprite(465, 550, "p2turret")
        .setInteractive()
        .setScale(0.55);
    }
    this.input.setDraggable([this.scissor, this.turret]);
    this.scissor.name = "scissor";
    this.turret.name = "turret";

    this.anims.create({
      key: "blueWalk",
      frames: [
        { key: "p1attackers", frame: 1 },
        { key: "p1attackers", frame: 2 },
        { key: "p1attackers", frame: 3 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "reverseBlueWalk",
      frames: [
        { key: "p1return", frame: 1 },
        { key: "p1return", frame: 2 },
        { key: "p1return", frame: 3 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "redWalk",
      frames: [
        { key: "p2attackers", frame: 1 },
        { key: "p2attackers", frame: 2 },
        { key: "p2attackers", frame: 3 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "reverseRedWalk",
      frames: [
        { key: "p2return", frame: 1 },
        { key: "p2return", frame: 2 },
        { key: "p2return", frame: 3 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    this.enemyBase = this.add.image(715, 224, "p2base");
    this.homeBase = this.add.image(95, 224, "p1base");
    2;
    this.enemyBase.setFrame(5);
    this.homeBase.setFrame(5);

    //sounds
    this.gameTheme = this.sound.add("gameTheme", { loop: true });
    this.snips = this.sound.add("snips", { loop: true, delay: 0, rate: 4 });
    this.ouch = this.sound.add("ouch", { loop: false });
    this.woohoo = this.sound.add("woohoo", { loop: false });
    this.bulletSound = this.sound.add("bulletSound", { loop: false });
    this.plop = this.sound.add("plop", { loop: false });
    this.gameTheme.play();

    this.play.setInteractive({ useHandCursor: true });
    this.play.on("pointerdown", () => {
      self.game.sound.mute = false;
    });
    this.pause.setInteractive({ useHandCursor: true });
    this.pause.on("pointerdown", () => {
      self.game.sound.mute = true;
    });

    var redArc1 = this.add.arc(450, 280, 230, 263, 347, false, 0xf4cccc);
    redArc1.setStrokeStyle(3, 0xffffff);
    var redArc2 = this.add.arc(450, 200, 230, 13, 97, false, 0xf4cccc);
    redArc2.setStrokeStyle(3, 0xffffff);
    var blueArc1 = this.add.arc(350, 200, 230, 83, 167, false, 0x9fc5e8);
    blueArc1.setStrokeStyle(3, 0xffffff);
    var blueArc2 = this.add.arc(350, 280, 230, 193, 277, false, 0x9fc5e8);
    blueArc2.setStrokeStyle(3, 0xffffff);
    var RUTri = this.add
      .triangle(520, 260, 5, 50, 235, 50, 5, -110, 0xf4cccc)
      .setInteractive(
        new Phaser.Geom.Triangle(5, 50, 235, 50, 5, -110),
        Phaser.Geom.Triangle.Contains,
        true
      )
      .setStrokeStyle(4, 0xffffff);
    var RLTri = this.add
      .triangle(520, 280, 5, 50, 235, 50, 5, 210, 0xf4cccc)
      .setInteractive(
        new Phaser.Geom.Triangle(5, 50, 235, 50, 5, 210),
        Phaser.Geom.Triangle.Contains,
        true
      )
      .setStrokeStyle(4, 0xffffff);
    var LUTri = this.add
      .triangle(510, 260, -5, 50, -235, 50, -5, -110, 0x9fc5e8)
      .setInteractive(
        new Phaser.Geom.Triangle(-5, 50, -235, 50, -5, -110),
        Phaser.Geom.Triangle.Contains,
        true
      )
      .setStrokeStyle(4, 0xffffff);
    var LLTri = this.add
      .triangle(510, 280, -5, 50, -235, 50, -5, 210, 0x9fc5e8)
      .setInteractive(
        new Phaser.Geom.Triangle(-5, 50, -235, 50, -5, 210),
        Phaser.Geom.Triangle.Contains,
        true
      )
      .setStrokeStyle(4, 0xffffff);
    LUTri.name = "triangleA";
    LLTri.name = "triangleA";
    RUTri.name = "triangleB";
    RLTri.name = "triangleB";

    // this graphics element is only for visualization,
    // its not related to our path
    this.graphics = this.add.graphics();
    this.drawGrid(self.graphics);

    // the path for our enemies
    // parameters are the start x and y of our path
    this.path1 = this.add.path(125, 240);
    this.path1.lineTo(675, 240);
    this.path1.lineTo(125, 240);

    this.path2 = this.add.path(125, 240);
    this.path2.lineTo(400, 48);
    this.path2.lineTo(675, 240);
    this.path2.lineTo(400, 48);
    this.path2.lineTo(125, 240);

    this.path3 = this.add.path(125, 240);
    this.path3.lineTo(400, 432);
    this.path3.lineTo(675, 240);
    this.path3.lineTo(400, 432);
    this.path3.lineTo(125, 240);

    //Player B path
    this.path4 = this.add.path(675, 240);
    this.path4.lineTo(125, 240);
    this.path4.lineTo(675, 240);

    this.path5 = this.add.path(675, 240);
    this.path5.lineTo(400, 48);
    this.path5.lineTo(125, 240);
    this.path5.lineTo(400, 48);
    this.path5.lineTo(675, 240);

    this.path6 = this.add.path(675, 240);
    this.path6.lineTo(400, 432);
    this.path6.lineTo(125, 240);
    this.path6.lineTo(400, 432);
    this.path6.lineTo(675, 240);

    //  A drop zone
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
    this.path1Zone.name = "path1";
    this.path2ZoneL.name = "path2";
    this.path2ZoneR.name = "path2";
    this.path3ZoneL.name = "path3";
    this.path3ZoneR.name = "path3";

    var groupZone2 = this.add.group();
    var groupZone3 = this.add.group();
    groupZone2.add(this.path2ZoneL);
    groupZone2.add(this.path2ZoneR);
    groupZone3.add(this.path3ZoneL);
    groupZone3.add(this.path3ZoneR);

    //path for cusor
    this.cursor = { t: 0, vec: new Phaser.Math.Vector2() };

    //  The curves do not have to be joined
    var line1 = new Phaser.Curves.Line([50, 100, 50, 400]);

    this.cursorPath = this.add.path();

    // path = new Phaser.Curves.Path();

    this.cursorPath.add(line1);

    this.tweens.add({
      targets: this.cursor,
      t: 1,
      ease: "Linear",
      duration: 4000,
      yoyo: true,
      repeat: -1,
    });

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
      280,
      540,
      `USER RP | ` + this.resourcePoints,
      {
        fontFamily: "Arial Black",
        fontStyle: "bold",
        fontSize: "18px",
        fill: "white",
      }
    );

    this.oppResourceText = self.add.text(
      280,
      560,
      `ENEMY RP | ` + this.resourcePoints,
      {
        fontFamily: "Arial Black",
        fontStyle: "bold",
        fontSize: "18px",
        fill: "white",
      }
    );

    this.clock = self.add.text(678, 515, `${this.counter}`, {
      fontFamily: "Arial Black",
      fontStyle: "bold",
      fontSize: "35px",
      fill: "black",
    });

    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.resourceTimer,
      callbackScope: this,
      loop: true,
    });

    this.redText = self.add.text(50, 540, `P2 | ` + this.redScore, {
      fontFamily: "Arial Black",
      fontStyle: "bold",
      fontSize: "24px",
      fill: "white",
    });

    this.blueText = self.add.text(50, 505, `P1 | ` + this.blueScore, {
      fontFamily: "Arial Black",
      fontStyle: "bold",
      fontSize: "24px",
      fill: "white",
    });

    this.bullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });

    this.physics.add.overlap(this.enemies, this.bullets, this.damageEnemy);
    this.physics.add.overlap(this.attackers, this.bullets, this.damageAttacker);

    this.game.socket.on("spawnScissor", (event) => {
      self.event = event.isPlayerA;
      self.spawnScissor(event);
    });

    this.game.socket.emit("stopTheme");

    //     this.input.keyboard.on("keydown", function (event) {
    //       if (self.time.now > self.attackerReleased + 2000) {
    //         if (event.key === "1") {
    //           self.game.socket.emit("spawnScissor", {
    //             isPlayerA: self.isPlayerA,
    //             path: 1,
    //           });
    //           self.attackerReleased = self.time.now;
    //         }
    //         if (event.key === "2") {
    //           self.game.socket.emit("spawnScissor", {
    //             isPlayerA: self.isPlayerA,
    //             path: 2,
    //           });
    //           self.attackerReleased = self.time.now;
    //         }
    //         if (event.key === "3") {
    //           self.game.socket.emit("spawnScissor", {
    //             isPlayerA: self.isPlayerA,
    //             path: 3,
    //           });
    //           self.attackerReleased = self.time.now;
    //         }
    //       }
    //     });

    this.game.socket.on("placeTurret", function (isPlayerA, x, y) {
      self.turretPlacer = isPlayerA;
      self.placeTurret(isPlayerA, x, y);
    });

    this.input.dragDistanceThreshold = 16;

    this.input.on("dragstart", function (pointer, gameObject) {
      gameObject.setTint(0xff0000);
      self.children.bringToTop(gameObject);
    });

    this.input.on("drag", function (pointer, gameObject, dragX, dragY) {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
    this.input.on("dragenter", function (pointer, gameObject, dropZone) {
      if (gameObject.name === "scissor") {
        if (dropZone.name === "path1") {
          dropZone.fillAlpha = 1;
          dropZone.setStrokeStyle(4, 0xefc53f);
          gameObject.setTint(0x00ff00);
        }
        if (dropZone.name === "path2") {
          for (const child of groupZone2.getChildren()) {
            child.fillAlpha = 1;
            child.setStrokeStyle(4, 0xefc53f);
            gameObject.setTint(0x00ff00);
          }
        }
        if (dropZone.name === "path3") {
          for (const child of groupZone3.getChildren()) {
            child.fillAlpha = 1;
            child.setStrokeStyle(4, 0xefc53f);
            gameObject.setTint(0x00ff00);
          }
        }
      }

      if (gameObject.name === "turret") {
        if (dropZone.name === "triangleA" && self.isPlayerA) {
          dropZone.fillColor = 0x00ff00;
          dropZone.setStrokeStyle(4, 0xefc53f);
          gameObject.setTint(0x00ff00);
        }
        if (dropZone.name === "triangleB" && self.isPlayerB) {
          dropZone.fillColor = 0x00ff00;
          dropZone.setStrokeStyle(4, 0xefc53f);
          gameObject.setTint(0x00ff00);
        }
      }
    });

    this.input.on("dragleave", function (pointer, gameObject, dropZone) {
      if (gameObject.name === "scissor") {
        if (dropZone.name === "path1") {
          dropZone.fillAlpha = 0;
          dropZone.strokeAlpha = 0;
          gameObject.setTint(0xff0000);
        }
        if (dropZone.name === "path2") {
          for (const child of groupZone2.getChildren()) {
            child.fillAlpha = 0;
            child.strokeAlpha = 0;
            gameObject.setTint(0xff0000);
          }
        }
        if (dropZone.name === "path3") {
          for (const child of groupZone3.getChildren()) {
            child.fillAlpha = 0;
            child.strokeAlpha = 0;
            gameObject.setTint(0xff0000);
          }
        }
      }

      if (gameObject.name === "turret") {
        if (dropZone.name === "triangleA" && self.isPlayerA) {
          dropZone.fillColor = 0x9fc5e8;
          dropZone.setStrokeStyle(4, 0xffffff);
          gameObject.setTint(0xff0000);
        }
        if (dropZone.name === "triangleB" && self.isPlayerB) {
          dropZone.fillColor = 0xf4cccc;
          dropZone.setStrokeStyle(4, 0xffffff);
          gameObject.setTint(0xff0000);
        }
      }
    });

    this.input.on("drop", function (pointer, gameObject, dropZone) {
      if (gameObject.name === "scissor") {
        if (dropZone.name === "path1") {
          dropZone.fillAlpha = 0;
          dropZone.strokeAlpha = 0;
          self.game.socket.emit("spawnScissor", {
            isPlayerA: self.isPlayerA,
            path: 1,
          });
          gameObject.clearTint();
          self.attackerReleased = self.time.now;
        }
        if (dropZone.name === "path2") {
          for (const child of groupZone2.getChildren()) {
            child.fillAlpha = 0;
            child.strokeAlpha = 0;
          }
          self.game.socket.emit("spawnScissor", {
            isPlayerA: self.isPlayerA,
            path: 2,
          });
          gameObject.clearTint();
          self.attackerReleased = self.time.now;
        }
        if (dropZone.name === "path3") {
          for (const child of groupZone3.getChildren()) {
            child.fillAlpha = 0;
            child.strokeAlpha = 0;
          }
          self.game.socket.emit("spawnScissor", {
            isPlayerA: self.isPlayerA,
            path: 3,
          });
          gameObject.clearTint();
          self.attackerReleased = self.time.now;
        }
      }
      if (gameObject.name === "turret") {
        if (dropZone.name === "triangleA" && self.isPlayerA) {
          dropZone.fillColor = 0x9fc5e8;
          dropZone.setStrokeStyle(4, 0xffffff);
          gameObject.setTint(0xff0000);
        }
        if (dropZone.name === "triangleB" && self.isPlayerB) {
          dropZone.fillColor = 0xf4cccc;
          dropZone.setStrokeStyle(4, 0xffffff);
          gameObject.setTint(0xff0000);
        }
        if (dropZone.name === "triangleA" || dropZone.name === "triangleB") {
          self.game.socket.emit(
            "placeTurret",
            self.isPlayerA,
            pointer.upX,
            pointer.upY
          );
        }
      }
    });
    this.input.on("dragend", function (pointer, gameObject, dropZone) {
      gameObject.x = gameObject.input.dragStartX;
      gameObject.y = gameObject.input.dragStartY;
      gameObject.clearTint();
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
    var self = this;
    this.graphics.clear();
    this.graphics.lineStyle(4, 0x0000ff, 1);

    this.cursorPath.draw(self.graphics);

    this.cursorPath.getPoint(self.cursor.t, self.cursor.vec);

    this.graphics.fillStyle(0xff0000, 1);
    this.graphics.fillRect(
      self.cursor.vec.x - 8,
      self.cursor.vec.y - 8,
      16,
      16
    );
    // console.log(this.input.mousePointer.x, this.input.mousePointer.y);
  }
}
