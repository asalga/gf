// Andor Saga
// Circle packing study

// Things learned: 
//  - drawing an ellipse over and over again will remove the anti-aliasing

// How many seconds should we spend trying to fill up the space?
const MAX_SECONDS_PER_PIECE = 10;
const MAX_CIRCLES_PER_PIECE = 1000;
const MAX_SIZE = 300;

// Should the circles be constrained within the parent circle bounds?
// Setting to false yields prettier renders
const stayInBounds = false;
let p;

let circles = [];
let nextCircleIdx = 0;

// How many circles to add to the array per frame
let circlesPreFrame = 200;

// Per frame we'll likely select a random point that's already inside another circle, How
// many failures should we allow before bailing and moving onto the next frame?
let maxAttempts = 1;
let minSize = 1;
let maxSize;
let padding = 0;

let WW, WH;
let maxViewport;
let parent;
let timerStart = 0;

function reset() {
  background(0);

  [WW, WH] = [windowWidth, windowHeight];
  maxViewport = WW > WH ? WH : WW;
  maxViewport = (WH / 2) * 0.75;

  maxSize = WH * 0.25;

  nextCircleIdx = 0;
  for (let c of circles) { c.reset(); }

  parent.rad = maxViewport;

  timerStart = millis();
}

function createCircle() {
  let shortestDistance = Infinity;
  let rad = maxSize;
  let invalidSpot = true;
  let attempts = 0;

  // Make sure we didn't pick a point inside another circle
  while (invalidSpot && attempts < maxAttempts) {
    getRandomPointInCircle(p, parent);

    attempts++;
    invalidSpot = false;

    for (let i = 0; i < nextCircleIdx; i++) {
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
  if (nextCircleIdx === 0) {
    rad = maxSize;
  } else {

    // find closest circle
    for (let i = 0; i < nextCircleIdx; i++) {
      let c = circles[i];
      let d = distToCircle(c, p);
      if (d < shortestDistance) {
        shortestDistance = d;
        rad = d;
      }
    }
  }

  // Shrink the circle if necessary to keep it in bounds
  if (stayInBounds) {
    let d = dist(0, 0, p.x, p.y);
    if (rad + d > parent.rad - padding) {
      rad = parent.rad - d - padding;
    }
  }

  if (rad < minSize) {
    return;
  }

  maxSize = constrain(maxSize, minSize, MAX_SIZE);

  let c = circles[nextCircleIdx];
  c.spawn();
  c.pos.set(p);
  c.rad = rad;

  nextCircleIdx++;
}

window.setup = function() {
  createCanvas(windowWidth, windowHeight);
  smooth();
  background(0);

  p = createVector();
  parent = new Circle();

  for (let i = 0; i < MAX_CIRCLES_PER_PIECE; ++i) {
    circles.push(new Circle());
  }

  reset();
}

window.draw = function() {
  if (!canAddMore() || !hasMoreTime()) {
    reset();
    return;
  }

  for (let i = 0; i < circlesPreFrame; i++) {
    if (nextCircleIdx < MAX_CIRCLES_PER_PIECE) {
      createCircle();
    }
  }

  translate(WW / 2, WH / 2);

  noStroke();

  for (let i = 0; i < nextCircleIdx; i++) {
    circles[i].draw();
  }
}

function hasMoreTime() {
  return (millis() - timerStart) / 1000 < MAX_SECONDS_PER_PIECE;
}

function canAddMore() {
  return nextCircleIdx < MAX_CIRCLES_PER_PIECE;
}

window.keyTyped = function(key) {
  switch (key.code) {
    case 'Space':
      save();
      break;
    case 'KeyR':
      reset();
      break;
  }
}

window.mousePressed = function() {
  reset();
}




class Circle {
  constructor(cfg) {
    this.id = getNextId();
    this.pos = createVector();
    this.reset();
  }

  spawn() {
    this.alive = true;
  }

  reset() {
    this.rad = 0;
    this.alive = false;
    this.hasBeenDrawn = false;
  }

  draw() {
    if (!this.alive) return;

    if (this.hasBeenDrawn) return;
    this.hasBeenDrawn = true;

    // TODO: fix
    if (this.id === 5) {
      fill(200, 0, 0);
    } else {
      fill(255);
    }


    // intentionally only use half the rad for sexy spacing
    let r = 1;
    ellipse(this.pos.x, this.pos.y, this.rad * r, this.rad * r);
  }
}



function getRandomPointInCircle(p, c) {
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

let getNextId = (function() {
  let i = -1;
  return function() {
    return i++;
  }
})();