import io from "socket.io-client";
import Zone from "../helpers/zone.js";

var map = [
  [-1, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1, -1],
  [-1, 0, 0, -1, -1, 0, -1, -1, -1, -1, -1, -1],
  [-1, 0, -1, 0, 0, 0, 0, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, 0, -1, 0, 0, 0, 0, -1, -1, -1, -1, -1],
  [-1, 0, 0, -1, -1, 0, -1, -1, -1, -1, -1, -1],
  [-1, 0, 0, 0, 0, -1, -1, -1, -1, -1, -1, -1],
];

var map2 = [
  [-1, 0, 0, 0, 0, -1, -1, 0, 0, 0, 0, -1],
  [-1, 0, 0, -1, -1, 0, 0, -1, -1, 0, 0, -1],
  [-1, 0, -1, 0, 0, 0, 0, 0, 0, -1, 0, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, 0, -1, 0, 0, 0, 0, 0, 0, -1, 0, -1],
  [-1, 0, 0, -1, -1, 0, 0, -1, -1, 0, 0, -1],
  [-1, 0, 0, 0, 0, -1, -1, 0, 0, 0, 0, -1],
];

//var graphics;
var path1;
var path2;
var path3;
var path4;

// Sprites
var enemies;
var turrets;
var bullets;
var enemyBase;

// Scoreboard
var score = 5;
var blueText;
var redText;
var resourcePoints = 12;
var resourceText;
var gameOver = false;

var BULLET_DAMAGE = 20;
var myEnemies = [];

var enemyNumber = -1;
var enemyNumber = -1;

var ENEMY_SPEED = 1 / 10000;

var Enemy = new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize: function Enemy(scene) {
    this.createdByPlayerA = scene.event;
    if (scene.event) {
      //if playerA hit the keyboard - create a p1 attacker

      Phaser.GameObjects.Sprite.call(this, scene, 85, 224, "p1attackers");
      this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
      enemyNumber++;
      this.number = enemyNumber;
    } else {
      Phaser.GameObjects.Sprite.call(this, scene, 650, 224, "p2attackers");
      this.follower = { t: 0.8, vec: new Phaser.Math.Vector2() };
      enemyNumber++;
      this.number = enemyNumber;
    }
  },
  //differentiate player attacks based on class
  //if playerA then create a playera attacker else create a playerb attacker
  //
  startOnPath: function (path) {
    if (this.createdByPlayerA) {
      this.path = path;
      // set the t parameter at the start of the path
      this.follower.t = 0;
      // get x and y of the given t point
      // console.log(this.path.getPoint(this.follower.t, this.follower.vec));

      this.path.getPoint(this.follower.t, this.follower.vec);
      // set the x and y of our enemy to the received from the previous step
      this.setPosition(this.follower.vec.x, this.follower.vec.y);
      this.hp = 100;
    } else {
      this.path = path;
      this.follower.t = 0.8;

      this.path.getPoint(this.follower.t, this.follower.vec);
      // set the x and y of our enemy to the received from the previous step
      this.setPosition(this.follower.vec.x, this.follower.vec.y);
      this.hp = 100;
    }
  },

  receiveDamage: function (damage) {
    this.hp -= damage;

    // if hp drops below 0 we deactivate this enemy
    if (this.hp <= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  },

  update: function (time, delta) {
    if (this.path) {
      this.path.getPoint(this.follower.t, this.follower.vec);

      this.setPosition(this.follower.vec.x, this.follower.vec.y);

      if (this.createdByPlayerA) {
        this.follower.t += ENEMY_SPEED * delta;

        if (this.follower.t >= 1) {
          this.setActive(false);
          this.setVisible(false);
        }
      } else {
        this.follower.t -= ENEMY_SPEED * delta;

        if (this.follower.t <= 0) {
          this.setActive(false);
          this.setVisible(false);
        }
      }
    }
  },
});

function addBullet(x, y, angle) {
  var bullet = bullets.get();
  if (bullet) {
    bullet.fire(x, y, angle);
  }
}

function getEnemy(x, y, distance) {
  var enemyUnits = enemies.getChildren();
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

var Turret = new Phaser.Class({
  Extends: Phaser.GameObjects.Image,

  initialize: function Turret(scene) {
    Phaser.GameObjects.Image.call(this, scene, 0, 0, "p2turret");
    this.nextTic = 0;
  },
  // we will place the turret according to the grid
  place: function (i, j) {
    this.y = i * 64 + 64 / 2;
    this.x = j * 64 + 64 / 2 + 14;
    map[i][j] = 1;
  },
  update: function (time, delta) {
    // time to shoot
    if (time > this.nextTic) {
      this.fire();
      this.nextTic = time + 1000;
    }
  },
  fire: function () {
    var enemy = getEnemy(this.x, this.y, 100);
    if (enemy) {
      var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
      addBullet(this.x, this.y, angle);
      this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
    }
  },
});

var Bullet = new Phaser.Class({
  Extends: Phaser.GameObjects.Image,

  initialize: function Bullet(scene) {
    Phaser.GameObjects.Image.call(this, scene, 0, 0, "bullet");

    this.dx = 0;
    this.dy = 0;
    this.lifespan = 0;

    this.speed = Phaser.Math.GetSpeed(600, 1);
  },

  fire: function (x, y, angle) {
    this.setActive(true);
    this.setVisible(true);

    //  Bullets fire from the middle of the screen to the given x/y
    this.setPosition(x, y);

    //  we don't need to rotate the bullets as they are round
    //  this.setRotation(angle);

    this.dx = Math.cos(angle);
    this.dy = Math.sin(angle);

    this.lifespan = 300;
  },

  update: function (time, delta) {
    this.lifespan -= delta;

    this.x += this.dx * (this.speed * delta);
    this.y += this.dy * (this.speed * delta);

    if (this.lifespan <= 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  },
});

var EnemyBase = new Phaser.Class({
  Extends: Phaser.GameObjects.Image,

  initialize: function EnemyBase(scene) {
    Phaser.GameObjects.Image.call(this, scene, 715, 224, "p2base");
  },
});

function touchBase(enemy, enemyBase) {
  // enemy.setActive(false);
  // enemy.setVisible(false);
  enemyBase.destroy();
  // }
}

function decrementBlueScore() {
  score -= 1;
  blueText.setText("P1 | " + score);
  if (score <= 0) {
    gameOver = true;
    blueText.setText("P1 | 0");
    return true;
  }
  return null;
}

function decrementRedScore() {
  score -= 1;
  redText.setText("P2 | " + score);
  if (score <= 0) {
    gameOver = true;
    redText.setText("P2 | 0");
    this.scene.start("SceneTwo", {
      message: "Game Over, Player One wins!",
    });
    return true;
  }
  return null;
}

function drawGrid(graphics) {
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

function canPlaceTurret(i, j) {
  return map[i][j] === 0;
}

function placeTurret(pointer) {
  var i = Math.floor(pointer.y / 64);
  var j = Math.floor(pointer.x / 64);
  if (canPlaceTurret(i, j)) {
    if (resourcePoints) {
      var turret = turrets.get();
      resourcePoints -= 3;
      resourceText.setText("RESOURCE | " + resourcePoints);
      if (turret) {
        turret.setActive(true);
        turret.setVisible(true);
        turret.place(i, j);
      }
    }
  }
}

//this should happen if we get event from server

function choosePath(enemy, path) {
  enemy.startOnPath(path);
}

function damageEnemy(enemy, bullet) {
  // only if both enemy and bullet are alive
  if (enemy.active === true && bullet.active === true) {
    // we remove the bullet right away
    bullet.setActive(false);
    bullet.setVisible(false);

    // decrease the enemy hp with BULLET_DAMAGE
    enemy.receiveDamage(BULLET_DAMAGE);
  }
}

// function selectPath() {
//   var randomPath = Math.floor(Math.random() * 3) + 1;
//   if (randomPath === 1) return path1;
//   if (randomPath === 2) return path2;
//   if (randomPath === 3) return path3;
// }
function spawnEnemy() {
  var enemy = enemies.get();
  if (enemy) {
    enemy.setActive(true);
    enemy.setVisible(true);
    myEnemies.push(enemy);
  }
}

export default class Game extends Phaser.Scene {
  constructor() {
    super({
      key: "Game",
    });
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
    this.isPlayerA = false;
    this.isPlayerB = false;

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
    drawGrid(graphics);

    // the path for our enemies
    // parameters are the start x and y of our path
    path1 = this.add.path(125, 240);
    path1.lineTo(655, 240);

    path2 = this.add.path(125, 240);
    // path2.lineTo(315, 112);
    path2.lineTo(400, 48);
    // path2.lineTo(495, 112);
    path2.lineTo(655, 240);

    path3 = this.add.path(125, 240);
    // path3.lineTo(315, 368);
    path3.lineTo(400, 432);
    // path3.lineTo(495, 368);
    path3.lineTo(655, 240);

    graphics.lineStyle(3, 0xffffff, 1);
    // visualize the path
    path1.draw(graphics);
    path2.draw(graphics);
    path3.draw(graphics);

    enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });
    this.nextEnemy = 0;

    turrets = this.physics.add.group({
      classType: Turret,
      runChildUpdate: true,
    });
    this.input.on("pointerdown", placeTurret);

    // this graphics element is only for visualization,
    // its not related to our path

    resourceText = self.add.text(300, 520, `RESOURCE | ` + resourcePoints, {
      fontFamily: "Arial Black",
      fontStyle: "bold",
      fontSize: "24px",
      fill: "white",
    });

    redText = self.add.text(50, 540, `P2 | ` + score, {
      fontFamily: "Arial Black",
      fontStyle: "bold",
      fontSize: "24px",
      fill: "white",
    });

    blueText = self.add.text(50, 505, `P1 | ` + score, {
      fontFamily: "Arial Black",
      fontStyle: "bold",
      fontSize: "24px",
      fill: "white",
    });

    bullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });

    enemyBase = this.physics.add
      .group({
        classType: EnemyBase,
        runChildUpdate: true,
      })
      .create();

    this.physics.add.overlap(enemies, bullets, damageEnemy);

    this.physics.add.collider(
      enemies,
      enemyBase,
      touchBase,
      decrementRedScore,
      self
    );
    //change origin of player B enemies
    //change color of player B enemies

    this.socket.on("spawnEnemy", (event) => {
      self.event = event;
      spawnEnemy(event);
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
        choosePath(myEnemies[enemyNumber], path1);
      }
      if (event.key === 2) {
        choosePath(myEnemies[enemyNumber], path2);
      }
      if (event.key === 3) {
        choosePath(myEnemies[enemyNumber], path3);
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

  update(time, delta) {
    //emit a socket event to the server that tells it
    //that an enemy has been deployed
    // if its time for the next enemy
    //     if(gameOver){
    //       return;
    //     }
    //     else{
    //     if (time > this.nextEnemy) {
    //       var enemy = enemies.get();
    //       if (enemy) {
    //         enemy.setActive(true);
    //         enemy.setVisible(true);
    //         // place the enemy at the start of the path
    //         enemy.startOnPath();
    //         this.nextEnemy = time + 2000;
    //       }
    //     }}
    // if (time > this.nextEnemy) {
    //   var enemy = enemies.get();
    //   if (enemy) {
    //     enemy.setActive(true);
    //     enemy.setVisible(true);
    //     // place the enemy at the start of the path
    //     enemy.startOnPath();
    //     this.nextEnemy = time + 2000;
    //   }
    // }
  }
}

// cardPlayed Functionality

// The code block first compares the isPlayerA boolean it receives from the
// server against the client's own isPlayerA, which is a check to determine
// whether the client that is receiving the event is the same one that generated
// it.

// Let's think that through a bit further, as it exposes a key component to how
// our client - server relationship works, using Socket.IO as the connector.
// Suppose that Client A connects to the server first, and is told through the
// "isPlayerA" event that it should change its isPlayerA boolean to true.
// That's going to determine what kind of cards it generates when a user clicks
// "DEAL CARDS" through that client.

// If Client B connects to the server second, it's never told to alter its
// isPlayerA boolean, which stays false.  That will also determine what kind of
// cards it generates.

// When Client A drops a card, it emits a "cardPlayed" event to the server,
// passing information about the card that was dropped, and its isPlayerA
// boolean, which is true.  The server then relays all that information back
// up to all clients with its own "cardPlayed" event.

// Client A receives that event from the server, and notes that the isPlayerA
// boolean from the server is true, which means that the event was generated
// by Client A itself. Nothing special happens.

// Client B receives the same event from the server, and notes that the
// isPlayerA boolean from the server is true, although Client B's own isPlayerA
// is false.  Because of this difference, it executes the rest of the code block.

// The ensuing code stores the "texturekey" - basically, the image - of the game
// object that it receives from the server into a variable called "sprite".
// It destroys one of the opponent card backs that are rendered at the top of
// the screen, and increments the "cards" data value in the dropzone so that we
// can keep placing cards from left to right.

// The code then generates a new card in the dropzone that uses the sprite
// variable to create the same card that was dropped in the other client
// (if you had data attached to that game object, you could use a similar
// approach to attach it here as well).

//for more: https://www.freecodecamp.org/news/how-to-build-a-multiplayer-card-game-with-phaser-3-express-and-socket-io/
