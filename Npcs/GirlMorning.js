'use strict'

const { Vector, Rect, Ellipse, } = require('../geometry.js');
const { moveMixin, changeDirectionMixin, actorImgAttrsMixin, sayMixin, actorPackUp, } = require('../mix.js');

class GirlMorning {
  constructor(sceneBackgroundImg, x, y, act) {
    this.sceneBackgroundImg = sceneBackgroundImg;
    this.space = new Rect(new Vector(x, y), 8, 4);
    this.initialPosition = new Vector(x,y);
    this.act = act;

    this.img = 'npcs/girlMorning.png';
    this.eyesight = new Ellipse(new Vector(), 80);
    this.direction = 0;
    this.maxSpeed = 200;
    this.actions = [];
    this.saying = '';
    actorImgAttrsMixin(this);
    this.width = 32;
    this.height = 48;
    this.standPoint = { x: 16, y: 43 };
  }
  get position() {
    return this.space.position;
  }

  packUp() {
    this.pack = actorPackUp(this);
    return this.pack;
  }
}
moveMixin(GirlMorning.prototype);
changeDirectionMixin(GirlMorning.prototype);
sayMixin(GirlMorning.prototype);


module.exports = GirlMorning;
