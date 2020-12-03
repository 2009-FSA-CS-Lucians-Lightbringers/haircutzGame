# Phaser 3 Webpack Project Template

A Phaser 3 project template with ES6 support via [Babel 7](https://babeljs.io/) and [Webpack 4](https://webpack.js.org/)
that includes hot-reloading for development and production-ready builds.

Loading images via JavaScript module `import` is also supported.

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command         | Description                                                                     |
| --------------- | ------------------------------------------------------------------------------- |
| `npm install`   | Install project dependencies                                                    |
| `npm start`     | Build project and open web server running project                               |
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) |

## Writing Code

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development
server by running `npm start`.

After starting the development server with `npm start`, you can edit any files in the `src` folder
and webpack will automatically recompile and reload your server (available at `http://localhost:8080`
by default).

## Customizing Template

### Babel

You can write modern ES6+ JavaScript and Babel will transpile it to a version of JavaScript that you
want your project to support. The targeted browsers are set in the `.babelrc` file and the default currently
targets all browsers with total usage over "0.25%" but excludes IE11 and Opera Mini.

```
"browsers": [
  ">0.25%",
  "not ie 11",
  "not op_mini all"
]
```

### Webpack

If you want to customize your build, such as adding a new webpack loader or plugin (i.e. for loading CSS or fonts), you can
modify the `webpack/base.js` file for cross-project changes, or you can modify and/or create
new configuration files and target them in specific npm tasks inside of `package.json'.

## Deploying Code

After you run the `npm run build` command, your code will be built into a single bundle located at
`dist/bundle.min.js` along with any other assets you project depended.

If you put the contents of the `dist` folder in a publicly-accessible location (say something like `http://mycoolserver.com`),
you should be able to open `http://mycoolserver.com/index.html` and play your game.

// cardPlayed Functionality

// The code block first compares the isPlayerA boolean it receives from the
// server against the client's own isPlayerA, which is a check to determine
// whether the client that is receiving the event is the same one that generated
// it.

// Let's think that through a bit further, as it exposes a key component to how
// our client - server relationship works, using Socket.IO as the connector.
// Suppose that Client A connects to the server first, and is told through the
// "isPlayerA" event that it should change its isPlayerA boolean to true.
// That's going to determine what kind of cards it generates when a user clicks
// "DEAL CARDS" through that client.

// If Client B connects to the server second, it's never told to alter its
// isPlayerA boolean, which stays false. That will also determine what kind of
// cards it generates.

// When Client A drops a card, it emits a "cardPlayed" event to the server,
// passing information about the card that was dropped, and its isPlayerA
// boolean, which is true. The server then relays all that information back
// up to all clients with its own "cardPlayed" event.

// Client A receives that event from the server, and notes that the isPlayerA
// boolean from the server is true, which means that the event was generated
// by Client A itself. Nothing special happens.

// Client B receives the same event from the server, and notes that the
// isPlayerA boolean from the server is true, although Client B's own isPlayerA
// is false. Because of this difference, it executes the rest of the code block.

// The ensuing code stores the "texturekey" - basically, the image - of the game
// object that it receives from the server into a variable called "sprite".
// It destroys one of the opponent card backs that are rendered at the top of
// the screen, and increments the "cards" data value in the dropzone so that we
// can keep placing cards from left to right.

// The code then generates a new card in the dropzone that uses the sprite
// variable to create the same card that was dropped in the other client
// (if you had data attached to that game object, you could use a similar
// approach to attach it here as well).

//for more: https://www.freecodecamp.org/news/how-to-build-a-multiplayer-card-game-with-phaser-3-express-and-socket-io/
