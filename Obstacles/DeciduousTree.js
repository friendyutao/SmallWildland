const { Vector, Rect } = require('../geometry.js');
const { basicPackUp } = require('../mix.js');

class DeciduousTree {
  constructor(x, y) {
    this.img = 'trees/deciduousTree.png';
    this.width = 84;
    this.height = 110;
    this.space = new Rect(new Vector(x, y),  18, 5)
  }
  packUp() {
    const pack = basicPackUp(this);
    Object.assign(pack, { 
      standPoint: { x: 30, y: 100 },
    });
    return pack;
  }

}

module.exports = DeciduousTree;

