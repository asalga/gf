'use strict';

let img;
let imgLoaded;
let imageMap;
let listed = false;
let p;

class ImageMap {
  constructor() {
    console.log('ctor');
    this.scale = 1;
    this.indices = [];
    this.img;
  }

  load(p5Img) {
    let px = p5Img.pixels;
    this.img = p5Img;

    for (let i = 0, len = px.length; i < len; i += 4) {
      let r = px[i + 0];
      let g = px[i + 1];
      let b = px[i + 2];
      let a = px[i + 3];

      if (a > 0) {
        this.indices.push(i / 4);
      }
    }
  }

  setScale(s) {
    this.scale = s;
  }

  getRandomPoint(p) {
    let ridx = floor(random(0, this.indices.length));

    // we have the index which needs to be converted into an xy pair
    let idx = this.indices[ridx];
    p.x = idx % this.img.width;
    p.y = floor(idx / this.img.width);
  }
}

window.preload = function() {
  img = loadImage('data/image/lemming.png', function(_img) {
    _img.loadPixels();

    imageMap = new ImageMap();
    imageMap.load(_img);
    imageMap.setScale(2);

    imgLoaded = true;
  });
}

window.setup = function() {
  // createCanvas(windowWidth, windowHeight);
  createCanvas(400, 400);
  background(0);

  p = createVector();
  stroke(255);
  noFill();
}

window.draw = function() {

  if (!imgLoaded) { return; }

  if (listed === false) {
    listed = true;
    console.log(imageMap.indices);
  }

  imageMap.getRandomPoint(p);
  point(p.x, p.y);

  // image(img, 0, 0);
}