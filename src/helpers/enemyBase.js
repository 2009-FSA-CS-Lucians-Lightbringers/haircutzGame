export default new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize: function EnemyBase(scene) {
    Phaser.GameObjects.Sprite.call(this, scene, 715, 224, "p2base");

    var redBase = this.anims.play("enemyStartingpoint");
    // redBase.anims.frame = 5
    // console.log(redBase)
  },

  // update: function (time, delta) {
  //   if (this.scene.isPlayerA) {
  //     this.anims.play("enemyStartingpoint");
  //   }
  // },
});
