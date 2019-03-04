const Phaser = require('phaser');

class StartMenu extends Phaser.Scene {
  constructor() {
    super('StartMenu');
  }

  create() {
    this.element = document.querySelector('#start-screen');
    this.element.classList.remove('hidden');
    this.keys = {
      space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };
  }

  update(_, deltaTime) {
    if (this.keys.space.isDown) {
      this.element.classList.add('hidden');
      this.scene.start('MainScene');
    }
  }
}

module.exports = StartMenu;
