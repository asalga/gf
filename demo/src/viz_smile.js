// Andor Saga
// Circle packing study

// Things learned: 
//  - drawing an ellipse over and over again will remove the anti-aliasing

// How many seconds should we spend trying to fill up the space?
const MAX_SECONDS_PER_PIECE = 10;
const MAX_CIRCLES_PER_PIECE = 1000;
const MAX_SIZE = 300;

// Should the circles be constrained within the parent? Setting to false
// yields prettier renders
const stayInBounds = false;
let id = 0;

let circles = [];
let WW, WH;

// How many circles to add to the array per frame
let circlesPreFrame = 150;

// Per frame we'll likely select a random point that's already inside another circle, How
// many failures should we allow before bailing and moving onto the next frame?
let maxAttempts = 1;
let minSize = 1;
let maxSize;
let padding = 0;

let maxViewport;
let parent;
let parentSize;

let timerStart = 0;

function reset() {
  background(0);
  id = 0;
  circles.length = 0;
  maxViewport = (WH / 2) * 0.75;
  parentSize = maxViewport;
  maxSize = WH * 0.25;
  parent = new Circle({ pos: { x: 0, y: 0 }, rad: parentSize });
  timerStart = millis();
}

function createCircle() {
  let p = createVector();

  let shortestDistance = Infinity;
  let rad = maxSize;
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
    rad = maxSize;
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

  // Shrink the circle if necessary to keep it in bounds
  if (stayInBounds) {
    let d = dist(0, 0, p.x, p.y);
    if (rad + d > parentSize - padding) {
      rad = parentSize - d - padding;
    }
  }

  if (rad < minSize) {
    return;
  }

  // maxSize *= reduce;
  maxSize = constrain(maxSize, minSize, MAX_SIZE);

  let c = new Circle({ pos: p, rad: rad });
  circles.push(c);
}

window.setup = function() {
  createCanvas(windowWidth, windowHeight);
  smooth();
  background(0);

  [WW, WH] = [windowWidth, windowHeight];
  maxViewport = WW > WH ? WH : WW;

  reset();
}

window.draw = function() {
  // background(0);

  if (!canAddMore() || !hasMoreTime()) {
    reset();
    return;
  }

  for (let i = 0; i < circlesPreFrame; i++) {
    if (circles.length < MAX_CIRCLES_PER_PIECE) {
      createCircle();
    }
  }

  translate(WW / 2, WH / 2);

  noStroke();
  circles.forEach(c => c.draw());
}

function hasMoreTime() {
  return (millis() - timerStart) / 1000 < MAX_SECONDS_PER_PIECE;
}

function canAddMore() {
  return circles.length < MAX_CIRCLES_PER_PIECE;
}

function keyTyped(key) {
  switch (key.code) {
    case 'Space':
      save();
      break;
    case 'KeyR':
      reset();
      break;
  }
}

function mousePressed() {
  reset();
}


class Circle {
  constructor(cfg) {
    Object.assign(this, cfg);

    this.pos = createVector(cfg.pos.x, cfg.pos.y);
    this.dist = this.pos.mag();

    this.id = id++;
    this.hasBeenDrawn = false;
  }

  draw() {
    if (this.hasBeenDrawn) return;
    this.hasBeenDrawn = true;

    // TODO: fix
    if (this.id === 3) {
      fill(200, 0, 0);
    } else {
      fill(255);
    }

    // intentionally only use half the rad for sexy spacing
    let r = 1;
    ellipse(this.pos.x, this.pos.y, this.rad * r, this.rad * r);
  }
}

function getRandomPointInCircle(c, p) {
  let v = createVector(random(-1, 1), random(-1, 1));
  v.normalize();
  v.mult(random(0, c.rad));
  [p.x, p.y] = [v.x, v.y];
}

function distToCircle(c, pos) {
  return dist(c.pos.x, c.pos.y, pos.x, pos.y) - c.rad - padding;
}

function pointInCircle(pos, c) {
  return dist(pos.x, pos.y, c.pos.x, c.pos.y) <= c.rad;
}