/*
  Andor Saga
  Circle packed pac man
  - remove intersecting circles
  - animate
  - add food
  - add walls
  - add trails?
*/


const MAX_CIRCLES = 5000;
let circles = new Array(MAX_CIRCLES);
let ccount = 0;

let WW, WH;
let bounds;
let maxAttempts = 20;
let circlesPreFrame = 5000;

let minSize = 1;
let maxSize = 2;

let padding = 3;
let parentSize;
let maxViewport;
let parent;
let mouthTheta = 0;
let RAD_TO_DEG = (180 / Math.PI);

window.setup = function() {
  createCanvas(windowWidth, windowHeight);
  smooth();

  [WW, WH] = [windowWidth, windowHeight];
  maxViewport = WW > WH ? WH : WW;

  for (let i = 0; i < MAX_CIRCLES; ++i) {
    circles[i] = new Circle();
  }
  reset();
}

function reset() {
  maxViewport = WH / 2 * 0.25;
  parentSize = 100;

  ccount = 0;
  parent = new Circle();
  parent.pos = createVector();
  parent.rad = parentSize;

  for (let c of circles) { c.reset(); }
}

/*
 */
function isCircleInsidePacman(circle, parentCircle, theta) {
  // get theta of circle position
  let p = createVector(circle.x, circle.y);

  let circleTheta = Math.atan2(p.y, p.x);
  circleTheta *= RAD_TO_DEG;

  if (circleTheta < 0) {
    circleTheta += 360;
  }

  if (circleTheta > (330 + mouthTheta) || circleTheta < 30 - mouthTheta) {
  // if (circleTheta > mouthTheta) {
    return false;
  }

  return true;
}

/*
 */
function requestCreateCircle() {
  let p = createVector();

  let freeIndex = findFreeIndex();
  if (freeIndex === -1) return;

  let shortestDistance = Infinity;
  let rad = minSize;
  let invalidSpot = true;
  let attempts = 0;

  // Make sure we didn't pick a point inside another circle
  while (invalidSpot && attempts < maxAttempts) {
    getRandomPointInCircle(parent, p);
    attempts++;
    invalidSpot = false;

    for (let i = 0; i < maxAttempts; i++) {
      if (isCircleInsidePacman(p, parent, mouthTheta) === false) {
        invalidSpot = true;
      } else if (pointInCircle(p, circles[i])) {
        invalidSpot = true;
      }
    }
  }

  // Use this to prevent really long loops
  if (invalidSpot) {
    return;
  }

  // If it's the first one
  if (ccount === 0) {
    rad = minSize;
  } else {
    // find closest circle
    for (let i = 0; i < circles.length; i++) {
      let c = circles[i];
      if (c.alive == false) continue;

      let d = distToCircle(c, p);
      if (d < shortestDistance) {
        shortestDistance = d;
        rad = d;
      }
    }
  }
  if (rad < minSize) {
    return;
  }

  rad = constrain(rad, minSize, maxSize);

  let c = circles[freeIndex];
  c.reset();
  c.spawn();
  c.pos.set(p);
  c.rad = rad;
  freeIndex++;
  ccount++;
}

function findFreeIndex() {
  for (let i = 0; i < circles.length; i++) {
    if (circles[i].alive === false) return i;
  }
  return -1;
}

function update() {
  mouthTheta = ((sin(millis() / 1000) + 1) / 2) * 30;
  // console.log(floor(mouthTheta));

  circles.forEach(c => {
    // if (c.alive === false) return;
    // c.reset();
    if (isCircleInsidePacman(c.pos, parent, 80) === false) {
      c.reset();
      
      // background(0);
    }
  });
}

window.draw = function() {
  update();

  background(0);

  for (let i = 0; i < 1; i++) {
    // if (nextCircleIdx < MAX_CIRCLES_PER_PIECE) {
    requestCreateCircle();
    // }
  }

  push();
  translate(WW / 2, WH / 2);
  stroke(255);
  noFill();
  line(-1000, 0, 1000, 0);
  line(0, -10000, 0, 10000);
  ellipse(0, 0, parentSize * 2);

  noFill();
  stroke(255);
  circles.forEach(c => {
    if (c.alive) {
      c.draw()
    }
  });
  pop();

  if (parent.rad > maxViewport) {
    parent.rad = maxViewport;
  }
}

class Circle {
  constructor(cfg) {
    this.pos = createVector();
    this.reset();
  }

  spawn() {
    this.alive = true;
  }

  reset() {
    this.rad = 0;
    this.col = 200;
    this.alive = false;
  }

  draw() {
    // if (!this.alive) return;

    fill(this.col);
    let r = this.rad * 2;
    ellipse(this.pos.x, this.pos.y, r, r);
  }
}

window.mousePressed = function() {
  // reset();
}

function getRandomPointInCircle(c, p) {
  let v = createVector(random(-1, 1), random(-1, 1));
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

let getNextId = (function() {
  let i = 0;
  return function() {
    return i++;
  }
})();