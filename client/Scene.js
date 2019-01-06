'use strict'

const getImg = (function() {
  const imgCache = new Map();    
  return function getImg(imgSrc) {
    imgSrc = 'img/' + imgSrc;
    let img = imgCache.get(imgSrc);
    if (img) {
      return img;
    } else {
      img = new Image();
      img.onload = () => {
        imgCache.set(imgSrc, img);
      }
      img.src = imgSrc;
    }
  }
})();
class Scene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.viewport = {x: 0, y: 0, width: canvas.width, height: canvas.height,}
  }
  updateState(scenePack) {
    Object.assign(scene, scenePack);
  }
  draw() {
    scene.clearDisplay();
    scene.drawBackground();

    scene.actors.forEach(actor => actor.draw = this.drawActor.bind(this, actor));
    scene.affectors.forEach(affector => affector.draw = this.drawAffector.bind(this, affector));
    scene.obstacles.forEach(obstacle => obstacle.draw = this.drawObstacle.bind(this, obstacle));
    scene.items.forEach(item => item.draw = this.drawItem.bind(this, item));
    [...this.actors, ...this.affectors, ...this.obstacles, ...this.items,].sort((a,b) => (a.layer - b.layer || a.position.y - b.position.y)).forEach(x => x.draw());
    this.asides && this.drawAsides();

  }
  updateViewport({position, asides}) {
    this.asides = asides;
    this.viewport.x = position.x - this.viewport.width / 2;
    this.viewport.y = position.y - this.viewport.height / 2;
    const backgroundImg = getImg(this.backgroundImg);
    if (backgroundImg) {
      const bound = {
        minX : 0,
        minY : 0,
        maxX : backgroundImg.width - this.viewport.width,
        maxY : backgroundImg.height - this.viewport.height,
      }
      if (this.viewport.x < bound.minX) {this.viewport.x = bound.minX}
      if (this.viewport.x > bound.maxX) {this.viewport.x = bound.maxX}
      if (this.viewport.y < bound.minY) {this.viewport.y = bound.minY}
      if (this.viewport.y > bound.maxY) {this.viewport.y = bound.maxY}
    }
  }
  clearDisplay() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawBackground() {
    const background = getImg(this.backgroundImg);
    if (background) {
      scene.ctx.drawImage(background, this.viewport.x, this.viewport.y, this.canvas.width,  this.canvas.height, 0, 0,  this.canvas.width,  this.canvas.height);
    }
  }
  drawObstacle(obstaclePack) {
    obstaclePack.border && this.drawPolygon(obstaclePack.position, obstaclePack.border);
    obstaclePack.img && this.basicDraw(obstaclePack);
  }
  drawItem(itemPack) {
    this.basicDraw(itemPack);
  }
  drawAffector(affectorPack) {
    affectorPack.border && this.drawPolygon(affectorPack.position, affectorPack.border);
    let {img, position, width, height, direction, scale} = affectorPack;
    const image = getImg(img);
    if (image) { 
      this.ctx.save();
      this.ctx.translate(position.x - this.viewport.x, position.y - this.viewport.y,);
      scale && (this.ctx.scale(scale[0], scale[1]), width, height);
      direction && this.ctx.rotate(direction);
      this.ctx.drawImage(image, 0, 0, image.width, image.height, - width / 2,  - height / 2, width, height);
      this.ctx.restore();
    }
  }
  drawActor(actorPack) {
    const {name, img, imgXY, width, height, position, standPoint,  health, maxHealth, energe, maxEnerge, saying, } = actorPack;
    actorPack.border && this.drawPolygon(position, actorPack.border);
    actorPack.eyesightBorder && this.drawPolygon(position, actorPack.eyesightBorder);
    const image = getImg(img);
    if (image) { 
      let pos = { 
        x: position.x - this.viewport.x,
        y: position.y - this.viewport.y,
      }
      this.ctx.drawImage(
        image, 
        imgXY.x * image.width / 4, imgXY.y * image.height / 4, image.width / 4, image.height / 4,
        pos.x - standPoint.x, pos.y - standPoint.y, width, height,
      );
      this.ctx.save();
      let w, h, x;
      let y = pos.y - standPoint.y;
      if (health) {
        w = maxHealth * 1;
        h = 5;
        x = pos.x - w / 2;
        y = y - h;
        this.ctx.fillStyle = '#aaaaaa';
        this.ctx.fillRect(x, y, w, h);
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(x, y, w * health / maxHealth, h);
        this.ctx.restore();
      }
      if (energe) {
        this.ctx.save();
        w = maxEnerge * 1;
        h = 5;
        x = pos.x - w / 2;
        y = y - 2 - h;
        this.ctx.fillStyle = '#aaaaaa';
        this.ctx.fillRect(x, y, w, h);
        this.ctx.fillStyle = "blue";
        this.ctx.fillRect(x, y, w * energe / maxEnerge, h);
        this.ctx.restore();
      }
      this.ctx.textAlign = 'center';
      if (name) {
        this.ctx.font = '12px Times';
        this.ctx.fillStyle = '#222222';
        y = y - 4;
        this.ctx.fillText(name, pos.x, y);
      }
      if (saying) {
        this.ctx.font = '16px Garamond';
        this.ctx.fillStyle = '#cccccc';
        const lines = saying.split('\n');
        y = y - 20;
        for (let line of lines.reverse()) {
          this.ctx.fillText(line, pos.x, y);
          y = y - 16;
        }
      }
      //actorPack.ride && this.drawActor(actorPack.ride);
      this.ctx.restore();
    }
  }
  drawPolygon(position, vertexes) {
    this.ctx.save();
    this.ctx.strokeStyle = 'red';
    this.ctx.beginPath();
    vertexes = vertexes.map(vertex => ({ x: vertex.x + position.x - this.viewport.x, y: vertex.y + position.y - this.viewport.y }));
    this.ctx.moveTo(vertexes[0].x, vertexes[0].y); 
    for (let i = 1; i < vertexes.length; i++) {
      this.ctx.lineTo(vertexes[i].x, vertexes[i].y);
    }
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.restore();
  }
  basicDraw(pack) {
    const {img, position, width, height, } = pack;
    const standPoint = pack.standPoint || { x: width / 2, y: height / 2 };
    const image = getImg(img);
    if (image) { 
      this.ctx.drawImage(image, 0, 0, image.width, image.height, position.x - standPoint.x - this.viewport.x, position.y - standPoint.y - this.viewport.y, width, height);
    }
  }
  drawAsides() {
    this.ctx.save();
    this.ctx.textAlign = 'center';
    this.ctx.font = '18px Garamond';
    this.ctx.fillStyle = '#333333';
    const lines = this.asides.split('\n');
    let x = this.canvas.width / 2;
    let y = 0;
    for (let line of lines) {
      y = y + 20;
      this.ctx.fillText(line, x, y);
    }
    this.ctx.restore();
  }

};
