// Import outside libraries
const Phaser = require('phaser');

// Import Scenes
const StartScreen = require('./Scenes/StartScreen');
const MainScene = require('./Scenes/MainScene');

const phaserConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [StartScreen, MainScene],
};

let game;

// Exported Module
const GameManager = {
  init: () => {
    game = new Phaser.Game(phaserConfig);

    // Screen shake setup
    game.canvas.classList.add('shake-enabled');
  },
};

module.exports = GameManager;
