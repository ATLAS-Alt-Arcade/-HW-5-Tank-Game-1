const Phaser = require('phaser');

const Player = require('../Player');
const Bullet = require('../Bullet');

/**
 * Helper function for checking if two circles are colliding
 * 
 * @param {object} c1 : must have x, y, and radius property
 * @param {object} c2 : must have x, y, and radius property
 */
function isCircleCollision(c1, c2) {
  // Get the distance between the two circles
  const distSq = (c1.x - c2.x) * (c1.x - c2.x) + (c1.y - c2.y) * (c1.y - c2.y);
  const radiiSq = (c1.radius * c1.radius) + (c2.radius * c2.radius);

  // Returns true if the distance btw the circle's center points is less than the sum of the radii
  return (distSq < radiiSq);
}

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  create() {
    this.keys = {
      left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      d: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  
    this.graphics = this.add.graphics({
      fillStyle: { color: 0xeeeeee },
      lineStyle: { width: 3, color: 0xeeeeee }
    });

    console.log(this);

    this.wasLastSpaceDown = false;
    this.player = new Player(this.game.config.width / 2, this.game.config.height / 2);
    
    // Create pools
    this.bullets = [];
    for (let i = 0; i < 20; i ++) {
      this.bullets.push(new Bullet());
    }
  }

  update(_, deltaTime) {
    // Update Player
    this.player.update(deltaTime, this.keys);

    // Keep player on screen
    if (this.player.x > this.game.config.width + 5) {
      this.player.setX(0);
    }

    if (this.player.x < -5) {
      this.player.setX(this.game.config.width - 5);
    }

    if (this.player.y > this.game.config.height + 5) {
      this.player.setY(0);
    }

    if (this.player.y < -5) {
      this.player.setY(this.game.config.height - 5);
    }

    // Fire bullet once when space key is pressed
    if (this.keys.space.isDown && !this.isLastSpaceDown) {
      const newBullet = this.bullets.find(b => !b.isActive);
      if (newBullet) newBullet.activate(this.player.x, this.player.y, this.player.forwardRot);
    }
    this.isLastSpaceDown = this.keys.space.isDown;

    // Update bullets
    this.bullets.forEach(b => b.update(deltaTime));

    // Draw everything
    this.graphics.clear();
    this.player.draw(this.graphics);
    this.bullets.forEach(b => b.draw(this.graphics));
  }
}

module.exports = MainScene;
