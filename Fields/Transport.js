'use strict'

const assert = require('assert');
const { Vector, Rect } = require('../geometry.js');
const { basicPackUp } = require('../mix.js');

class Transport {
  constructor(position, destination = Transport.initialDestination) {
    assert(position.constructor.name == 'Vector');
    this.space = new Rect(position, 10);
    this.destination = destination;
    //this.layer = 5;
  }
  affect(obj) {
    if (obj.constructor.name != 'Player') { return }
    if (this.destination.sceneBackgroundImg) {
      obj.sceneBackgroundImg = this.destination.sceneBackgroundImg;
      obj.ride && (obj.ride.sceneBackgroundImg = this.destination.sceneBackgroundImg);
    }
    this.destination.position && ((obj.ride || obj).space.position = this.destination.position);
  }
    /*
    // to see it's location at client
  packUp() {
    const pack = basicPackUp(this);
    Object.assign(pack, { vertexes: this.space.vertexes });
    return pack;
  }
  */
}
Transport.initialDestination = {
  sceneBackgroundImg: 'scenes/introduction.png',
  position: new Vector(600, 600),
}

module.exports = Transport;

