# Haircutz Overiew

A 2D online multiplayer tower defense game, created and designed by Jesse Swedlund, Andrew Cohen, Tim Samuel and Min Kyu Han.

Deployed Game --> https://haircutz.herokuapp.com/
Play with a friend or against the computer!

HairCutz was built using Phaser.js and Socket.IO on a Node.js / Express server. Users can create rooms to play private matches against their friends, can join rooms against random users, or can play games against computer opponents. Once gameplay begins, users must send attackers towards their enemy's base, or set turrets to defend their home base by spending resource points and timing the release to maximize their attacker or defender's strength. In order to achieve multiplayer functionality, we created a semi-authoritative server that emits synchronous events to the users subscribed to the same Socket room. We enjoyed working on all aspects of this game and hope that you enjoy playing!

CONTROLS:
Create Attacker: Left click and drag your scissor icon to the top, middle, or bottom path.
Create Defender: Left click and drag your defender icon to a colored drop zone on your side of the game board.
Time Release: Time the drop release of your attackers or defenders with the moving meter at the top of the screen. Releasing in the middle will give you the strongest, blue will give you the weakest, and red will give you the average.

GOAL:
Mission: The other player is trying to cut off your precious locks of hair! Defend yourself by placing turrets and sending out some attackers of your own. The first player to collect all of the other player's hair wins!
Resource Points: Defenders cost 3, Attackers cost 2
Time: 3 additional points will be given every 10 seconds. You also gain 1 resource point by destroying an enemy scissor!

## Dev Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command               | Description                                                                     |
| --------------------- | ------------------------------------------------------------------------------- |
| `npm install`         | Install project dependencies                                                    |
| `npm start`           | Stars node server                                                               |
| `npm start-dev`       | build-watch w/ dev settings, launches nodemon dev server on local host          |
| `npm run build`       | Builds code bundle with production settings (minification, uglification, etc..) |
| `npm run build-watch` | Builds code bundle with production settings (minification, uglification, etc..) |
