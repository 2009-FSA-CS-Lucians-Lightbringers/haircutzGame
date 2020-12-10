export default new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,
  initialize: function Enemy(scene) {
    this.createdByPlayerA = scene.event;
    if (this.createdByPlayerA) {
      //if playerA hit the keyboard - create a p1 attacker
      Phaser.GameObjects.Sprite.call(this, scene, 85, 224, "p1attackers");
      this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
      scene.enemyNumber++;
      this.number = scene.enemyNumber;
      this.hasSwitched = false;
      this.healthBar;
    } else {
      Phaser.GameObjects.Sprite.call(this, scene, 675, 224, "p2attackers");
      this.follower = { t: 1, vec: new Phaser.Math.Vector2() };
      scene.enemyNumber++;
      this.number = scene.enemyNumber;
      this.hasSwitched = false;
      this.healthBar;
    }
  },
  //differentiate player attacks based on class
  //if playerA then create a playera attacker else create a playerb attacker

  startOnPath: function (path) {
    this.path = path;
    if (this.createdByPlayerA) {
      // set the t parameter at the start of the path
      this.follower.t = 0;
      this.anims.play("blue2Walk");
      // get x and y of the given t point
      // console.log(this.path.getPoint(this.follower.t, this.follower.vec));
      this.path.getPoint(this.follower.t, this.follower.vec);
      // set the x and y of our enemy to the received from the previous step
      this.setPosition(this.follower.vec.x, this.follower.vec.y);
      this.hp = 100;
      this.healthBar = this.scene.makeBar(this.follower.vec.x-20,this.follower.vec.y+20, 0x712ecc);
      this.scene.setValue(this.healthBar,this.hp)
    } else {
      this.follower.t = 1;
      this.anims.play("red2Walk");
      this.path.getPoint(this.follower.t, this.follower.vec);
      // set the x and y of our enemy to the received from the previous step
      this.setPosition(this.follower.vec.x, this.follower.vec.y);
      this.hp = 100;
      this.healthBar = this.scene.makeBar(this.follower.vec.x-20,this.follower.vec.y+20, 0x712ecc);
      this.scene.setValue(this.healthBar,this.hp)
    }
  },

  receiveDamage: function (damage) {
    // decrement health points
    this.hp -= damage;
    console.log(`enemy ${this.number} took damage`, this.hp);
    this.scene.setValue(this.healthBar,this.hp);
    //console.log(">>>after bullet", this.hp);
    // if hp drops below 0 we deactivate this enemy
    if (this.hp <= 0) {
      if (this.scene.isPlayerA && this.hasSwitched) {
        this.scene.incrementBlueScore();
      }
      if (!this.scene.isPlayerA && this.hasSwitched) {
        this.scene.incrementRedScore();
      }
      this.scene.resourcePoints += 1;
      this.scene.resourceText.setText("USER | " + this.scene.resourcePoints);
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

        if (this.follower.t >= 0.5 && !this.hasSwitched) {
          this.anims.play("reverseBlue2Walk");
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
          this.anims.play("reverseRed2Walk");
          this.scene.decrementBlueScore();
          this.hasSwitched = true;
        }

        if (this.follower.t <= 0) {
          this.scene.incrementRedScore();
          this.healthBar.destroy();
          this.destroy();
        }
      }
    }
  },
});
