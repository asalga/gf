/*
  Andor Saga
  Circle packed pac man
  
  0 - start file
  1 - circle pack circle
  2 - refactor
  3 - define theta
  4 - write prototype to constrain

  - remove intersecting circles
  - animate
  - add food
  - add walls
  - add trails?
*/

let id = 0;
let circles = [];

let WW, WH;
let bounds;
let maxAttempts = 10;
let maxCircles = 300;

let minSize = 2;
let maxSize = 20;

let padding = 2;
let parentSize;
let ar = 16 / 9;
let maxViewport;
let parent;
let theta = 1;

function getRandomPoint(p) {
  p.x = random(bounds.x, bounds.w);
  p.y = random(bounds.y, bounds.h);
}

function reset() {
  background(0);

  maxViewport = WH / 2 * 0.8;
  parentSize = maxViewport;
  parent = new Circle({ pos: { x: 0, y: 0 }, rad: parentSize });

  circles.length = 0;
  bounds = {
    x: 0,
    y: 0,
    w: 150,
    h: 150
  };
}

function createCircle() {
  let p = createVector();

  let shortestDistance = Infinity;
  let rad = minSize;
  let invalidSpot = true;
  let attempts = 0;

  // Make sure we didn't pick a point inside another circle
  while (invalidSpot && attempts < maxAttempts) {
    getRandomPointInCircle(parent, p);

    attempts++;
    invalidSpot = false;

    for (let i = 0; i < circles.length; i++) {
      if (pointInCircle(p, circles[i])) {
        invalidSpot = true;
      }
    }
  }

  // Use this to prevent really long loops
  if (invalidSpot) {
    return;
  }

  // If it's the first one
  if (circles.length === 0) {
    rad = minSize;
  } else {
    // find closest circle
    circles.forEach(c => {
      let d = distToCircle(c, p);
      if (d < shortestDistance) {
        shortestDistance = d;
        rad = d;
      }
    });
  }

  if (rad < minSize) return;
  rad = rad > maxSize ? maxSize : rad;

  let c = new Circle({ pos: p, rad: rad });
  circles.push(c);
}

window.setup = function() {
  createCanvas(windowWidth, windowHeight);
  smooth();
  background(0);

  WW = windowWidth;
  WH = windowHeight;
  maxViewport = WW > WH ? WH : WW;

  reset();
}

window.draw = function() {
  background(0);

  for (let i = 0; i < 10; i++) {
    if (circles.length < maxCircles) {
      createCircle();
    }
  }

  push();
  translate(WW / 2, WH / 2);

  noFill();
  stroke(255);
  circles.forEach(c => c.draw());

  pop();

  if (parent.rad > maxViewport) {
    parent.rad = maxViewport;
  }
}

function canAddMore() {
  return circles.length < maxCircles;
}

function mousePressed() {
  reset();
}

class Circle {
  constructor(cfg) {
    this.id = id;
    id++;
    this.pos = cfg.pos;
    this.rad = cfg.rad;
    this.col = 1;
    this.dist = dist(0, 0, this.pos.x, this.pos.y);
    this.startTime = millis() * 1000;
  }

  update(dt) {
    this.col -= dt;
    this.col = this.col < 0 ? 0 : this.col;
  }

  draw() {
    fill(255);
    let r = this.rad * 2;
    ellipse(this.pos.x, this.pos.y, r, r);
  }
}

function getRandomPointInCircle(c, p) {
  let v = createVector(random(-1, 1), random(-1, 1) * noise(p.x));
  v.normalize();
  v.mult(random(0, c.rad));
  p.x = v.x;
  p.y = v.y;
}

function distToCircle(c, pos) {
  return dist(c.pos.x, c.pos.y, pos.x, pos.y) - c.rad - padding;
}

function pointInCircle(pos, c) {
  return dist(pos.x, pos.y, c.pos.x, c.pos.y) <= c.rad;
}