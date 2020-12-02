import io from "socket.io-client";
import Zone from "../helpers/zone.js";
import Enemy from "../helpers/enemy.js";
import Turret from "../helpers/turret.js";
import Bullet from "../helpers/bullet.js";
import EnemyBase from "../helpers/enemyBase.js";
export default class Game extends Phaser.Scene {
  constructor() {
    super({
      key: "Game",
    });
    //game properties
    this.isPlayerA = false;
    this.isPlayerB = false;
    this.myEnemies = [];
    this.enemyNumber = -1;
    this.ENEMY_SPEED = 1 / 10000;
    this.BULLET_DAMAGE = 20;
    this.path1;
    this.path2;
    this.path3;
    this.path4;
    this.enemies;
    this.turrets;
    this.bullets;
    this.enemyBase;
    this.score = 5;
    this.blueText;
    this.redText;
    this.resourcePoints = 12;
    this.resourceText;
    this.gameOver = false;
    this.map = [
      [-1, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1, -1],
      [-1, 0, 0, -1, -1, 0, -1, -1, -1, -1, -1, -1],
      [-1, 0, -1, 0, 0, 0, 0, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, 0, -1, 0, 0, 0, 0, -1, -1, -1, -1, -1],
      [-1, 0, 0, -1, -1, 0, -1, -1, -1, -1, -1, -1],
      [-1, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1, -1],
    ];
    this.map2 = [
      [-1, 0, 0, 0, 0, -1, -1, 0, 0, 0, 0, -1],
      [-1, 0, 0, -1, -1, 0, 0, -1, -1, 0, 0, -1],
      [-1, 0, -1, 0, 0, 0, 0, 0, 0, -1, 0, -1],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
      [-1, 0, -1, 0, 0, 0, 0, 0, 0, -1, 0, -1],
      [-1, 0, 0, -1, -1, 0, 0, -1, -1, 0, 0, -1],
      [-1, 0, 0, 0, 0, -1, -1, 0, 0, 0, 0, -1],
    ];
    this.spawnEnemy = this.spawnEnemy.bind(this);
    this.touchBase = this.touchBase.bind(this);
    this.choosePath = this.choosePath.bind(this);
    this.damageEnemy = this.damageEnemy.bind(this);
    this.placeTurret = this.placeTurret.bind(this);
    this.canPlaceTurret = this.canPlaceTurret.bind(this);
    this.addBullet = this.addBullet.bind(this);
    this.getEnemy = this.getEnemy.bind(this);
    this.decrementBlueScore = this.decrementBlueScore.bind(this);
    this.decrementRedScore = this.decrementRedScore.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
  }

  //Game methods
  //Enemy methods
  spawnEnemy() {
    var enemy = this.enemies.get();
    if (enemy) {
      enemy.setActive(true);
      enemy.setVisible(true);
      this.myEnemies.push(enemy);
    }
  }

  touchBase(enemyBase, enemy) {
    // enemy.setActive(false);
    // enemy.setVisible(false);
    enemy.destroy();
    // }
  }

  choosePath(enemy, path) {
    enemy.startOnPath(path);
  }

  damageEnemy(enemy, bullet) {
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

  //Turret methods
  placeTurret(pointer) {
    var i = Math.floor(pointer.y / 64);
    var j = Math.floor(pointer.x / 64);
    if (this.canPlaceTurret(i, j)) {
      if (this.resourcePoints) {
        var turret = this.turrets.get();
        this.resourcePoints -= 3;
        this.resourceText.setText("RESOURCE | " + this.resourcePoints);
        if (turret) {
          turret.setActive(true);
          turret.setVisible(true);
          turret.place(i, j);
        }
      }
    }
  }

  canPlaceTurret(i, j) {
    return this.map[i][j] === 0;
  }

  addBullet(x, y, angle) {
    var bullet = this.bullets.get();
    if (bullet) {
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

  //Score methods
  decrementBlueScore() {
    this.score -= 1;
    this.blueText.setText("P1 | " + this.score);
    if (this.score <= 0) {
      this.gameOver = true;
      this.blueText.setText("P1 | 0");
      return true;
    }
    return null;
  }

  decrementRedScore() {
    this.score -= 1;
    this.redText.setText("P2 | " + this.score);
    if (this.score <= 0) {
      this.gameOver = true;
      this.redText.setText("P2 | 0");
      this.scene.start("SceneTwo", {
        message: "Game Over, Player One wins!",
      });
      return true;
    }
    return null;
  }

  //grid methods
  drawGrid(graphics) {
    graphics.lineStyle(1, 0x0000ff, 0.8);
    for (var i = 1; i < 8; i++) {
      graphics.moveTo(80, i * 64);
      graphics.lineTo(720, i * 64);
    }
    for (var j = 0; j < 11; j++) {
      graphics.moveTo(80 + j * 64, 0);
      graphics.lineTo(80 + j * 64, 450);
    }
    graphics.strokePath();
  }

  preload() {
    // load the game assets –
    this.load.image("background", "src/assets/background.png");
    this.load.spritesheet("p1attackers", "src/assets/player1_attackers.png", {
      frameWidth: 70,
      frameHeight: 45,
    });
    this.load.spritesheet("p2attackers", "src/assets/player2_attackers.png", {
      frameWidth: 70,
      frameHeight: 45,
    });
    this.load.image("p2turret", "src/assets/player2_turret.png");
    this.load.image("bullet", "src/assets/bullet.png");
    this.load.image("scoreboard", "src/assets/scoreboard.png");
    this.load.image("blackboard", "src/assets/blackboard.png");
    this.load.spritesheet("p2base", "src/assets/player2_base2.png", {
      frameWidth: 70,
      frameHeight: 85,
    });
  }

  create() {
    this.add.image(400, 300, "background");
    this.add.image(85, 508, "scoreboard");
    this.add.image(400, 535, "blackboard");

    //sets the default to "you are not Player A"
    let self = this;

    // this.zone = new Zone(this);
    // this.dropZone = this.zone.renderZone();
    // this.outline = this.zone.renderOutline(this.dropZone);

    //connecting to our socket on the client-side
    this.socket = io("http://localhost:3000");

    this.socket.on("connect", function () {
      console.log("Connected!");
    });

    //If our client is the first to connect to the server, the server will emit
    //an event that tells the client that it will be Player A.  The client
    //socket receives that event and turns our "isPlayerA" boolean from
    //false to true.
    this.socket.on("isPlayerA", function () {
      self.isPlayerA = true;
      console.log("Welcome Player A!");
    });
    this.socket.on("isPlayerB", function () {
      if (!self.isPlayerA) {
        self.isPlayerB = true;
        console.log("Welcome Player B");
      }
    });

    // this graphics element is only for visualization,
    // its not related to our path
    var graphics = this.add.graphics();
    this.drawGrid(graphics);

    // the path for our enemies
    // parameters are the start x and y of our path
    this.path1 = this.add.path(125, 240);
    this.path1.lineTo(655, 240);

    this.path2 = this.add.path(125, 240);
    this.path2.lineTo(400, 48);
    this.path2.lineTo(655, 240);

    this.path3 = this.add.path(125, 240);
    this.path3.lineTo(400, 432);
    this.path3.lineTo(655, 240);

    graphics.lineStyle(3, 0xffffff, 1);

    // visualize the path
    this.path1.draw(graphics);
    this.path2.draw(graphics);
    this.path3.draw(graphics);

    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });
    this.nextEnemy = 0;

    this.turrets = this.physics.add.group({
      classType: Turret,
      runChildUpdate: true,
    });
    this.input.on("pointerdown", self.placeTurret);

    // this graphics element is only for visualization,
    // its not related to our path

    this.resourceText = self.add.text(
      300,
      520,
      `RESOURCE | ` + this.resourcePoints,
      {
        fontFamily: "Arial Black",
        fontStyle: "bold",
        fontSize: "24px",
        fill: "white",
      }
    );

    this.redText = self.add.text(50, 540, `P2 | ` + this.score, {
      fontFamily: "Arial Black",
      fontStyle: "bold",
      fontSize: "24px",
      fill: "white",
    });

    this.blueText = self.add.text(50, 505, `P1 | ` + this.score, {
      fontFamily: "Arial Black",
      fontStyle: "bold",
      fontSize: "24px",
      fill: "white",
    });

    this.bullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });

    this.enemyBase = this.physics.add
      .group({
        classType: EnemyBase,
        runChildUpdate: true,
      })
      .create();

    this.physics.add.overlap(this.enemies, this.bullets, this.damageEnemy);

    this.physics.add.collider(
      this.enemies,
      this.enemyBase,
      this.touchBase,
      this.decrementRedScore,
      self
    );
    //change origin of player B enemies
    //change color of player B enemies

    this.socket.on("spawnEnemy", (event) => {
      self.event = event;
      self.spawnEnemy(event);
    });

    this.input.keyboard.on("keydown-A", function (event) {
      // if (self.isPlayerA) {
      // 	self.socket.emit('spawnEnemy', { isPlayerA: true });
      // }
      // if (self.isPlayerB) {
      // 	self.socket.emit('spawnEnemy', { isPlayerB: true });
      // }
      self.socket.emit("spawnEnemy", self.isPlayerA);
    });

    this.socket.on("choosePath", function (event) {
      if (event.key === 1) {
        self.choosePath(self.myEnemies[self.enemyNumber], self.path1);
      }
      if (event.key === 2) {
        self.choosePath(self.myEnemies[self.enemyNumber], self.path2);
      }
      if (event.key === 3) {
        self.choosePath(self.myEnemies[self.enemyNumber], self.path3);
      }
    });

    this.input.keyboard.on("keydown-S", function (event) {
      self.socket.emit("choosePath", { key: 1 });
    });
    this.input.keyboard.on("keydown-D", function (event) {
      self.socket.emit("choosePath", { key: 2 });
    });
    this.input.keyboard.on("keydown-F", function (event) {
      self.socket.emit("choosePath", { key: 3 });
    });
  }

  update(time, delta) {}
}
