'use strict';

let numSegments = 20;
let segmentLength;
let segmentSpacing;
let segmentResolution = 100;
let segments = [];
let heightScale = 10;

let speed = 2500;

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

    for (let i = 0; i < this.vertices.length; i += 2) {

      let x = (i / 2) * xSpacing;

      //   let porabolaInfluence = sin((i / this.vertices.length) * PI)  * porabolaInfluenceScale;

      //   let n = this.nLookup[i / 2];
      //   n *= -porabolaInfluence / 20;

      this.vertices[i + 0] = x;
      this.vertices[i + 1] = (this.pos.y * segmentSpacing);
    }

    // if (this.t > 50) {
    //   this.t = 0;
    //   shiftArrayElements(this.nLookup);

    //   let n = getNoise(this.nextNoise / 50, this.pos.y);
    //   this.nLookup[this.nLookup.length - 1] = n;
    //   this.nextNoise++;
    // }
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

window.preload = function() {
  loadImage('data/image/depth.jpg', function(_img) {
    img = _img;
    loaded = true;
    segmentSpacing = img.height / numSegments;
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

  // now = millis();
  // let dt = (now - lastTime) / 1000;
  // lastTime = now;

  // dt = 0.016;
  // update(dt);

  background(0);

  let gridHeight = numSegments * segmentSpacing;

  push();
  translate(windowWidth / 2 - img.width / 2, windowHeight / 2 - img.height / 2);

  image(img, 0, 0);

  segments.forEach(s => s.draw());

  pop();
}