export default class Card {
  constructor(scene) {
    this.render = (x, y, sprite) => {
      let card = scene.add
        .image(x, y, sprite)
        .setScale(0.3, 0.3)
        .setInteractive();
      scene.input.setDraggable(card);
      return card;
    };
  }
}

//was originally this in game.js:
// this.card = this.add
// .image(300, 300, "cyanCardFront")
// .setScale(0.3, 0.3)
// .setInteractive();
// this.input.setDraggable(this.card);
