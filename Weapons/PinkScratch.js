'use strict'

const { Vector, Polygon, Rect, Ellipse } = require('../geometry.js');
const { basicPackUp, } = require('../mix.js');

class PinkScratch {
  constructor(position) {
    this.type = 'weapon';
    this.img = 'weapons/pinkScratch.png';
    this.layer = -10;
    this.width = 30;
    this.height = 30;
    this.space = new Rect(position, 30, 30);
  }
  fire() {
    if (this.energe > 0.1) {
      this.energe -= 0.1;
      return [new Bullet(this, 20), ];
    }
  }
  packUp() {
    return basicPackUp(this);
  }
}

class Bullet {
  constructor(from) {
    this.img = 'bullets/pinkScratch/pinkScratch-0.png',
    this.layer = -10;
    this.width = 60;
    this.height = 60;

    this.from = from;
    this.direction = from.direction;
    this.gap = Vector.fromAngle(from.direction).scale(30).plus(new Vector(0, -10));
    // space is for collision detect and width & height are for drawing
    this.space = new Rect(from.position.plus(this.gap), 25, 25).rotate(from.direction);

    this.speed = from.speed;
    this.frame = 0;
    this.timeOut = 0.2;
  }
  affect(actor, time) {
    actor.health && (actor.health -= time * 5);
    actor.speed && (actor.speed = actor.speed.scale(0.5));
  }
  act(time) {
    if (this.from.direction != this.direction) { this.timeOut = 0; }
    this.img = 'bullets/pinkScratch/pinkScratch-' + this.frame + '.png';
    this.frame = ++this.frame % 7;
    this.space.position = this.from.position.plus(this.gap);
    this.timeOut -= time;
  }
  packUp() {
    const pack = basicPackUp(this);
    Object.assign(pack, {
      direction: this.direction,
    });
    return pack;
  }

}

module.exports = PinkScratch;
