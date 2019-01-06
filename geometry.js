'use strict'
/* instances of these primitive classes are all immutable */
const assert = require('assert');

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  get length() {
    return (this.x == 0 && this.y == 0) ? 
      0 :
      Math.hypot(this.x, this.y);
  }
  plus(other) {
    return new Vector(this.x + other.x, this.y + other.y);
  }
  scale (sx, sy = sx) {
    return new Vector(this.x * sx, this.y * sy); 
  }
  rotate(angle) {
    return angle ?
      new Vector(
      this.x * Math.cos(angle) - this.y * Math.sin(angle),
      this.x * Math.sin(angle) + this.y * Math.cos(angle)
      ) :
      new Vector(this.x, this.y);
  }
  toAngle() {
    return Math.atan2(this.y, this.x);
  }
  static fromAngle(angle) {
    return new Vector(Math.cos(angle), Math.sin(angle));
  }
}

const overlapMixin = (function() {
  return function(obj) {
    obj.overlap = overlap;
  }

  function overlap(other) {
    const polygon = other.toPolygon();
    for (let vertex of polygon.vertexes) {
      vertex = vertex.plus(polygon.position);
      if (this.containPoint(vertex)) {
        return true;
      }
    }
    if (other.containPoint(this.position)) {
      return true;
    }
    return false;
  }
})();

class Polygon {
  // Vector, [Vector] => Polygon		; The path made of [Vector] should not be crossed, nor can it be closed(which could reverse the output of containPoint function).
  constructor(position, vertexes, angle = 0) {
    this.position = position;
    this.vertexes = vertexes;
    this.angle = angle;
  }
  move(vector) {
    return new Polygon(this.position.plus(vector), this.vertexes.map(vertex => vertex.scale(1)), this.angle);
  }
  scale(sx, sy = sx) {
    return new Polygon(this.position.scale(1), this.vertexes.map(vertex => vertex.scale(sx, sy)), this.angle);
  }
  rotate(angle) {
    return angle ? 
      new Polygon(this.position.scale(1), this.vertexes.map(vertex => vertex.scale(1)), this.angle + angle) : 
      new Polygon(this.position.scale(1), this.vertexes.map(vertex => vertex.rotate(angle)), 0);
  }
  containPoint(vector) {
    vector = vector.plus(this.position.scale(-1)).rotate(- this.angle);
    let edgesCrossed = 0;	 // when move the vertex out to be above of the polygon.
    edgesCrossed += this.vertexes.reduce( (edgesCrossed, vertex1, i, vertexes) => {
      const next = (i == vertexes.length - 1) ? 0 : i + 1;
      const vertex2 = this.vertexes[next];
      return	( 
        (vertex1.x - vector.x) * (vertex2.x - vector.x) < 0 &&
        vertex1.y + (vector.x - vertex1.x) * ((vertex2.y - vertex1.y) / (vertex2.x - vertex1.x)) >= vector.y
      ) ?  edgesCrossed + 1 : edgesCrossed;
    }, 0);
    edgesCrossed += this.vertexes.reduce( (vertexesCrossed, vertex) => {
      return	(
        vertex.y >= vector.y &&
        vertex.x == vector.x
      ) ? vertexesCrossed + 1 : vertexesCrossed;
    }, 0);
    return Math.floor(edgesCrossed % 2) == 1 ? true : false;
  }
  toPolygon() {
    return this;
  }
}
overlapMixin(Polygon.prototype);

class Rect {
  // Vector, Number, Number => Rect
  constructor(position, halfWidth, halfHeight = halfWidth, angle = 0) {
    assert(halfWidth);
    this.position = position;  
    this.halfWidth = halfWidth;
    this.halfHeight = halfHeight;
    this.angle = angle;
  }
  move(vector) {
    return new Rect(this.position.plus(vector), this.halfWidth, this.halfHeight, this.angle);
  }
  scale(sx, sy = sx) {
    return new Rect(this.position.scale(1), this.halfWidth * sx, this.halfHeight * sy, this.angle);
  }
  containPoint(vector) {
    vector = vector.plus(this.position.scale(-1)).rotate(- this.angle);
    return	( 
        vector.x >= - this.halfWidth && 
        vector.x <= this.halfWidth &&
        vector.y >= - this.halfHeight && 
        vector.y <= this.halfHeight 
        ) ?  true : false;
  }
  rotate(angle = 0) {
    return new Rect(this.position.scale(1), this.halfWidth, this.halfHeight, this.angle + angle);
  }
  toPolygon() {
    return new Polygon(this.position.scale(1), [new Vector(this.halfWidth, this.halfHeight), new Vector(- this.halfWidth, this.halfHeight), new Vector(- this.halfWidth, - this.halfHeight), new Vector(this.halfWidth, - this.halfHeight),], this.angle);
  }
}
overlapMixin(Rect.prototype);

class Ellipse {
  // Vector, Number => Ellipse
  constructor(position, a, b = a, angle = 0) {
    assert(a);
    this.position = position;
    this.a = a;
    this.b = b;
    this.angle = angle;
  }
  move(vector) {
    return new Ellipse(this.position.plus(vector), this.a, this.b, this.angle);
  }	
  scale(sx, sy = sx) {
    return new Ellipse(this.position.scale(1), this.a * sx, this.b * sy, this.angle);
  }
  rotate(angle = 0) {
    return new Ellipse(this.position.scale(1), this.a, this.b, this.angle + angle);
  }
  containPoint(vector) {
    vector = vector.plus(this.position.scale(-1)).rotate(- this.angle);
    return Math.hypot(vector.x / this.a, vector.y / this.b) <= 1;
  }
  toPolygon() {
    const vertexes = [];
    for (let angle = 0.0; angle < 2 * Math.PI; angle += 0.2) {
      vertexes.push(new Vector(this.a * Math.cos(angle), this.b * Math.sin(angle)));
    }
    return new Polygon(this.position.scale(1), vertexes, this.angle);
  }
}
overlapMixin(Ellipse.prototype);

exports.Vector = Vector;
exports.Polygon = Polygon;
exports.Rect = Rect;
exports.Ellipse = Ellipse;
