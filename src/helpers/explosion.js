export default new Phaser.Class({
  Extends: Phaser.GameObjects.Sprite,

  initialize: function Explosion(scene) {
    Phaser.GameObjects.Sprite.call(this, scene, 0, 0, "explosions");

  },

  fire: function (x, y) {
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
    this.anims.play("explosions");
    console.log("explosion firing")
    this.once('animationcomplete', () => {
      console.log('animationcomplete')
      this.destroy()
  })
},

  update: function (time, delta) {

  },
});
