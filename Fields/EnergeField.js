const { Vector, Ellipse } = require('../geometry.js');
const { basicPackUp } = require('../mix.js');

class EnergeField {
  constructor(position, factor = 2) {
    this.img = 'fields/energeField/0.png';
    this.layer = -10;
    this.width = 104;
    this.height = 90;
    this.space = new Ellipse(position, 42, 30);

    this.factor = factor;
    this.time = 0.1;
    this.frame = 0;
  }
  act(time) {
    this.time += time;
    if (this.time > 0.1) {
      this.img = 'fields/energeField/' + this.frame + '.png';
      this.frame = ++this.frame % 5;
      this.time = 0;
    }
  }
  affect(obj, time) {
    if (obj.energe) {
      obj.energe += time * this.factor;
      if (obj.maxEnerge && obj.energe > obj.maxEnerge) {
        obj.energe = obj.maxEnerge;
      }
    }
  }
  packUp() {
    const pack = basicPackUp(this);
    Object.assign(pack, { vertexes: this.space.vertexes });
    return pack;
  }

}

module.exports = EnergeField;

