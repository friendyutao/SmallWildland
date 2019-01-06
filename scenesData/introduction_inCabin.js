'use strict'

const { Vector, Rect, } = require('../geometry.js');
const { BaseObstacle, } = require('../Obstacles');
const { Transport, } = require('../Fields');
const { PinkScratch, BlueShockwave, Pistol, } = require('../Weapons');
const { SpeedPotion, } = require('../Potions');

const introduction_inCabin = {
  backgroundImg: 'scenes/introduction_inCabin.png',
  width: 272,
  height: 240,
  asides: '',

  obstacles: [
    new BaseObstacle(new Rect(new Vector(272/2, 80/2), 272/2, 80/2)),
    new BaseObstacle(new Rect(new Vector(58, 100), 48, 50)),
    new BaseObstacle(new Rect(new Vector(155, 95), 25, 15)),
  ],
  actors: [],
  affectors: [
    new Transport(new Vector(152, 215), {sceneBackgroundImg: 'scenes/introduction.png', position: new Vector(460, 150)}),
  ],
  items: [
    new BlueShockwave(new Vector(240, 90)),
    new BlueShockwave(new Vector(240, 120)),
    new Pistol(new Vector(240, 140)),
    new Pistol(new Vector(240, 180)),
    new PinkScratch(new Vector(240, 200)),
    new PinkScratch(new Vector(220, 200)),

    new SpeedPotion(new Vector(30, 170)),
    new SpeedPotion(new Vector(30, 200)),
  ],
};

module.exports = introduction_inCabin;
