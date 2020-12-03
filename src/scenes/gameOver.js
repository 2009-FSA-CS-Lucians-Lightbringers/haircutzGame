export default new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function() {
      Phaser.Scene.call(this, { "key": "SceneTwo" });
  },
  init: function(data) {
    this.message = data.message;
    console.log("hello");
},
  preload: function() {},
  create: function() {
    var text = this.add.text(
        400,
        300,
        this.message,
        {
            fontSize: 30,
            color: "white",
            fontStyle: "bold"
        }
    ).setOrigin(0.5);
},
  update: function() {}
});
