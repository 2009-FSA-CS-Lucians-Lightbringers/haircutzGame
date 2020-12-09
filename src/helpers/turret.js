export default new Phaser.Class({
	Extends: Phaser.GameObjects.Image,

	initialize: function Turret(scene) {
		this.timeCreated = scene.time.now;
		// scene.drawClock(this.x, this.y, this.timeCreated);
		this.createdByPlayerA = scene.turretPlacer;
		if (scene.turretPlacer)
			Phaser.GameObjects.Image.call(this, scene, 0, 0, 'p1turret');
		else Phaser.GameObjects.Image.call(this, scene, 0, 0, 'p2turret');
		this.nextTic = 0;
		this.hasSwitched = false;
		this.length = 20;
		this.newLength;
		this.turretDuration;
	},
	// we will place the turret according to the grid
	place: function (i, j) {
		this.y = i * 64 + 64 / 2;
		this.x = j * 64 + 64 / 2 + 14;
		this.scene.map[i][j] = 1;
		this.scene.map2[i][j] = 1;
		this.i = i;
		this.j = j;

		this.turretDuration = this.scene.add.text(this.x-20, this.y+40, `${this.length}`, {
      fontFamily: "Arial Black",
      fontStyle: "bold",
      fontSize: "15px",
      fill: "black",
		})
	},
	update: function (time, delta) {

		if (time > this.nextTic) {
			this.turretDuration.setText(`${this.length}`)
			this.length--;
			this.fire();
			this.nextTic = time + 1000;
		}
		this.scene.map[this.i][this.j] = 0;
		this.scene.map2[this.i][this.j] = 0;
		if (this.timeCreated + 20000 < this.scene.time.now) {
			this.destroy();
			this.turretDuration.destroy();
		}
	},
	fire: function () {
		if (this.createdByPlayerA === this.scene.isPlayerA) {
			var enemy = this.scene.getEnemy(this.x, this.y, 100);
			if (enemy) {
				var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
				this.scene.addBullet(this.x, this.y, angle, this.createdByPlayerA);
				this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
			}
		} else {
			var attacker = this.scene.getAttacker(this.x, this.y, 100);
			if (attacker) {
				var angle = Phaser.Math.Angle.Between(
					this.x,
					this.y,
					attacker.x,
					attacker.y
				);
				this.scene.addBullet(this.x, this.y, angle, this.createdByPlayerA);
				this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
			}
		}
	},
});

//.createdByPlayerA !== this.scene.isPlayerA
