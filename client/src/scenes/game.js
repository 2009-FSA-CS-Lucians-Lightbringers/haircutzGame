import io from "socket.io-client";

var map = [
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
var enemies;
var turrets;
var bullets;
var BULLET_DAMAGE = 20;
var myEnemies = [];
var enemyNumber = -1;

var ENEMY_SPEED = 1 / 10000;

var Enemy = new Phaser.Class({
  Extends: Phaser.GameObjects.Image,

  initialize: function Enemy(scene) {
    Phaser.GameObjects.Image.call(this, scene, 85, 224, "sprites", "enemy");
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    enemyNumber++;
    this.number = enemyNumber;
  },

  startOnPath: function (path) {
    this.path = path;
    // set the t parameter at the start of the path
    this.follower.t = 0;
    // get x and y of the given t point
    this.path.getPoint(this.follower.t, this.follower.vec);
    // set the x and y of our enemy to the received from the previous step
    this.setPosition(this.follower.vec.x, this.follower.vec.y);
    this.hp = 100;
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
      // move the t point along the path, 0 is the start and 0 is the end
      this.follower.t += ENEMY_SPEED * delta;

      //get x and y of the given t point
      this.path.getPoint(this.follower.t, this.follower.vec);

      // update enemy x and y to the newly obtained x and y
      this.setPosition(this.follower.vec.x, this.follower.vec.y);

      // if we have reached the end of the path, remove the enemy
      if (this.follower.t >= 1) {
        this.setActive(false);
        this.setVisible(false);
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
    Phaser.GameObjects.Image.call(this, scene, 0, 0, "sprites", "turret");
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
    var turret = turrets.get();
    if (turret) {
      turret.setActive(true);
      turret.setVisible(true);
      turret.place(i, j);
    }
  }
}

//this should happen if we get event from server
function spawnEnemy() {
  var enemy = enemies.get();
  if (enemy) {
    enemy.setActive(true);
    enemy.setVisible(true);
    myEnemies.push(enemy);
  }
}

function choosePath(enemy, path) {
  console.log("CHOOSING PATH");
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

export default class Game extends Phaser.Scene {
  constructor() {
    super({
      key: "Game",
    });
  }

  preload() {
    // load the game assets – enemy and turret atlas
    this.load.atlas(
      "sprites",
      "src/assets/spritesheet.png",
      "src/assets/spritesheet.json"
    );
    this.load.image("bullet", "src/assets/bullet.png");
  }

  create() {
    //sets the default to "you are not Player A"
    this.isPlayerA = false;

    //saving our game instance as "self"
    let self = this;

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
    });

    // this graphics element is only for visualization,
    // its not related to our path
    var graphics = self.add.graphics();
    drawGrid(graphics);

    // the path for our enemies
    // parameters are the start x and y of our path
    path1 = self.add.path(85, 224);
    path1.lineTo(715, 224);

    path2 = self.add.path(85, 224);
    path2.lineTo(240, 96);
    path2.lineTo(400, 32);
    path2.lineTo(560, 96);
    path2.lineTo(715, 224);

    path3 = self.add.path(85, 224);
    path3.lineTo(240, 352);
    path3.lineTo(400, 416);
    path3.lineTo(560, 352);
    path3.lineTo(715, 224);

    graphics.lineStyle(3, 0xffffff, 1);
    // visualize the path
    path1.draw(graphics);
    path2.draw(graphics);
    path3.draw(graphics);

    enemies = self.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });
    self.nextEnemy = 0;

    turrets = self.physics.add.group({
      classType: Turret,
      runChildUpdate: true,
    });
    self.input.on("pointerdown", placeTurret);

    self.socket.on("spawnEnemy", spawnEnemy);

    self.input.keyboard.on("keydown-A", function () {
      self.socket.emit("spawnEnemy");
    });

    self.socket.on("choosePath", function () {
      choosePath(myEnemies[enemyNumber], path1);
    });

    self.input.keyboard.on("keydown-S", function () {
      console.log("S has been pressed");
      self.socket.emit("choosePath");
    });

    bullets = self.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });

    self.physics.add.overlap(enemies, bullets, damageEnemy);
  }

  update(time, delta) {
    //emit a socket event to the server that tells it
    //that an enemy has been deployed
    // if its time for the next enemy
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
