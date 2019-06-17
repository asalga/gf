// How many seconds should we spend trying to fill up the space?
const MAX_SECONDS_PER_PIECE = 5;
const MAX_CIRCLES_PER_PIECE = 100;
const MAX_SIZE = 100;
let minSize = 100;
let maxSize;

let gfx

let colors = [];

// Should the circles be constrained within the parent circle bounds?
// Setting to false yields prettier renders
const stayInBounds = true;
let p;

let circles = [];
let nextCircleIdx = 0;

// How many circles to add to the array per frame
let circlesPreFrame = 1;

// Per frame we'll likely select a random point that's already inside another circle, How
// many failures should we allow before bailing and moving onto the next frame?
let maxAttempts = 1;

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

  maxSize = MAX_SIZE;

  nextCircleIdx = 0;
  for (let c of circles) { c.reset(); }

  parent.rad = maxViewport;

  gfx = createGraphics(parent.rad, parent.rad);

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
        rad = constrain(rad, minSize, MAX_SIZE);
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
  // frameRate(10);


  //windowWidth,windowHeight);

  colors.push(
    // color(255, 255, 255),
    // color(255, 0, 255),
    // color(255, 128, 0),
    // color(0, 0, 200),
    // color(255, 255, 0),
    // color(0, 255, 0)
    color(255, 0, 0),
    color(0, 255, 0),
    color(0, 0, 255)
  );

  p = createVector();
  parent = new Circle();

  for (let i = 0; i < MAX_CIRCLES_PER_PIECE; ++i) {
    circles.push(new Circle());
  }

  reset();
}

window.draw = function() {
  background(0);

  if (!canAddMore() || !hasMoreTime()) {
    reset();
    return;
  }

  for (let i = 0; i < circlesPreFrame; i++) {
    if (nextCircleIdx < MAX_CIRCLES_PER_PIECE) {
      createCircle();
    } else {
      // noLoop();
    }
  }

  translate(WW / 2, WH / 2);

  noStroke();

  for (let i = 0; i < nextCircleIdx; i++) {
    circles[i].drawGfx(gfx);
  }

  for (let i = 0; i < nextCircleIdx; i++) {
    circles[i].draw();
  }

  push();
  translate(WW / 2, WH / 2);
  // image(gfx, 0, 0);
  pop();
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
    this.col;
  }

  spawn() {
    this.alive = true;
  }

  reset() {
    this.col = colors[Math.floor(random(0, colors.length))];
    this.rad = 0;
    this.alive = false;
    this.hasBeenDrawn = false;
  }


  draw() {
    push();

    
    // a bit too blurry....
    push();
    scale(2, 2);
    translate(-gfx.width/2 + 20, -gfx.height/2 +20);
    image(gfx, 0, 0);//this.pos.x * sc, this.pos.y * sc);
    pop();




    let sc = 3;
    let t = 1 / sc;
    scale(t);
    image(gfx, this.pos.x * sc, this.pos.y * sc);

    // translate(this.rad * 1.25, this.rad * 1.25);
    // ellipse(this.pos.x * sc, this.pos.y * sc, sc * 100);
    pop();
  }

  drawGfx(gfx) {
    if (!this.alive) return;

    if (this.hasBeenDrawn) return;
    this.hasBeenDrawn = true;

    gfx.noFill();
    gfx.strokeWeight(2);
    gfx.stroke(this.col);

    gfx.push();
    let r = this.rad / 2;

    gfx.translate(gfx.width / 2, gfx.height / 2);
    gfx.ellipse(this.pos.x / 2, this.pos.y / 2, r);
    // gfx.ellipse(this.pos.x - gfx.width/4, this.pos.y - gfx.height/4, r);
    gfx.pop();
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