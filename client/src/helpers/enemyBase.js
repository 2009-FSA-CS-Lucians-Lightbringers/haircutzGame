export default new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize: function EnemyBase(scene) {
    Phaser.GameObjects.Sprite.call(this, scene, 715, 224, "p2base");
    this.anims.play('startingpoint')
  },
});
