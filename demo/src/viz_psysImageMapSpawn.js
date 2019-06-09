'use strict';

let img;
let imgLoaded;
let imageMap;
let listed = false;
let p;
let WW, WH;
let particlesPerFrame = 15;
let imgScale = 6;
let particles;

class Particles {
  constructor(cfg) {
    this.timer = 0;

    this.count = cfg.count;
    this._p = createVector();

    this.alive = new Uint8Array(this.count);
    this.age = new Float32Array(this.count);
    this.lifetime = new Float32Array(this.count);

    this.pos = new Float32Array(this.count * 2);
    this.vel = new Float32Array(this.count * 2);
    this.acc = new Float32Array(this.count * 2);

    this.col = new Float32Array(this.count * 4);

    this.reset();
  }

  // is this necessary?
  reset() {
    for (let i = 0; i < this.count; i++) {
      this.alive[i] = 0;
    }
  }

  /*
  	returns index of -1 if no free slots available
  */
  findDeadParticle() {
    for (let i = 0; i < this.count; i++) {
      if (this.particleIsAlive(i) === false) {
        return i;
      }
    }
    return -1;
  }

  spawnParticle() {
    let idx = this.findDeadParticle();

    // debugger;
    if (idx > -1) {
      this._p = createVector();
      let c = [0, 0, 0, 0];
      imageMap.getRandomPoint(this._p, c);

      this.col[idx * 4 + 0] = c[0];
      this.col[idx * 4 + 1] = c[1];
      this.col[idx * 4 + 2] = c[2];
      this.col[idx * 4 + 3] = c[3];


      this.pos[idx * 2 + 0] = this._p.x;
      this.pos[idx * 2 + 1] = this._p.y;

      this.age[idx] = 0;
      this.alive[idx] = 1;
      this.lifetime[idx] = random(0.1, 0.2);

      this.vel[idx * 2 + 0] = 0;
      this.vel[idx * 2 + 1] = random(-1, -3);



      return true;
    }
    return false;
  }

  killParticle(i) {
    this.alive[i] = 0;
  }

  particleIsAlive(i) {
    return this.alive[i] === 1;
  }

  updateParticle(i, dt) {
    if (this.particleIsAlive(i) === false) { return; }

    this.age[i] += dt;
    if (this.age[i] >= this.lifetime[i]) {
      this.killParticle(i);
    }

    this.pos[i * 2 + 0] += this.vel[i * 2 + 0] * dt;
    this.pos[i * 2 + 1] += this.vel[i * 2 + 1] * dt;

    // this.vel[i + 0] += this.acc[0];
    // this.vel[i + 1] += this.acc[1];
  }

  update(dt) {
    this.timer += dt;

    if (this.timer > .01) {
      this.timer = 0;
      for (let i = 0; i < particlesPerFrame; i++) {
        this.spawnParticle();
      }
    }

    for (let i = 0; i < this.count; i++) {
      this.updateParticle(i, dt);
    }
  }

  drawParticle(i) {
    if (this.particleIsAlive(i) === false) { return; }

    let x = this.pos[i * 2 + 0] * imgScale;
    let y = this.pos[i * 2 + 1] * imgScale;

    fill(this.col[i * 4 + 0],
      this.col[i * 4 + 1],
      this.col[i * 4 + 2],
      this.col[i * 4 + 3]);
    
    ellipse(x,y, imgScale, imgScale);
    // rect(x, y, imgScale, imgScale);
  }

  draw() {
    noStroke();
    fill(255);

    for (let i = 0; i < this.count; i++) {
      this.drawParticle(i);
    }
  }
}

class ImageMap {
  constructor() {
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

  getRandomPoint(p, c) {
    let ridx = floor(random(0, this.indices.length));

    // we have the index which needs to be converted into an xy pair
    let idx = this.indices[ridx];
    p.x = idx % this.img.width;
    p.y = floor(idx / this.img.width);


    c[0] = random(0, 255);
    c[1] = random(0, 255);
    c[2] = 0;
    c[3] = 255;
  }
}

window.preload = function() {
  img = loadImage('data/image/lemming.png', function(_img) {
    _img.loadPixels();

    imageMap = new ImageMap();
    imageMap.load(_img);
    imageMap.setScale(imgScale);

    imgLoaded = true;
  });
}

window.setup = function() {
  createCanvas(windowWidth, windowHeight);

  noSmooth();

  [WW, WH] = [windowWidth, windowHeight];

  particles = new Particles({ count: 10000 });
}

function update(dt) {
  particles.update(dt);
}

window.draw = function() {
  if (!imgLoaded) { return; }

  background(0);
  update(0.016);

  // push();
  // scale(6);
  // image(img, 0, 0);
  // pop();
  particles.draw();
}