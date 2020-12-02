export default new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize: function Enemy(scene) {
    this.createdByPlayerA = scene.event;
    if (scene.event) {
      //if playerA hit the keyboard - create a p1 attacker

      Phaser.GameObjects.Sprite.call(this, scene, 85, 224, "p1attackers");
      this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
      scene.enemyNumber++;
      this.number = scene.enemyNumber;
    } else {
      Phaser.GameObjects.Sprite.call(this, scene, 650, 224, "p2attackers");
      this.follower = { t: 0.8, vec: new Phaser.Math.Vector2() };
      scene.enemyNumber++;
      this.number = scene.enemyNumber;
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
      console.log(this.hp);
    } else {
      this.path = path;
      this.follower.t = 0.8;

      this.path.getPoint(this.follower.t, this.follower.vec);
      // set the x and y of our enemy to the received from the previous step
      this.setPosition(this.follower.vec.x, this.follower.vec.y);
      this.hp = 100;
      console.log(this.hp);
    }
  },

  receiveDamage: function (damage) {
    console.log("before damage:", this.hp);
    console.log("damage:", damage);
    this.hp -= damage;
    console.log("after damage:", this.hp);

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
        this.follower.t += this.scene.ENEMY_SPEED * delta;

        if (this.follower.t >= 1) {
          this.setActive(false);
          this.setVisible(false);
        }
      } else {
        this.follower.t -= this.scene.ENEMY_SPEED * delta;

        if (this.follower.t <= 0) {
          this.setActive(false);
          this.setVisible(false);
        }
      }
    }
  },
});
