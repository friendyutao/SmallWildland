const { Vector, Ellipse } = require('../geometry.js');
const { basicPackUp } = require('../mix.js');

class HealthField {
  constructor(position, factor = 2) {
    this.img = 'fields/healthField/0.png';
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
    this.img = 'fields/healthField/' + this.frame + '.png';
      this.frame = ++this.frame % 13;
      this.time = 0;
    }
  }
  affect(obj, time) {
    if (obj.health) {
      obj.health += time * this.factor;
      if (obj.maxHealth && obj.health > obj.maxHealth) {
        obj.health = obj.maxHealth;
      }
    }
  }
  packUp() {
    const pack = basicPackUp(this);
    Object.assign(pack, { vertexes: this.space.vertexes });
    return pack;
  }

}

module.exports = HealthField;

