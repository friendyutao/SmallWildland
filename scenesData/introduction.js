'use strict'

const { Vector, Polygon, Rect, Ellipse } = require('../geometry.js');
const { BaseObstacle, Cabin, DeciduousTree, } = require('../Obstacles');
const { Transport, TransportLotus, EnergeField, HealthField, } = require('../Fields');
const { GirlMorning, FireBird} = require('../Npcs');

const river = BaseObstacle.fromArrays([
  [230, -100],
  [230, 60],
  [248, 60],
  [248, 150],
  [213, 150],
  [213, 268],
  [238, 268],
  [238, 300],
  [80, 285],
  [63, 270],
  [-100, 268],

  [-100, 236],
  [75, 233],
  [125, 125],
  [206, 120],
  [208, -100],
]);

const lake = BaseObstacle.fromArrays([
  [415, 390],
  [477, 390],
  [500, 425],
  [500, 460],
  [480, 484],
  [444, 484],
  [444, 455],
  [415, 430],
]);

const girlMorning = new GirlMorning('scenes/introduction.png', 230, 180, getAct());

const introduction = {
  backgroundImg: 'scenes/introduction.png',
  width: 640,
  height: 640,
  asides: '',

  obstacles: [
    river, 
    lake,
    new Cabin(400, 100), 
    new DeciduousTree(270, 280),
    new DeciduousTree(320, 270),
  ],
  actors: [girlMorning, ],
  affectors: [
    new Transport(new Vector(430, 120), {sceneBackgroundImg: 'scenes/introduction_inCabin.png', position: new Vector(152, 200)}),
    new TransportLotus(new Vector(50, 50), {sceneBackgroundImg: 'scenes/foo.png'}),
    new HealthField(new Vector(640 - 50, 100)),
    new EnergeField(new Vector(640 - 50, 200)),
  ],
  items: [],
};

function getAct() {
  let target;
  let reactTo;
  let toTarget;
  return function act(time, view) {
    if (view.actors.length == 1) {
      this.space.position = this.initialPosition;
      turn.call(this, Math.PI);
      target = undefined;
      reactTo = reactTo0;
    } else {
      if (! target) {
        for (let actor of view.actors) {
          if (actor === this) { continue; }
          const toActor = this.position.scale(-1).plus(actor.position);
          if (target == undefined || toActor.length < toTarget.length) {
            target = actor;
          }
        }
      }
      toTarget = this.position.scale(-1).plus(target.position);
      turn.call(this, toTarget.toAngle());
      return reactTo.call(this, time);
    }
  }
  function turn(angle) {
    this.changeDirection(angle);
    this.updateImgXY();
    this.stopMoving();
    this.updateImgXY();
  }
  function reactTo0(time) {
    (! this.saying) && this.say('春眠不觉晓\n');
    if (target.saying.trim() == '啼鸟') {
      reactTo = reactTo1;
    }
    if (target.space.overlap(new Ellipse(this.position, 20))) {
      this.say('一边去\n');
      target.moveBack(time);
    }
  }
  function reactTo1(time) {
    (! this.saying) && this.say(
      '你好，我叫昭尘, 我爷爷起的，\n' +
      '他让我在这接待一位贵人，想必就是你了。\n' +
      '我可以帮你改名字，你愿意吗?\n' +
      '>a.愿意  >b.我喜欢现在的名字'
    );
    switch(target.saying) {
      case '>a': 
        reactTo = reactTo1a;
        target.say(target.saying + '.');
        break;
      case '>b': 
        reactTo = reactTo2;
        target.say(target.saying + '.');
        break;
      default:
        break;
    }
  }
  function reactTo1a(time) {
    (! this.saying) && this.say('告诉我你想起的名字，别太长，什么都行, 慎重哦');
    if (target.saying && target.saying[0] != '>') { 
      target.name = target.saying.slice(0, 10);
      target.say(target.saying + '.');
      reactTo = reactTo2;
    }
  }
  function reactTo2(time) {
    (! this.saying) && this.say(target.name + ',' +
      '我会给你一只鸟作为坐骑,你就能渡河了。\n' + 
      '>a.晓得了 >b.做我的女仆吧 >c.大哥罩我'
    );
    switch (target.saying) {
      case '>a':
        target.say(target.saying + '.');
        target.ride && (target.ride.health = 0);
        target.ride = new FireBird(target.sceneBackgroundImg, target.position);
        target.ride.master = target;
        this.say(
          '此去再无回头，望君珍重。\n' +
          '若是有缘，我们会在云岛相遇。\n' 
          , 4000);
        reactTo = reactTo0;
        return [{type: 'createActor', actors: [target.ride, ]}, ];
        break;
      case '>b':
        target.say(target.saying + '.');
        this.say('想的美！');
        break;
      default:
        break;
    }
  }

}

module.exports = introduction;
