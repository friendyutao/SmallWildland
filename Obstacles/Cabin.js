const { Vector, Polygon } = require('../geometry.js');
const { basicPackUp } = require('../mix.js');

class Cabin {
  constructor(x, y) {
    this.img = 'buildings/cabin.png';
    this.width = 200;
    this.height = 130;
    this.space = new Polygon(new Vector(x, y), [
      new Vector(190, 83), 
      new Vector(95, 35), 
      new Vector(5, 82), 
      new Vector(26, 93), 
      new Vector(50, 90), 
      new Vector(115, 122),
      new Vector(133, 116),
      new Vector(110, 95),
      new Vector(144, 80),
      new Vector(170, 100),
    ].map(vec => vec = vec.plus(new Vector(this.width, this.height).scale(- 0.5))));
  }
  packUp() {
    return basicPackUp(this);
  }

}

module.exports = Cabin;

