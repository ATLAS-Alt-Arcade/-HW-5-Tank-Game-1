const Phaser = require('phaser');

// Import Actors
const Player = require('../Player');
const Bullet = require('../Bullet');
const Enemy = require('../Enemy');

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
    // Phaser Elements
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

    // Game vars
    this.p1 = new Player(this.game.config.width / 2, this.game.config.height / 2);

    this.bullets = [];
    for (let i = 0; i < 20; i ++) {
      this.bullets.push(new Bullet());
    }

    this.enemies = [];
    for (let i = 0; i < 20; i ++) {
      this.enemies.push(new Enemy());
    }
    this.enemySpawnTime = 2000;

    // Code for only firing bullet on space up
    this.isLastSpaceDown = false;

    // Screen Shake
    this.isShaking = false;
    this.shakeTime = 0;
    this.shakeIntensity = 0;
    this.shakeXScale = 0;
    this.shakeYScale = 0;
    this.shakeSpeed = 0;
  }

  startScreenShake(intensity, duration, speed) {
    this.isShaking = true;
    this.shakeIntensity = intensity;
    this.shakeTime = duration;
    this.shakeSpeed = speed;

    this.shakeXScale = Math.random() > 0.5 ? 1 : -1;
    this.shakeYScale = Math.random() > 0.5 ? 1 : -1;
  }

  updateScreenShake(deltaTime) {
    if (this.isShaking) {
      this.shakeTime -= deltaTime;

      const shakeAmount = this.shakeTime / this.shakeSpeed;
      this.game.canvas.style.left = window.innerWidth / 2 - 400 + (Math.cos(shakeAmount) * this.shakeXScale * this.shakeIntensity) + "px";
      this.game.canvas.style.top = window.innerHeight / 2 - 300 + (Math.sin(shakeAmount) * this.shakeYScale * this.shakeIntensity) + "px";
      console.log(Math.cos(shakeAmount) * this.shakeXScale * this.shakeIntensity);

      if (this.shakeTime < 0) {
        this.isShaking = false;
        this.game.canvas.style.left = 'calc(50vw - 400px)';
        this.game.canvas.style.top = 'calc(50vh - 300px)';
      }

    }
  }

  update(_, deltaTime) {
    this.updateScreenShake(deltaTime);
    // Update Player
    this.p1.update(deltaTime, this.keys);

    // Keep player on screen
    if (this.p1.x > this.game.config.width + 5) {
      this.p1.setX(0);
    }

    if (this.p1.x < -5) {
      this.p1.setX(this.game.config.width - 5);
    }

    if (this.p1.y > this.game.config.height + 5) {
      this.p1.setY(0);
    }

    if (this.p1.y < -5) {
      this.p1.setY(this.game.config.height - 5);
    }

    // Fire bullet once when space key is pressed
    if (this.keys.space.isDown && !this.isLastSpaceDown) {
      const newBullet = this.bullets.find(b => !b.isActive);
      if (newBullet) newBullet.activate(this.p1.x, this.p1.y, this.p1.cannonRot);

      this.startScreenShake(3, 500, 50);
    }
    this.isLastSpaceDown = this.keys.space.isDown;

    // Spawn enemies every 2 sec
    if (this.enemySpawnTime < 0) {
      const newEnemy = this.enemies.find(e => !e.isActive);
      if (newEnemy) newEnemy.activate(Math.random() * this.game.config.width, Math.random() * this.game.config.height);
      this.enemySpawnTime = 5000;
    }
    this.enemySpawnTime -= deltaTime;

    // Update bullets
    this.bullets.forEach(b => b.update(deltaTime));
    // collide on the enemies
    this.enemies.forEach(e => {
      if (e.isActive) {
        this.bullets.forEach(b => {
          if (b.isActive && isCircleCollision(e, b)) {
            e.deactivate();
            b.deactivate();

            this.startScreenShake(4, 300, 1);
          }
        });
      }
    });

    // Draw everything
    this.graphics.clear();
    this.p1.draw(this.graphics);
    this.bullets.forEach(b => b.draw(this.graphics));
    this.enemies.forEach(e => e.draw(this.graphics));
  }
}

module.exports = MainScene;