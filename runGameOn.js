'use strict'

const assert = require('assert');
// runGameOn requires a reachable Mongodb and an unoccupied port.
async function runGameOn(dbName, port) {
  // connect to the database
  let database;
  try {
    database = await connectDb(dbName);
  } catch(err) {
    console.log(err);
    throw new Error(`Unable to connect to database ${dbName}`);
  }
  const dbCollections = ['players',];
  const db = Object.create(null);
  dbCollections.forEach(collection => {
    db[collection] = database.collection(collection);
  });
  // start the server
  const express = require('express');
  const app = express();
  const server = require('http').createServer(app);
  app.use(express.static('client'));
  server.listen(port, console.log(`Server listening on port ${port}`));
  // serve each connection
  const io = require('socket.io')(server);
  io.on("connection", socket => {
		serving(socket, db);
	});
  setInterval(frameCallbackCurried(60), 1000/60);
  //setInterval(checkCallback, r000);
}

function connectDb(dbName) {
  return new Promise((resolve, reject) => {
    const MongoClient = require('mongodb').MongoClient;
    const url = 'mongodb://localhost:27017';
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect(err => {
      if (err != null) { 
        reject(new Error("can't connect to 'mongodb://localhost:27017'"));
      }
      resolve(client.db(dbName));
      console.log("Connected successfully to server");
    });
  });
}

// game logic
const login = require('./login.js');
const scenesData = require('./scenesData'); 
const Scene = require('./Scene.js');
const Player = require('./Player.js');
const onlineScenes = [];
const socketToPlayer = new Map();

async function serving(socket, db) {
  console.log(`A user connected.`);
  const userData = await login(socket, db.players);
	const player = new Player(userData.playerData);
	socketToPlayer.set(socket, player);
  makeInScene(player);
  socket.on("disconnect", socket => {
    console.log("A user disconnected");
    onlineScenes.find(scene => scene.backgroundImg === player.sceneBackgroundImg).removePlayer(player);
    socketToPlayer.delete(socket);
  });
  socket.on("playerControl", controls => {
    socketToPlayer.get(socket).updateControl(controls);
  });
}


function frameCallbackCurried(numberOfFrame) {
  return function frameCallback() {
    for(let scene of onlineScenes) {
      const leftPlayers = scene.update(1.0 / numberOfFrame);
      leftPlayers.forEach(player => {
        scene.removePlayer(player);
        if (player.health < 0) { 
          const socket = getByValue(socketToPlayer, player);
          player = new Player();
          socketToPlayer.set(socket, player);
        };
        makeInScene(player);
      });
    }
    onlineScenes.forEach(scene => scene.packUp());
    for (let [socket, player] of socketToPlayer) {
      const scene = onlineScenes.find(scene => scene.backgroundImg == player.sceneBackgroundImg);
      socket.emit('syncFrame', {scenePack: scene.pack, playerPack: player.pack});
    }
  }
  function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
      if (value === searchValue)
        return key;
    }
  }
}

function makeInScene(player) {
  let scene = onlineScenes.find(scene => scene.backgroundImg == player.sceneBackgroundImg);
  if (scene == undefined) {
    const sceneData = scenesData.get(player.sceneBackgroundImg);
    assert(scenesData);
    scene = new Scene(sceneData);
    onlineScenes.push(scene);
  }
  scene.addPlayer(player);
}
  
  /*
function checkCallback() {
  const indexs = [];
  onlineScenes.forEach((scene, index) => {
    if (scene.playerCount == 0) {
      indexs.push(index);
    }
  });
  for (let i = indexs.length - 1; i >= 0; i--) {
    onlineScenes.splice(indexs[i], 1);
  }
}
*/


module.exports = runGameOn;
