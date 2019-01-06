'use strict'

const { Vector, Polygon, Rect, Ellipse } = require('../geometry.js');
const { basicPackUp, } = require('../mix.js');

class BlueShockwave {
  constructor(position) {
    this.type = 'weapon';
    this.img = 'weapons/blueShockwave.png';
    this.layer = -10;
    this.width = 30;
    this.height = 30;
    this.space = new Rect(position, 30, 30);
  }
  fire() {
    if (this.energe > 1) {
      this.energe -= 1;
      const bullet = new Bullet(this);
      return [bullet, ];
    }
  }
  packUp() {
    return basicPackUp(this);
  }

}

class Bullet {
  constructor(from) {
    this.from = from;
    this.img = 'bullets/blueShockwave/blueShockwave-0.png',
    this.layer = -10;
    // space is for collision detect and width & height are for drawing
    this.width = 300;
    this.height = 145;
    this.space = new Ellipse(from.position, 600/2, 145/2);

    this.timeOut = 0.5;
    this.time = 0.1;
    this.frame = 0;
  }
  affect(actor, time) {
    actor.health && (actor.health -= time * 10);
    const vec = actor.position.plus(this.space.position.scale(-1));
    actor.speed = Vector.fromAngle(Math.atan2(vec.y, vec.x)).scale(60);
  }
  act(time) {
    this.time += time;
    this.timeOut -= time;
    if (this.time > 0.1) {
      this.img = 'bullets/blueShockwave/blueShockwave-' + this.frame + '.png';
      this.frame = ++this.frame % 5;
      this.time = 0;
    }
  }
  packUp() {
    return basicPackUp(this);
  }
  
}

module.exports = BlueShockwave;
