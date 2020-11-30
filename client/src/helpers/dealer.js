import Card from "./card";

export default class Dealer {
  constructor(scene) {
    this.dealCards = () => {
      let playerSprite;
      let opponentSprite;

      //determines which cards to use for different players
      if (scene.isPlayerA) {
        playerSprite = "cyanCardFront";
        opponentSprite = "magentaCardBack";
      } else {
        playerSprite = "magentaCardFront";
        opponentSprite = "cyanCardBack";
      }

      //deals 5 cards to player and renders them face-up at bottom
      for (let i = 0; i < 5; i++) {
        let playerCard = new Card(scene);
        playerCard.render(475 + i * 100, 650, playerSprite);

        //deals 5 cards to player and renders them face-down at top
        let opponentCard = new Card(scene);
        scene.opponentCards.push(
          opponentCard
            .render(475 + i * 100, 125, opponentSprite)
            .disableInteractive()
        );
      }
    };
  }
}

//replaces dealCards function from game.js
// this.dealCards = () => {
//   for (let i = 0; i < 5; i++) {
//     let playerCard = new Card(this);
//     playerCard.render(475 + i * 100, 650, "cyanCardFront");
//   }
// };
