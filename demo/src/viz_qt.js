'use strict';
// We'll need to handle the case if the new circle radius makes it intersect more than one quadrant

// import Pool from './core/Pool.js';
import Circle from './collision/Circle.js';
import Rectangle from './collision/Rectangle.js';
import Point from './collision/Point.js';
import Utils from './Utils.js';
import QuadTree from './collision/QuadTree.js';

let test = 0;
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

let distanceToCircle;
let id = 0;
let r, c, qt;
let minSize = 1;
let maxSize = 2;
let maxAttemptsPerFrame = 120;
let padding = 0;
let circlesPerFrame = 100;
let circleCount = 0;
let depth = 1;

let circleDraw = function() {
  stroke(0);
  fill(255);
  ellipse(this.x, this.y, this.r * 2);
};

let circleUpdate = function(dt) {}

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
  // let [CW, CH] = [250 * 3, 250 * 3];
  let [CW, CH] = [250 * 2, 250 * 2];
  createCanvas(CW, CH);

  qt = new QuadTree({ w: CW, h: CH, depth: depth });
};

function findClosestCircleToPoint(circles, candiCircle) {
  
  distanceToCircle = maxSize;
  let idx = -1;

  for (let i = 0; i < circles.length; i++) {
    test++
    let d = getPointCircleDistance(candiCircle, circles[i]);

    if (d < distanceToCircle) {
      distanceToCircle = d;
      idx = i;

      // no point in continuing the loop if it's an invalid point
      // if (d < 0) return idx;
    }
  }

  return idx;
}

function update(dt) {
  qt.update(dt);
}

window.draw = function() {
  update(0.016);
  background(0);

  let b = qt.bounds;

  let numAttempts = 0;
  let added = 0;

  for (let cc = 0; cc < 1; cc++) {

    // get random point inside bounds
    let rx = random(b.x, b.x + b.w);
    let ry = random(b.y, b.y + b.h);

    let candiCircle = new Circle({ x: rx, y: ry });
    candiCircle.id = id++;
    candiCircle.draw = circleDraw;
    candiCircle.update = circleUpdate;
    candiCircle.r = getRandomRadius();

    let node = qt.getLeafFromPoint(candiCircle);

    // let distanceToCircle = maxSize;
    let invalidSpot = true;
    let circleIdx;

    // Make sure we didn't pick a point inside another circle
    while (invalidSpot && numAttempts < maxAttemptsPerFrame) {
      numAttempts++;
      invalidSpot = false;

      circleIdx = findClosestCircleToPoint(node.entities, candiCircle);
// console.log(node.entities.length)
      // points is inside another circle
      if (distanceToCircle < 0) {
        invalidSpot = true;
      }
    }

    if (invalidSpot === false) {
      candiCircle.r = distanceToCircle;

      Utils.constrainCircleInRect(candiCircle, node, candiCircle.r);

      // We just resized the circle. Make sure it's still above the 
      // min size threshold.
      if (candiCircle.r >= minSize) {
        node.entities.push(candiCircle);
        circleCount++;
        added++;
      }
    }
  }

  qt.debugDraw();
  qt.draw();

  drawCircleCount();
};

function drawCircleCount() {
  fill(0);
  stroke(255, 0, 0);
  rect(18, 8, 90, 45);

  fill(255);
  noStroke();
  text(`count: ${circleCount}`, 20, 22);
  text(`time: ${floor(millis()/1000)}`, 20, 30);
  text(`QT depth: ${depth}`, 20, 40);
  text(`test: ${test}`, 20, 50);
}

function getPointCircleDistance(pnt, circle) {
  return dist(pnt.x, pnt.y, circle.x, circle.y) - circle.r - padding;
}

function pointInCircle(pos, c) {
  return dist(pos.x, pos.y, c.pos.x, c.pos.y) <= c.rad;
}

function getRandomRadius() {
  return random(minSize, maxSize);
}