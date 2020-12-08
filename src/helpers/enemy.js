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
    } else {
      Phaser.GameObjects.Sprite.call(this, scene, 675, 224, "p2attackers");
      this.follower = { t: 1, vec: new Phaser.Math.Vector2() };
      scene.enemyNumber++;
      this.number = scene.enemyNumber;
      this.hasSwitched = false;
    }
  },
  //differentiate player attacks based on class
  //if playerA then create a playera attacker else create a playerb attacker

  startOnPath: function (path) {
    this.path = path;
    if (this.createdByPlayerA) {
      // set the t parameter at the start of the path
      this.follower.t = 0;
      this.anims.play("blueWalk");
      // get x and y of the given t point
      // console.log(this.path.getPoint(this.follower.t, this.follower.vec));
      this.path.getPoint(this.follower.t, this.follower.vec);
      // set the x and y of our enemy to the received from the previous step
      this.setPosition(this.follower.vec.x, this.follower.vec.y);
      this.hp = 100;
    } else {
      this.follower.t = 1;
      this.anims.play("redWalk");
      this.path.getPoint(this.follower.t, this.follower.vec);
      // set the x and y of our enemy to the received from the previous step
      this.setPosition(this.follower.vec.x, this.follower.vec.y);
      this.hp = 100;
    }
  },

  receiveDamage: function (damage) {
    // decrement health points

    this.hp -= damage;
    console.log(`enemy ${this.number} took damage`, this.hp);
    //console.log(">>>after bullet", this.hp);
    // if hp drops below 0 we deactivate this enemy
    if (this.hp <= 0) {
      if(this.scene.isPlayerA && this.hasSwitched){
        this.scene.incrementBlueScore();
      }
      if(!this.scene.isPlayerA && this.hasSwitched){
        this.scene.incrementRedScore();
      }
      this.scene.resourcePoints += 1;
      this.scene.resourceText.setText("USER RP | " + this.scene.resourcePoints);
      this.destroy();
    }
  },

  update: function (time, delta) {
    if (this.path) {
      this.path.getPoint(this.follower.t, this.follower.vec);
      this.setPosition(this.follower.vec.x, this.follower.vec.y);
      if (this.createdByPlayerA) {
        this.follower.t += this.scene.SCISSOR_SPEED * delta;

        if(this.follower.t >= .5 && !this.hasSwitched){
          this.anims.play("reverseBlueWalk");
          this.scene.decrementRedScore();
          this.hasSwitched = true;
        }

        if (this.follower.t >= 1) {
          this.scene.incrementBlueScore();
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
          this.scene.incrementRedScore();
          this.destroy();
        }
      }
    }
  },
});
