export default new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize: function EnemyBase(scene) {
    Phaser.GameObjects.Sprite.call(this, scene, 715, 224, "p2base");
    this.anims.play("enemyStartingpoint");
    console.log(this.anims.play("enemyStartingpoint"));
  },

  // update: function (time, delta) {
  //   if (this.scene.isPlayerA) {
  //     this.anims.play("enemyStartingpoint");
  //   }
  // },
});
