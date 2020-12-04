export default new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize: function HomeBase(scene) {
    Phaser.GameObjects.Sprite.call(this, scene, 95, 224, "p1base");
    this.anims.play("homeStartingpoint");
  },
});
