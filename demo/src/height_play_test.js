'use strict';

let segments = [];
let numSegments = 60;
let segmentResolution = 1000;
let segmentLength;
let segmentSpacing;
let heightScale = 20;

let speed = 5.5;

let loaded = false;
let img;

let now, lastTime;

class Segment {
  constructor(cfg) {
    Object.assign(this, cfg);

    this.t = 0;
    this.nextNoise = 0;
    this.vertices = new Float32Array(segmentResolution * 2); // [x,y, x,y, ...]

    this.update(0);
  }

  update(dt) {
    this.t += dt * speed;

    let xSpacing = this.len / segmentResolution;

    this.pos.y += dt * speed;
    if (this.pos.y > img.height / segmentSpacing) {
      this.pos.y -= img.height / segmentSpacing;
    }

    for (let i = 0; i < this.vertices.length; i += 2) {

      let x = (i / 2) * xSpacing;
      let y = this.pos.y * segmentSpacing;

      if (dt === 0) {
        y -= 1500;
      }

      let col = img.get(x, y);
      let intensity = col[0] / 255;

      this.vertices[i + 0] = x;
      this.vertices[i + 1] = y - (intensity) * heightScale;
    }
  }

  draw() {
    strokeWeight(1);
    stroke(255 * sin(this.pos.y * segmentSpacing / img.height * PI));
    // fill(0);
    noFill();

    beginShape(LINE_STRIP);
    for (let i = 0; i < this.vertices.length; i += 2) {
      vertex(this.vertices[i + 0], this.vertices[i + 1]);
    }
    endShape();
  }
}

window.preload = function() {
  loadImage('data/image/skull.png', function(_img) {
    img = _img;
    img.loadPixels();
    loaded = true;
    segmentSpacing = (img.height / numSegments) + 0;
    segmentLength = img.width;

    for (let i = 0; i < numSegments; i++) {
      segments.push(new Segment({
        pos: { x: 0, y: i },
        len: segmentLength
      }));

    }
  });
};

window.setup = function() {
  createCanvas(windowWidth, windowHeight);
};

function update(dt) {
  segments.forEach(s => s.update(dt));
}

window.draw = function() {
  if (!loaded) return;

  now = millis();
  let dt = (now - lastTime) / 1000;
  lastTime = now;

  dt = 0.016;
  update(dt);

  background(0);

  let gridHeight = numSegments * segmentSpacing;

  push();
  translate(windowWidth / 2 - img.width / 2, windowHeight / 2 - img.height / 2);
  // image(img, 0, 0);
  segments.forEach(s => s.draw());
  pop();
}