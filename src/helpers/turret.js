export default new Phaser.Class({
  Extends: Phaser.GameObjects.Image,

  initialize: function Turret(scene) {
    this.createdByPlayerA = scene.turretPlacer;
    if (scene.turretPlacer)
      Phaser.GameObjects.Image.call(this, scene, 0, 0, "p1turret");
    else Phaser.GameObjects.Image.call(this, scene, 0, 0, "p2turret");
    this.nextTic = 0;
  },
  // we will place the turret according to the grid
  place: function (i, j) {
    this.y = i * 64 + 64 / 2;
    this.x = j * 64 + 64 / 2 + 14;
    this.scene.map[i][j] = 1;
    this.scene.map2[i][j] = 1;
  },
  update: function (time, delta) {
    // time to shoot
    if (time > this.nextTic) {
      this.fire();
      this.nextTic = time + 1000;
    }
  },
  fire: function () {
    var enemy = this.scene.getEnemy(this.x, this.y, 100);
    if (enemy) {
      // console.log(enemy.createdByPlayerA);
      // console.log(this.createdByPlayerA);
      if (enemy.createdByPlayerA !== this.createdByPlayerA) {
        var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
        this.scene.addBullet(this.x, this.y, angle);
        this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
      }
    }
  },
});

//.createdByPlayerA !== this.scene.isPlayerA
