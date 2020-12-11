//changed
//enemyNumber => attackerNumber
//ENEMY_SPEED => SCISSOR_SPEED
export default new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,
  initialize: function Attacker(scene) {
    this.createdByPlayerA = scene.event;
    if (this.createdByPlayerA) {
      Phaser.GameObjects.Sprite.call(this, scene, 85, 224, "p1attackers");
      this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
      scene.attackerNumber++;
      this.number = scene.attackerNumber;
      this.hasSwitched = false;
      this.healthBar;
      this.level1 = false;
      this.level2 = false;
      this.level3 = false;
    } else {
      Phaser.GameObjects.Sprite.call(this, scene, 675, 224, "p2attackers");
      this.follower = { t: 1, vec: new Phaser.Math.Vector2() };

      scene.attackerNumber++;
      this.number = scene.attackerNumber;
      this.hasSwitched = false;
      this.healthBar;
      this.level1 = false;
      this.level2 = false;
      this.level3 = false;
    }
    this.removeAttacker = function () {
      if (scene.isPlayerA && this.hasSwitched) {
        scene.incrementRedScore();
      }
      if (!scene.isPlayerA && this.hasSwitched) {
        scene.incrementBlueScore();
      }
      console.log("Removing Attacker...");
      scene.snips.stop();
      scene.oppResourcePoints += 1;
      scene.oppResourceText.setText("ENEMY | " + scene.oppResourcePoints);
      this.healthBar.destroy();
      this.destroy();
    };
  },
  //differentiate player attacks based on class
  //if playerA then create a playera attacker else create a playerb attacker
  //
  startOnPath: function (path) {
    this.path = path;
    if (this.createdByPlayerA) {
      // set the t parameter at the start of the path
      this.follower.t = 0;
      // get x and y of the given t point
      this.path.getPoint(this.follower.t, this.follower.vec);
      // set the x and y of our enemy to the received from the previous step
      this.setPosition(this.follower.vec.x, this.follower.vec.y);
      if (this.attribute === 1) {
        this.level1 = true;
        this.anims.play("blueWalk");
        this.healthBar = this.scene.makeBar(
          this.follower.vec.x - 10,
          this.follower.vec.y - 20,
          0x008ee2
        );
        this.hp = 80;
      }
      if (this.attribute === 2) {
        this.level2 = true;
        this.anims.play("blue2Walk");
        this.healthBar = this.scene.makeBar(
          this.follower.vec.x - 20,
          this.follower.vec.y - 20,
          0x008ee2
        );
        this.hp = 100;
      }
      if (this.attribute === 3) {
        this.level3 = true;
        this.anims.play("blue3Walk");
        this.healthBar = this.scene.makeBar(
          this.follower.vec.x - 30,
          this.follower.vec.y - 20,
          0x008ee2
        );
        this.hp = 120;
      }
      this.scene.setValue(this.healthBar, this.hp);
    } else {
      this.follower.t = 1;

      this.path.getPoint(this.follower.t, this.follower.vec);
      // set the x and y of our enemy to the received from the previous step
      this.setPosition(this.follower.vec.x, this.follower.vec.y);
      if (this.attribute === 1) {
        this.level1 = true;
        this.anims.play("redWalk");
        this.healthBar = this.scene.makeBar(
          this.follower.vec.x - 10,
          this.follower.vec.y - 20,
          0x2ecc71
        );
        this.hp = 80;
      }
      if (this.attribute === 2) {
        this.level2 = true;
        this.anims.play("red2Walk");
        this.healthBar = this.scene.makeBar(
          this.follower.vec.x - 20,
          this.follower.vec.y - 20,
          0x2ecc71
        );
        this.hp = 100;
      }
      if (this.attribute === 3) {
        this.level3 = true;
        this.anims.play("red3Walk");
        this.healthBar = this.scene.makeBar(
          this.follower.vec.x - 30,
          this.follower.vec.y - 20,
          0x2ecc71
        );
        this.hp = 120;
      }
      this.scene.setValue(this.healthBar, this.hp);
    }
  },

  receiveDamage: function (damage) {
    this.hp -= damage;
    console.log(`attacker ${this.number} took damage`, this.hp);
    this.scene.setValue(this.healthBar, this.hp);
    // if hp drops below 0 we deactivate this enemy
    if (this.hp <= 0) {
      this.scene.game.socket.emit(
        "removeAttacker",
        this.number,
        this.createdByPlayerA
      );
    }
  },

  update: function (time, delta) {
    if (this.path) {
      this.path.getPoint(this.follower.t, this.follower.vec);
      this.setPosition(this.follower.vec.x, this.follower.vec.y);
      if (this.level1) {
        this.healthBar.setPosition(
          this.follower.vec.x - 10,
          this.follower.vec.y + 20
        );
      }
      if (this.level2) {
        this.healthBar.setPosition(
          this.follower.vec.x - 20,
          this.follower.vec.y + 20
        );
      }
      if (this.level3) {
        this.healthBar.setPosition(
          this.follower.vec.x - 30,
          this.follower.vec.y + 20
        );
      }
      if (this.createdByPlayerA) {
        this.follower.t += this.scene.SCISSOR_SPEED * delta;
        if (this.follower.t >= 0.5 && !this.hasSwitched) {
          if (this.level1) {
            this.anims.play("reverseBlueWalk");
          }
          if (this.level2) {
            this.anims.play("reverseBlue2Walk");
          }
          if (this.level3) {
            this.anims.play("reverseBlue3Walk");
          }
          this.scene.decrementRedScore();
          this.hasSwitched = true;
        }
        if (this.follower.t >= 1) {
          this.scene.incrementBlueScore();
          this.healthBar.destroy();
          this.destroy();
        }
      } else {
        this.follower.t -= this.scene.SCISSOR_SPEED * delta;
        if (this.follower.t <= 0.5 && !this.hasSwitched) {
          if (this.level1) {
            this.anims.play("reverseRedWalk");
          }
          if (this.level2) {
            this.anims.play("reverseRed2Walk");
          }
          if (this.level3) {
            this.anims.play("reverseRed3Walk");
          }
          this.scene.decrementBlueScore();
          this.hasSwitched = true;
        }

        if (this.follower.t <= 0) {
          this.healthBar.destroy();
          this.scene.incrementRedScore();
          this.destroy();
        }
      }
    }
  },
});

//player A hits a key
//client sends info to server saying created by A
//server sends info to both client instances saying created by A
//each client has the same info except one of them is not player A
//if the person who is not player A receives player A true, create an enemy
//if the person who is player A receives player A true, create an attacker

//Creating a new Phaser Class
//export default class
//import class
//initialize this.blank in constructor
//connect this.blank with class
//create spawn class function
//spawn class function should get an instance from this.blank (class)
//if instance exists, make instance active and visible
//push instance into array of my instances
