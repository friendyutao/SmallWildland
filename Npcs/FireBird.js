'use strict'

const { Vector, Rect, Ellipse, } = require('../geometry.js');
const { moveMixin, changeDirectionMixin, actorImgAttrsMixin, sayMixin, actorPackUp, } = require('../mix.js');

class FireBird {
  constructor(sceneBackgroundImg, position) {
    this.sceneBackgroundImg = sceneBackgroundImg;
    this.space = new Rect(position, 40, 40);

    this.img = 'npcs/fireBird.png';
    this.eyesight = new Ellipse(new Vector(), 80);
    this.direction = 0;
    this.maxSpeed = 200;
    this.actions = [];
    this.saying = '';
    actorImgAttrsMixin(this);
    this.width = 384 / 4;
    this.height = 384 / 4;
    this.layer = 10;
  }
  get position() {
    return this.space.position;
  }
  packUp() {
    this.pack = actorPackUp(this);
    return this.pack;
  }
  act(time, view) {
    if (this.master) {
      this.changeDirection(this.master.direction);
      this.updateImgXY();
      if (this.master.speed.length == 0) { this.stopMoving(); }
    } else {
      this.changeDirection(0);
      this.updateImgXY();
      this.stopMoving(); 
    }
    view.affectors.forEach(affector => {
      if (affector.space.overlap(this.space) && affector.from !== this && affector.from !== this.master) {
        affector.affect(this, time);
      }
    });
    this.move(time);
  }
}
moveMixin(FireBird.prototype);
changeDirectionMixin(FireBird.prototype);
sayMixin(FireBird.prototype);


module.exports = FireBird;
