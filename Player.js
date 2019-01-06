'use strict'

const { Vector, Rect, } = require('./geometry.js');
const { moveMixin, changeDirectionMixin, sayMixin, actorImgAttrsMixin, actorPackUp, } = require('./mix.js');
const Weapons = require('./Weapons');

class Player {
  constructor(playerData = Player.getInitialData()) {
    Object.assign(this,  playerData);

    this.weapons = this.weapons.map(weaponName => new (Weapons[weaponName]));
    this.weapon = this.weapons[this.weaponSelection];
    this.controls = [];
    this.actions = [];
    this.saying = '';
    this.loginTime = new Date();
    actorImgAttrsMixin(this);
    this.width = 32;
    this.height = 48;
    this.standPoint = { x: 16, y: 43 };
  }
  get position() {
    return this.space.position;
  }
  get pack() {
    return this._pack;
  }
  updateControl(controls) {
    if (Array.isArray(controls)) {
      this.controls.push(...controls);
    }
  }
  act(time, view) {
    this.updateImgXY();
    this.actions = [];
    this.controls.forEach(control => {
      const act = control.type;
      if (typeof this[act] != 'function') return;
      let action;
      switch(act) {
        case 'changeDirection':
          action = this[act](Number(control.direction) || 0);
          break;
        case 'say':
          action = this[act](String(control.saying));
          break;
        case 'pick':
          action = this[act](view);
          break;
        default:
          action = this[act]();
          break;
      }
      action && this.actions.push(action);
    });
    this.controls.length = 0;

    view.affectors.forEach(affector => {
      if (affector.space.overlap(this.space) && affector.from !== this) {
        affector.affect(this, time);
      }
    });
    if (this.ride) {
      this.space.position = this.ride.position.plus(new Vector(0, 12));
    } else {
      this.move(time);
      if ([...view.obstacles, ...view.actors].some(obj => (obj.space.overlap(this.space) && obj !== this))) {
        [...view.obstacles].some(obj => (obj.space.overlap(this.space)));
        this.moveBack(time);
      }
    }
    return this.actions;
  }

  showAsides(asides, timeOut = 2000) {
    this.asides = asides;
    setTimeout( () => {
      this.asides == asides && (this.asides = '');
    }, timeOut);
  }

  pick(view) {
    const item = view.items.find(item => {
      return this.space.overlap(item.space);
    });
    if (! item) { 
      this.showAsides(
        'Nothin to poick up\n' +
        '没什么可捡的\n' 
      );
      return;
    }
    switch(item.type) {
      case 'weapon':  
        if (this.weapons.length >= this.maxWeapon) {
          this.showAsides(
                `You can mostly have only ${this.maxWeapon} weapons at the same time\n` +
                `（你最多可以同时拥有${this.maxWeapon}个武器）`
          );
        } else {
          this.weapons.push(item);
          if (this.weapons.length == 1) {
            this.weaponSelection = 0;
          }
          return { type: 'pick', items: [item] };
        }
        break;
      case 'potion': 
        const i = this.potions.findIndex(potion => potion.constructor.name == item.constructor.name);
        if (i != -1) {
          this.potions[i].count++;
        } else {
          item.count = 0;
          this.potions.push(item);
        }
        return { type: 'pick', items: [item] };
        break;
    }
  }

  usePotion() {
    if (this.potions[this.potionSelection]) {
      this.potions[this.potionSelection].affect(this);
      if (--this.potions[this.potionSelection].count < 1) {
        this.potions.splice(this.potionSelection, 1);
      }
    } else {
      this.showAsides(
        'You have no potion to use. （你没有药剂可用）\n' +
        'find a potion an press "p" to pick it up. （找到一个药剂并按“p”捡起来）\n'
      );
    }
  }
  changePotion() {
  }
  dropPotion() {
  }
  changeWeapon() {
    this.weaponSelection++;
    if (this.weaponSelection >= this.weapons.length) {
      this.weaponSelection = 0;
    }
  }

  dropWeapon() {
    if (! this.weapons[this.weaponSelection]) return;
    this.weapons[this.weaponSelection].space.position = this.space.position.plus(this.speed.scale(0.2));
    const dropped = this.weapons.splice(this.weaponSelection, 1);
    if (this.weaponSelection >= this.weapons.length) {
      this.weaponSelection = 0;
    }
    return { type: 'drop', items: dropped }
  }

  // these actions require the scene action agent
  fire() {
    if (this.weapons[this.weaponSelection]) {
      const affectors = this.weapons[this.weaponSelection].fire.call(this);
      if (affectors && affectors.length > 0) {
        return { type: 'fire', affectors: affectors };
      } else {
        this.showAsides(
          'No energe!\n' +
          '没能量了老哥\n'
        );
      }
    } else {
      this.showAsides(
        'You have no weapon to use. （你没有武器可用）\n' +
        'find a weapon an press "p" to pick it up. （找到一个武器并按“p”捡起来）\n'
      );
    }
  }
  dropWeapon() {
    if (! this.weapons[this.weaponSelection]) return;
    this.weapons[this.weaponSelection].space.position = this.space.position.plus(this.speed.scale(0.2));
    const dropped = this.weapons.splice(this.weaponSelection, 1);
    if (this.weaponSelection >= this.weapons.length) {
      this.weaponSelection = 0;
    }
    return { type: 'drop', items: dropped }
  }
  packUp() {
    this._pack = actorPackUp(this);
    this._pack.asides = this.asides;
    // this.ride && (this._pack.ride = actorPackUp(this.ride));
    return this._pack;
  }
}
moveMixin(Player.prototype);
changeDirectionMixin(Player.prototype);
sayMixin(Player.prototype);

Player.getInitialData = function() {
  const playerNum = Math.floor(Math.random() * 10);
  const initialX = Math.random() * 600 + 20;
  const initialY = Math.random() * (600 - 510) + 510;
  return {
    sceneBackgroundImg: 'scenes/introduction.png',
    name: '没有梦想的玩家',
    img: 'players/' + playerNum + '.png',
    space: new Rect(new Vector(initialX, initialY), 8, 4),

    maxHealth: 20,
    health: 10,
    maxEnerge: 20, 
    energe: 10, 
    maxSpeed: 150,
    direction: 0,
    speed: new Vector(0, 0), 

    maxWeapon: 2,
    weapons: [],
    //weapons: ['BlueShockwave'],
    weaponSelection: 0,
    potions: [],
    potionSelection: 0,

  }
}


module.exports = Player;
