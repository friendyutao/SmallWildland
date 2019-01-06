const { Vector, Ellipse } = require('../geometry.js');
const { basicPackUp } = require('../mix.js');

class TransportLotus {
  constructor(position, destination = TransportLotus.initialDestination) {
    this.img = 'fields/transportLotus/0.png';
    this.layer = -10;
    this.width = 110;
    this.height = 80;
    this.space = new Ellipse(position, 42, 30);

    this.destination = destination;
    this.time = 0.1;
    this.frame = 0;
  }
  act(time) {
    this.time += time;
    if (this.time > 0.1) {
    this.img = 'fields/transportLotus/' + this.frame + '.png';
      this.frame = ++this.frame % 9;
      this.time = 0;
    }
  }
  affect(obj) {
    if (obj.constructor.name != 'Player') { return }
    if (this.destination.sceneBackgroundImg) {
      obj.sceneBackgroundImg = this.destination.sceneBackgroundImg;
      obj.ride && (obj.ride.sceneBackgroundImg = this.destination.sceneBackgroundImg);
    }
    this.destination.position && ((obj.ride || obj).space.position = this.destination.position);
  }
  packUp() {
    const pack = basicPackUp(this);
    Object.assign(pack, { vertexes: this.space.vertexes });
    return pack;
  }

}
TransportLotus.initialDestination = {
  sceneBackgroundImg: 'scenes/introduction.png',
  position: new Vector(600, 600),
}

module.exports = TransportLotus;

