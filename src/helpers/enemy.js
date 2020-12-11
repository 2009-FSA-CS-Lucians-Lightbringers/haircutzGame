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
      this.level1 = false;
      this.level2 = false;
      this.level3 = false;
    } else {
      Phaser.GameObjects.Sprite.call(this, scene, 675, 224, "p2attackers");
      this.follower = { t: 1, vec: new Phaser.Math.Vector2() };
      scene.enemyNumber++;
      this.number = scene.enemyNumber;
      this.hasSwitched = false;
      this.healthBar;
      this.level1 = false;
      this.level2 = false;
      this.level3 = false;
    }
  },
  //differentiate player attacks based on class
  //if playerA then create a playera attacker else create a playerb attacker

  startOnPath: function (path) {
    this.path = path;
    if (this.createdByPlayerA) {
      // set the t parameter at the start of the path
      this.follower.t = 0;
      // get x and y of the given t point
      this.path.getPoint(this.follower.t, this.follower.vec);
      // set the x and y of our enemy to the received from the previous step
      this.setPosition(this.follower.vec.x, this.follower.vec.y);
      if(this.attribute === 1){
        this.level1 = true;
        this.anims.play("blueWalk");
        this.healthBar = this.scene.makeBar(this.follower.vec.x-10,this.follower.vec.y-20, 0x712ecc);
        this.hp = 80;
      }
      if(this.attribute === 2){
        this.level2 = true;
        this.anims.play("blue2Walk");
        this.healthBar = this.scene.makeBar(this.follower.vec.x-20,this.follower.vec.y-20, 0x712ecc);
        this.hp = 100;
      }
      if(this.attribute === 3){
        this.level3 = true;
        this.anims.play("blue3Walk");
        this.healthBar = this.scene.makeBar(this.follower.vec.x-30,this.follower.vec.y-20, 0x712ecc);
        this.hp = 120;
      }
      this.scene.setValue(this.healthBar,this.hp)
    } else {
      this.follower.t = 1;
      this.path.getPoint(this.follower.t, this.follower.vec);
      // set the x and y of our enemy to the received from the previous step
      this.setPosition(this.follower.vec.x, this.follower.vec.y);
      if(this.attribute === 1){
        this.level1 = true;
        this.anims.play("redWalk");
        this.healthBar = this.scene.makeBar(this.follower.vec.x-10,this.follower.vec.y-20, 0x712ecc);
        this.hp = 80;
      }
      if(this.attribute === 2){
        this.level2 = true;
        this.anims.play("red2Walk");
        this.healthBar = this.scene.makeBar(this.follower.vec.x-20,this.follower.vec.y-20, 0x712ecc);
        this.hp = 100;
      }
      if(this.attribute === 3){
        this.level3 = true;
        this.anims.play("red3Walk");
        this.healthBar = this.scene.makeBar(this.follower.vec.x-30,this.follower.vec.y-20, 0x712ecc);
        this.hp = 120;
      }
      this.scene.setValue(this.healthBar,this.hp)
    }
  },

  receiveDamage: function (damage) {
    // decrement health points
    this.hp -= damage;
    console.log(`enemy ${this.number} took damage`, this.hp);
    this.scene.setValue(this.healthBar, this.hp);
    if (this.hp <= 0) {
      this.scene.game.socket.emit(
        "removeEnemy",
        this.number,
        this.createdByPlayerA
      );
    }
  },

  removeEnemy() {
    if (this.scene.isPlayerA && this.hasSwitched) {
      this.scene.incrementBlueScore();
      this.scene.woohoo.play()
    }
    if (!this.scene.isPlayerA && this.hasSwitched) {
      this.scene.incrementRedScore();
      this.scene.woohoo.play()
    }
    console.log("Removing Enemy...");
    this.scene.resourcePoints += 1;
    this.scene.resourceText.setText("USER | " + this.scene.resourcePoints);
    this.healthBar.destroy();
    this.destroy();
  },

  update: function (time, delta) {
    if (this.path) {
      this.path.getPoint(this.follower.t, this.follower.vec);
      this.setPosition(this.follower.vec.x, this.follower.vec.y);
      if(this.level1){
        this.healthBar.setPosition(this.follower.vec.x-10, this.follower.vec.y+20)
      }
      if(this.level2){
        this.healthBar.setPosition(this.follower.vec.x-20, this.follower.vec.y+20)
      }
      if(this.level3){
        this.healthBar.setPosition(this.follower.vec.x-30, this.follower.vec.y+20)
      }
      if (this.createdByPlayerA) {
        this.follower.t += this.scene.SCISSOR_SPEED * delta;

        if (this.follower.t >= 0.5 && !this.hasSwitched) {
          if(this.level1){
            this.anims.play("reverseBlueWalk");
          }
          if(this.level2){
            this.anims.play("reverseBlue2Walk");
          }
          if(this.level3){
            this.anims.play("reverseBlue3Walk");
          }
          this.scene.decrementRedScore();
          this.hasSwitched = true;
        }

        if (this.follower.t >= 1) {
          this.scene.incrementBlueScore();
          this.scene.woohoo.play()
          this.healthBar.destroy();
          this.destroy();
        }
      } else {
        this.follower.t -= this.scene.SCISSOR_SPEED * delta;
        if (this.follower.t <= 0.5 && !this.hasSwitched) {
          if(this.level1){
            this.anims.play("reverseRedWalk");
          }
          if(this.level2){
            this.anims.play("reverseRed2Walk");
          }
          if(this.level3){
            this.anims.play("reverseRed3Walk");
          }
          this.scene.decrementBlueScore();
          this.hasSwitched = true;
        }

        if (this.follower.t <= 0) {
          this.scene.incrementRedScore();
          this.scene.woohoo.play()
          this.healthBar.destroy();
          this.destroy();
        }
      }
    }
  },
});
