'use strict'

const { Vector, Polygon, Rect, Ellipse } = require('../geometry.js');
const { basicPackUp, } = require('../mix.js');

class SpeedPotion {
  constructor(position, factor = 1.2, timeOut = 10) {
    this.type = 'potion';
    this.img = 'potions/speedPotion.png';
    this.width = 30;
    this.height = 30;
    this.space = new Rect(position, 15, 15);

    this.factor = factor;
    this.timeOut = timeOut;
  }
  affect(obj) {
    if (obj.maxSpeed) {
      const backUp = obj.maxSpeed;
      obj.maxSpeed *= this.factor;
      setTimeout( () => {
        obj.maxSpeed = backUp;
      }, this.timeOut);
    }
  }
  packUp() {
    return basicPackUp(this);
  }
}

module.exports = SpeedPotion;
