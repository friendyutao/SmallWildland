'use strict'

const { Vector, Polygon, Rect, Ellipse } = require('../geometry.js');
const { basicPackUp, } = require('../mix.js');

class Pistol {
  constructor(position) {
    this.type = 'weapon';
    this.img = 'weapons/pistol.png';
    this.layer = -10;
    this.width = 30;
    this.height = 30;
    this.space = new Rect(position, 38, 27);
  }
  fire() {
    if (this.energe > 0.1) {
      this.energe -= 0.1;
      const speed = Vector.fromAngle(this.direction).scale(300);
      const bullet = new Bullet(this, this.position.plus(speed.scale(0.1)).plus(new Vector(0, -10)), this.direction, speed);
      return [bullet, ];
    }
  }
  packUp() {
    return basicPackUp(this);
  }
}

class Bullet {
  constructor(from, position, direction, speed) {
    // space is for collision detect and width & height are for drawing
    this.img = 'bullets/pistol/bullet.png';
    this.layer = -10;
    this.width = 18;
    this.height = 6;

    this.from = from;
    this.space = new Rect(position, 9, 3).rotate(direction);
    this.direction = direction;
    this.speed = speed;
    this.scale = 1;
  }
  affect(actor, time) {
    actor.health && (actor.health -= 0.5);
    this.timeOut = 0;
  }
  act(time) {
    const factor = 1 + time / 2;
    this.space = this.space.move(this.speed.scale(time)).scale(factor);
    this.scale *= factor;
  }
  packUp() {
    const pack = basicPackUp(this);
    Object.assign(pack, {
      direction: this.direction,
      scale: [ this.scale, this.scale ],
    });
    return pack;
  }
}

module.exports = Pistol;
