// Andor Saga

let m = false;

// How many seconds should we spend trying to fill up the space?
const MAX_SECONDS_PER_PIECE = 10;
const MAX_CIRCLES_PER_PIECE = 2000;
const MAX_SIZE = 10;

// Should the circles be constrained within the parent circle bounds?
// Setting to false yields prettier renders
const stayInBounds = true;
let p;

let circles = [];
let nextCircleIdx = 0;

// How many circles to add to the array per frame
let circlesPreFrame = 10;

// Per frame we'll likely select a random point that's already inside another circle, How
// many failures should we allow before bailing and moving onto the next frame?
let maxAttempts = 1;
let minSize = 2;
let maxSize;
let padding = 1;

let WW, WH;
let maxViewport;
let parent;
let timerStart = 0;


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
  // if (stayInBounds) {
  //   let d = dist(parent.pos.x, parent.pos.y, p.x, p.y);
  //   if (rad + d > parent.rad - padding) {
  //     rad = parent.rad - d - padding;
  //   }
  // }

  if (rad < minSize) {
    return;
  }

  rad = constrain(rad, minSize, maxSize);

  let c = circles[nextCircleIdx];
  c.reset();
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

  parent = new Circle({ name: 'parent' });
  parent.spawn();
  parent.pos.x = windowWidth / 2; // - parent.rad / 2;
  parent.pos.y = windowHeight / 2; // - parent.rad / 2;

  parent.vel.x = random(-1, 1);
  parent.vel.y = random(-1, 1);
  parent.vel.normalize();
  parent.vel.mult(400);
  // debugger;

  for (let i = 0; i < MAX_CIRCLES_PER_PIECE; ++i) {
    circles.push(new Circle());
  }

  reset();
}

function reset() {
  background(0);

  [WW, WH] = [windowWidth, windowHeight];
  maxViewport = WW > WH ? WH : WW;
  maxViewport = (WH / 2) * 0.75;

  // maxSize = WH * 0.25;
  maxSize = MAX_SIZE;

  nextCircleIdx = 0;
  for (let c of circles) { c.reset(); }

  parent.rad = 40;

  timerStart = millis();
}


function update(dt) {
  parent.update(dt);

  parent.pos.x = mouseX;
  parent.pos.y = mouseY;
  // if (parent.pos.x + parent.rad > WW) {
  //   parent.vel.x *= -1;
  // } else if (parent.pos.x - parent.rad < 0) {
  //   parent.vel.x *= -1;
  // } else if (parent.pos.y + parent.rad > WH) {
  //   parent.vel.y *= -1;
  // } else if (parent.pos.y - parent.rad < 0) {
  //   parent.vel.y *= -1;
  // }

}

window.draw = function() {

  background(0);
  update(0.016);

  // if (!canAddMore() || !hasMoreTime()) {
  // reset();
  //   return;
  // }

  if (m) {
    for (let i = 0; i < circlesPreFrame; i++) {
      if (nextCircleIdx < MAX_CIRCLES_PER_PIECE) {
        createCircle();
      }
    }
  }

  stroke(255, 0, 0);
  noFill();
  parent.draw();

  noStroke();
  fill(255);
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

// function mousePressed() {
//   m = true;
// }


window.mouseReleased = function() {
  m = false;
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
  m = true;
  // reset();
}


////////////////////////////////////

class Circle {
  constructor(cfg) {
    
    this.id = getNextId();
    this.pos = createVector();
    this.vel = createVector();
    this.name = (cfg && cfg.name) ? cfg.name : '';

    this.reset();
  }

  spawn() {
    this.alive = true;
  }

  update(dt) {
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
  }

  reset() {
    this.timeStart = millis();
    this.rad = 0;
    this.alive = false;
    this.hasBeenDrawn = false;
  }

  draw() {
    if (!this.alive) return;

    // if (this.hasBeenDrawn) return;
    this.hasBeenDrawn = true;

    // intentionally only use half the rad for sexy spacing
    let r = 1;
    let diff = millis() - this.timeStart;
    fill((diff / 2) % 255);

    if (this.name === 'parent') {
      noFill();
      stroke(255, 0, 0);
    }
    ellipse(this.pos.x, this.pos.y, this.rad * 2);
  }
}



function getRandomPointInCircle(p, c) {

  let v = createVector(random(-1, 1), random(-1, 1));

  v.normalize();

  v.mult(random(0, c.rad / 2));
  // v.mult(0.5);

  v.x += c.pos.x; // + c.rad/4;
  v.y += c.pos.y; // - c.rad/4;

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