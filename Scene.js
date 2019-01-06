'use strict'
const assert = require('assert');

class Scene {
  constructor(sceneData) {
    Object.assign(this, sceneData);
  }
  get playerCount() {
    return this.actors.filter(actor => actor.constructor.name == 'Player').length;
  }
  get pack() {
    return this._pack;
  }
	addPlayer(player) {
		this.actors.push(player);
    player.ride && this.actors.push(player.ride);
  }
  removePlayer(player) {
    const index = this.actors.indexOf(player);
    if (index >= 0) {
      this.actors.splice(index, 1);
      if (player.ride) {
        const i = this.actors.indexOf(player.ride);
        (i != -1) && this.actors.splice(i, 1);
      }
    }
  }
  update(time) {
    const iToRemoves = [];
    const leftPlayers = [];
    this.affectors.forEach((affector, index) => {
      affector.act && affector.act(time);
      if (affector.timeOut !== undefined && affector.timeOut <= 0 || ! this.contain(affector.space.position)) {
        iToRemoves.push(index);
      }
    });
    for (let i = iToRemoves.length - 1; i >= 0; i--) {
      this.affectors.splice(iToRemoves[i], 1);
    }
    iToRemoves.length = 0;
    this.actors.forEach((actor, index) => {
      const actions = actor.act(time, this.giveView(actor));
      Array.isArray(actions) && actions.forEach(action => {
        if (typeof this[action.type] == 'function') {
          this[action.type](action);
        }
      });
      if (! this.contain(actor.space.position)) {
          actor.moveBack(time);
      }
      if (actor.health <= 0 || actor.sceneBackgroundImg !== this.backgroundImg) {
        actor.constructor.name == 'Player' ?
          leftPlayers.push(actor) :
          iToRemoves.push(index);
      }
    });
    for (let i = iToRemoves.length - 1; i >= 0; i--) {
      this.actors.splice(iToRemoves[i], 1);
    }
    iToRemoves.length = 0;

    this.act && this.act();
    return leftPlayers;
  }
  // give actor a viewport so it can better make action decision depend on it.
  giveView(actor) {
    const eyesight = actor.eyesight && actor.eyesight.move(actor.position) || actor.space;
    const view = Object.create(null);
    for (let key in this) {
      // kind of hack, the things related are all in arrays.
      if (Array.isArray(this[key])) {
        if (key == 'items') {
          let aaaa = 0;
        }
        view[key] = this[key].filter(obj => obj.space.overlap(eyesight));
      }
    }
    return view;
  }
  contain(position) {
    const range = -10;
    return  ( position.x > - range && 
      position.x < this.width + range &&
      position.y > - range && 
      position.y < this.height + range  
    ) ? true : false;
  }
  createActor(action) {
    this.actors.push(...action.actors);
  }
  pick(action) {
    action.items.forEach(item => {
      this.items.splice(this.items.indexOf(item), 1);
    });
  }
  fire(action) {
    this.affectors.push(...action.affectors);
  }
  drop(action) {
    this.items.push(...action.items);
  }
	packUp() {
	// we need additional this._pack because it will be accessed mutiple times and we should not calculate it everytime.
    const obstaclesPack = [];
    this.obstacles.forEach(obstacle => (obstacle.packUp && obstaclesPack.push(obstacle.packUp())));
    const affectorsPack = [];
    this.affectors.forEach(affector => (affector.packUp && affectorsPack.push(affector.packUp())));
    this._pack = {
      backgroundImg: this.backgroundImg,
      width: this.width,
      height: this.height,

      actors: this.actors.map(actor => actor.packUp()),
      items: this.items.map(item => item.packUp()),
      obstacles: obstaclesPack,
      affectors: affectorsPack,
    }
    return this._pack;
  }
}


module.exports = Scene;
