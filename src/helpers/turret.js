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
		this.length;
		this.level1 = false
		this.level2 = false
		this.level3 = false
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
		if(this.attribute === 1){
			this.level1 = true;
			this.length = 10;
		}
		if(this.attribute === 2){
			this.level2 = true;
			this.length = 20;
			if(this.createdByPlayerA){
				this.setTexture("p1turretLvl2")
			}
			if(!this.createdByPlayerA){
				this.setTexture("p2turretLvl2")
			}
		}
		if(this.attribute === 3){
			this.level3 = true;
			this.length = 30;
			if(this.createdByPlayerA){
				this.setTexture("p1turretLvl3");
			}
			if(!this.createdByPlayerA){
				this.setTexture("p2turretLvl3");
			}
		}
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
		if(this.level1){
			if(this.timeCreated + 10000 < this.scene.time.now){
			this.destroy()
			this.turretDuration.destroy();
			}
		}
		if(this.level2){
			if(this.timeCreated + 20000 < this.scene.time.now){
			this.destroy()
			this.turretDuration.destroy();
			}
		}
		if(this.level3){
			if(this.timeCreated + 30000 < this.scene.time.now){
			this.destroy()
			this.turretDuration.destroy();
			}
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
