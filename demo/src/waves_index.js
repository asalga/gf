'use strict';

let numSegments = 20;
let segmentLength;
let segmentSpacing = 50;
let segmentResolution = 100;
let segments = [];
let heightScale = 10;
let porabolaInfluenceScale = 100;
let speed = 2500;

let now, lastTime;

class Segment {
  constructor(cfg) {
    Object.assign(this, cfg);

    this.t = 0;
    this.nextNoise = 0;
    this.vertices = new Float32Array(segmentResolution * 2); // [x,y, x,y, ...]
    this.nLookup = new Float32Array(segmentResolution); // [n, n, n,...]

    // Populate the noise lookup array
    for (let i = 0, len = this.nLookup.length; i < len; ++i) {
      this.nLookup[i] = getNoise(i / 50, this.pos.y);
    }
    this.nextNoise = this.nLookup.length;

    this.update(0);
  }

  update(dt) {
    this.t += dt * speed;

    let xSpacing = this.len / segmentResolution;
    for (let i = 0; i < this.vertices.length; i += 2) {

      let x = (i / 2) * xSpacing;

      let porabolaInfluence = sin((i / this.vertices.length) * PI)  * porabolaInfluenceScale;

      let n = this.nLookup[i / 2];
      n *= -porabolaInfluence / 20;

      this.vertices[i + 0] = x;
      this.vertices[i + 1] = (n + this.pos.y * segmentSpacing);
    }

    if (this.t > 50) {
      this.t = 0;
      shiftArrayElements(this.nLookup);

      let n = getNoise(this.nextNoise / 50, this.pos.y);
      this.nLookup[this.nLookup.length - 1] = n;
      this.nextNoise++;
    }
  }

  draw() {
    strokeWeight(2);
    stroke(255);
    fill(0);

    beginShape(LINE_STRIP);
    for (let i = 0; i < this.vertices.length; i += 2) {
      vertex(this.vertices[i + 0], this.vertices[i + 1]);
    }
    endShape();
  }
}


window.setup = function() {
  createCanvas(windowWidth, windowHeight);
  noiseDetail(0.001);

  segmentLength = floor(windowWidth * 1.0);
  now = lastTime = millis();

  for (let i = 0; i < numSegments; i++) {
    segments.push(new Segment({
      pos: { x: 0, y: i },
      len: segmentLength
      // len: sin ( (i/numSegments) * PI ) * 600
    }));
  }
};

function drawTime(dt) {
  fill(255);
  stroke(0);
  strokeWeight(1);
  text(dt, 20, 20);
}


function update(dt) {
  segments.forEach(s => s.update(dt));
}

window.draw = function() {
  now = millis();
  let dt = (now - lastTime) / 1000;
  lastTime = now;

  dt = 0.016;
  update(dt);

  background(0);

  let gridHeight = numSegments * segmentSpacing;

  push();
  translate(
    (windowWidth / 2) - (segmentLength / 2),
    (windowHeight / 2) -
    gridHeight / 2
  );

  segments.forEach(s => s.draw());
  pop();

  // drawTime(dt);
}

function shiftArrayElements(arr) {
  for (let i = 0; i <= arr.length - 1; i++) {
    arr[i] = arr[i + 1];
  }
}

function getNoise(i, y, xSpacing) {
  return noise(i, y * 10) * 60;
}