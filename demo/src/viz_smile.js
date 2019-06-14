const MAX_SECONDS = 10;
const MAX_SIZE = 400;

const stayInBounds = false;

let circles = [];
let WW, WH;

let circlesPreFrame = 50;
let maxAttempts = 1;
let maxCircles = 700;

let minSize = 1;

let maxSize = MAX_SIZE;
let padding = 0;
let reduce = 0.98;

let parentSize;
let maxViewport;
let parent;
let gfx;
let images = [];
let playing = true;
let timerStart = 0;

function reset() {
  smooth();
  background(0);
  circles.length = 0;
  maxViewport = (WH / 2) * 0.75;
  parentSize = maxViewport;
  parent = new Circle({ pos: { x: 0, y: 0 }, rad: parentSize });
  loop();
  playing = true;
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
    console.log(rad);
    return;
  }


  maxSize *= reduce;
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


function drawWhiteBorders() {
  noStroke();
  fill(255);
  let wh = WH * 0.05 * sin(millis() / 5000);

  rect(0, 0, WW, wh);
  rect(0, WH - wh, WW, wh);


}

window.draw = function() {
  if(!playing) return;

  if (!canAddMore() || (millis()- timerStart)/1000 > MAX_SECONDS) {
    // save();
    playing = false;
    setTimeout(() => {
      reset();
    }, 1000);

    return;
  }

  for (let i = 0; i < circlesPreFrame; i++) {
    if (circles.length < maxCircles) {
      createCircle();
    }
  }

fill(255);
  stroke(255);
  // background(0);
  // text( (millis()) /1000, 40, 40) ;
  

  translate(WW / 2, WH / 2);

  // draw circle bounds
  // stroke(255);
  // noFill();
  // ellipse(0, 0, parentSize * 2, parentSize * 2);
  
  fill(255);
  noStroke();
  circles.forEach(c => c.draw());
}

function canAddMore() {
  return circles.length < maxCircles;
}

window.mousePressed = function() {
  reset();
}

class Circle {
  constructor(cfg) {
    this.pos = cfg.pos;
    this.rad = cfg.rad;
    this.dist = dist(0, 0, this.pos.x, this.pos.y);
  }

  draw() {
    fill(255);
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