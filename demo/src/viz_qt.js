'use strict';

// While setting the size of the circle, if the res
// If the result of setting the size of the circle makes it intersect with
// more than one quadrant, consider that invalid and try another point
// This may create visible seams between adjacent quadrants.
const REJECT_OVERLAP_QUADRANT = false;

// If a circle is created near the border of a quadrant and the size
// is set such that it then exists in more than one quadrant
const ALLOW_OVERLAP_QUADRANT = false;

// When calculating the size of the circle, constrain the value
// to be within the quadrant. This may create obvious seams between adjacent quadrants
// If this is true, ALLOW_OVERLAP_QUADRANT will be ignored since circles will never 
// end up overlapping adjacent quadrants.
const CONSTRAIN_INSIDE_QUADRANT = true;

// import Pool from './core/Pool.js';
import Circle from './collision/Circle.js';
import Rectangle from './collision/Rectangle.js';
import Point from './collision/Point.js';
import Utils from './Utils.js';
import QuadTree from './collision/QuadTree.js';

let r, c, qt, e1, e2;
let WW, WH;
let minSize = 40;
let maxSize = 40;

let circleDraw = function() {
  stroke(255, 0, 0);
  fill(0, 255, 0);
  ellipse(this.x, this.y, this.r * 2);
};

let circleUpdate = function(dt) {
  // debugger;
}

class Entity {
  constructor(cfg) {
    Object.assign(this, cfg);
    let s = 4;
    this.vel = createVector(random(-s, s), random(-s, s));
    this.intersecting = false;
    this.draw = function() {};
  }

  // draw() {
  //   strokeWeight(1);
  //   stroke(255, 0, 0);

  //   if (this.intersecting) {
  //     fill(0, 255, 0);
  //   } else {
  //     noFill();
  //   }

  //   ellipse(this.x, this.y, this.r * 2);
  // }

  update(dt) {
    this.x += this.vel.x * dt;
    this.y += this.vel.y * dt;

    if (this.x < 0) this.vel.x *= -1;
    if (this.y < 0) this.vel.y *= -1;

    if (this.x > width) this.vel.x *= -1;
    if (this.y > height) this.vel.y *= -1;
  }
}

window.preload = function() {
  console.log('preload');
};

window.setup = function() {
  createCanvas(400, 400);
  // WW = windowWidth;
  // WH = windowHeight;
  WW = width;
  WH = height;

  // r = new Rectangle({ x: 0, y: 0, w: 100, h: 150 });

  qt = new QuadTree({ w: WW, h: WH, depth: 4 });

  e1 = new Entity({ x: 100, y: 100, r: 50 });
  e2 = new Entity({ x: 100, y: 200, r: 50 });
  // qt.insert(e1);
  // qt.insert(e2);

  let b = new Rectangle();
  qt.getBounds(b);

  // get random point inside bounds
  // let pnt = new Point({
  let rx = random(b.x, b.x + b.w);
  let ry = random(b.y, b.y + b.h);

  let candiCircle = new Circle({ x: rx, y: ry });
  candiCircle.draw = circleDraw;
  candiCircle.update = circleUpdate;

  let node = qt.getLeafFromPoint(candiCircle);

  if (node.entities.length === 0) {
    candiCircle.r = getRandomRadius();
    constrainCircleInBounds(candiCircle, node);
    node.entities.push(candiCircle);
  }
  // Is the randomized point inside any circles?
  // if so, we'll need to try another random point.
  else {
    // // if (isPointIntersectingCircles(pnt, node.entities)) { invalid = true; }
    // let distanceToCircle;
    // circle = findClosestCircleToPoint(node.entities, pnt, distanceToCircle);

    // // points is inside another circle
    // if (distanceToCircle < 0) {
    //   invalid = true;
    //   numAttempts++;
    // }

    // c.radius = distanceToCircle - circle.radius - padding;
    // constrainCircleInQuadrant(c, node);
  }

  // We'll need to handle the case if the new circle radius makes it intersect more than one quadrant
};


/*
 */
function constrainCircleInBounds(c, b) {
  // right bounds
  if (c.x + c.r > b.x + b.w) c.r = (b.x + b.w - c.x);

  // left bounds
  if (c.x - c.r < b.x) c.r = c.x - b.x;

  // lower bounds
  if (c.y + c.r > b.y + b.h) c.r = (b.y + b.h - c.y);

  // upper bounds
  if (c.y - c.r < b.y) c.r = c.y - b.y;
}

function getRandomRadius() {
  return random(minSize, maxSize);
}

function update(dt) {
  qt.update(dt);
}

window.draw = function() {
  noLoop();
  update(0.016);

  background(100);

  qt.debugDraw();
  qt.draw();
};

// fill(100);
// stroke(255);
// rect(r.x, r.y, r.w, r.h);
// if (Utils.isCircleInsideRect(c, r)) {
// if (Utils.isPointInsideRect(c, r)) {
// if (Utils.isCircleIntersectingRect(c, r)) {
//   fill(255);
// } else {
//   fill(0);
// }
// ellipse(c.x, c.y, c.r * 2);