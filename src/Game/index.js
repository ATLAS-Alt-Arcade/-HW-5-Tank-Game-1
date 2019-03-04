// Import outside libraries
const Phaser = require('phaser');

// SCENES
const StartMenu = require('./Scenes/StartMenu');
const MainScene = require('./Scenes/MainScene');
const GameOver = require('./Scenes/GameOver');

const phaserConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [StartMenu, MainScene, GameOver]
};

let game;

// Exported Module
const GameManager = {
  init: () => {
    game = new Phaser.Game(phaserConfig);
  },
};

module.exports = GameManager;
