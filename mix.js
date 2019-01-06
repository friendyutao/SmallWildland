'use strict'

const assert = require('assert');
const { Vector, Polygon, Rect, Ellipse, } = require('./geometry.js');

const moveMixin = (function() {
  const moveMix = {
    move,
    moveBack,
  };
  return (obj => Object.assign(obj, moveMix));

  function move(time) {
    assert(time);
    this.space = this.space.move(this.speed.scale(time));
  }
  function moveBack(time) {
    this.speed = this.speed.scale(-1);
    this.move(time);
    this.speed = this.speed.scale(-1);
  }
})();

const changeDirectionMixin = (function(){
  const changeDirectionMix = {
    changeDirection,
    stopMoving,
  };
  return obj => Object.assign(obj, changeDirectionMix);

  function changeDirection(direction) {
    this.direction = direction;
    let moveSpeed = this.maxSpeed / 2 + this.maxSpeed / 2 * (this.energe / this.maxEnerge);
    isNaN(moveSpeed) && (moveSpeed = this.maXSpeed || 200);
    this.speed = new Vector(moveSpeed * Math.cos(this.direction), moveSpeed * Math.sin(this.direction));
  }
  function stopMoving() {
    this.speed = new Vector(0, 0);
  }
})();

const sayMixin = (function() {
  return (obj => (obj.say = say));

  function say(saying, timeOut = 2000) {
    this.saying = saying;
    setTimeout( () => {
      this.saying == saying && (this.saying = '');
    }, timeOut);
  }
})();

const actorImgAttrsMixin = (function() {
  return obj => {
    obj.layer = 0;
    obj.imgXY = { x: 0, y: 0 };
    obj.updateImgXY = updateImgXYFactory();
  };

  function updateImgXYFactory() {
    let cycle = 0;
    return function() {
      if (this.speed.length == 0) {
        this.imgXY.x = 0;
      } else {
        const vector = Vector.fromAngle(this.direction);
        this.imgXY.y = (Math.abs(vector.x) > Math.abs(vector.y)) ? (vector.x > 0 ? 2 : 1) : (vector.y > 0 ? 0 : 3);
        cycle++;
        if (cycle > 4) {
          this.imgXY.x = ++this.imgXY.x % 4;
          cycle = 0;
        }
      }
    }
  }
})();

function basicPackUp(obj) {
  return {
    img: obj.img,
    width: obj.width,
    height: obj.height,
    layer: obj.layer || 0,
    position: obj.space.position,
    standPoint: obj.standPoint || {x: obj.width/2, y: obj.height/2},        // space.position relative to image left top corner

    //    border: obj.space.toPolygon().vertexes,
  }
}

function actorPackUp(actor) {
  const pack = basicPackUp(actor);
  Object.assign(pack, {
    name: actor.name,
    imgXY: actor.imgXY,

    maxHealth: actor.maxHealth,
    health : actor.health,
    maxEnerge: actor.maxEnerge,
    energe: actor.energe,
    saying: actor.saying,
  });
  //  actor.eyesight && (pack.eyesightBorder = actor.eyesight.toPolygon().vertexes);
  return pack;
}


exports.moveMixin = moveMixin;
exports.changeDirectionMixin = changeDirectionMixin;
exports.sayMixin = sayMixin;
exports.actorImgAttrsMixin = actorImgAttrsMixin;

exports.basicPackUp = basicPackUp;
exports.actorPackUp = actorPackUp;
