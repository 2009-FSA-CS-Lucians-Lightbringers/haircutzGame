//changed
//enemyNumber => attackerNumber
//ENEMY_SPEED => SCISSOR_SPEED
export default new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,
  initialize: function Attacker(scene) {
    this.createdByPlayerA = scene.event;
    if (this.createdByPlayerA) {
      //if playerA hit the keyboard - create a p1 attacker

      Phaser.GameObjects.Sprite.call(this, scene, 85, 224, "p1attackers");
      this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
      this.anims.play("blueWalk");
      scene.attackerNumber++;
      this.number = scene.attackerNumber;
      this.hasSwitched = false;
      this.healthBar;
    } else {
      Phaser.GameObjects.Sprite.call(this, scene, 675, 224, "p2attackers");
      this.follower = { t: 1, vec: new Phaser.Math.Vector2() };
      this.anims.play("redWalk");

      scene.attackerNumber++;
      this.number = scene.attackerNumber;
      this.hasSwitched = false;
      this.healthBar;
    }
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
      // console.log(this.path.getPoint(this.follower.t, this.follower.vec));
      this.path.getPoint(this.follower.t, this.follower.vec);
      // set the x and y of our enemy to the received from the previous step
      this.setPosition(this.follower.vec.x, this.follower.vec.y);
      this.healthBar = this.scene.makeBar(this.follower.vec.x-20,this.follower.vec.y-20, 0x2ecc71);
      this.hp = 100;
      this.scene.setValue(this.healthBar,this.hp)
    } else {
      this.follower.t = 1;

      this.path.getPoint(this.follower.t, this.follower.vec);
      // set the x and y of our enemy to the received from the previous step
      this.setPosition(this.follower.vec.x, this.follower.vec.y);
      this.healthBar = this.scene.makeBar(this.follower.vec.x-20,this.follower.vec.y-20, 0x2ecc71);
      this.hp = 100;
      this.scene.setValue(this.healthBar,this.hp)
    }
  },

  receiveDamage: function (damage) {
    this.hp -= damage;
    console.log(`attacker ${this.number} took damage`, this.hp);
    this.scene.setValue(this.healthBar, this.hp);
    // if hp drops below 0 we deactivate this enemy
    if (this.hp <= 0) {
      if(this.scene.isPlayerA && this.hasSwitched){
        this.scene.incrementRedScore();
      }
      if(!this.scene.isPlayerA && this.hasSwitched){
        this.scene.incrementBlueScore();
      }
      this.scene.snips.stop();
      this.scene.oppResourcePoints += 1;
      this.scene.oppResourceText.setText("ENEMY RP | " + this.scene.oppResourcePoints);
      this.healthBar.destroy();
      this.destroy();
    }
  },

  update: function (time, delta) {
    if (this.path) {
      this.path.getPoint(this.follower.t, this.follower.vec);
      this.setPosition(this.follower.vec.x, this.follower.vec.y);
      this.healthBar.setPosition(this.follower.vec.x-20, this.follower.vec.y+20)
      if (this.createdByPlayerA) {
        this.follower.t += this.scene.SCISSOR_SPEED * delta;
        if(this.follower.t >= .5 && !this.hasSwitched){
          this.anims.play("reverseBlueWalk")
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

        if(this.follower.t <= .5 && !this.hasSwitched){
          this.anims.play("reverseRedWalk");
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
