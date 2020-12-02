export default new Phaser.Class({
  Extends: Phaser.GameObjects.Image,

  initialize: function EnemyBase(scene) {
    Phaser.GameObjects.Image.call(this, scene, 715, 224, "p2base");
  },
});
