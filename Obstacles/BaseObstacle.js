const { Vector, Polygon } = require('../geometry.js');
const { basicPackUp } = require('../mix.js');

class BaseObstacle {
  constructor(space) {
    this.space = space;
  }
  packUp() {
    return basicPackUp(this);
  }
  static fromArrays(pointArrays) {
    return new BaseObstacle(new Polygon(new Vector(), pointArrays.map(pointArray => new Vector(pointArray[0], pointArray[1]))));
  }
}

module.exports = BaseObstacle;
