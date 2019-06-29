'use strict';

const RAD_TO_DEG = 180 / Math.PI;
const DEG_TO_RAD = Math.PI / 180;

let WW, WH;

let imgLoaded = 0;

let mainImageMap;
let mainParticles;
let dotsImageMap;
let dotsParticles;

let imgScale = 2.5;
let scl = 1;

let theta = 0;
let lastTime = 0;

class Particles {
  constructor(cfg) {
    this.timer = 0;

    this.map = cfg.map;

    this.rate = cfg.rate || 10;
    this.szSpeed = cfg.szSpeed;
    this.fn = cfg.fn || function() {};
    this.lifeTimeRange = cfg.lifeTimeRange;

    if (cfg.sz) {
      this.sizeRange = [cfg.sz[0], cfg.sz[1]];
    }

    if (cfg.vel) {
      this.velRange = [cfg.vel[0], cfg.vel[1]];
    }

    this.count = cfg.count;
    this._p = createVector();

    this.alive = new Uint8Array(this.count);
    this.age = new Float32Array(this.count);
    this.lifetime = new Float32Array(this.count);
    this.size = new Uint8Array(this.count);
    this.sizeOri = new Uint8Array(this.count);

    this.pos = new Float32Array(this.count * 2);
    this.worldPos = new Float32Array(this.count * 2);
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

    if (idx > -1) {
      this._p = createVector();
      let c = [0, 0, 0, 0];

      /// WTF?
      this.map.getRandomPoint(this._p, c);

      this.col[idx * 4 + 0] = c[0];
      this.col[idx * 4 + 1] = c[1];
      this.col[idx * 4 + 2] = c[2];
      this.col[idx * 4 + 3] = c[3];

      this.worldPos[idx * 2 + 0] = 0;
      this.worldPos[idx * 2 + 1] = 0;

      let x = this._p.x;
      let y = this._p.y;

      // move to center before rotating
      x -= this.map.img.width / 2;
      y -= this.map.img.height / 2;

      let v = createVector(x, y);
      let len = v.mag();
      v.normalize();
      x = v.x;
      y = v.y;

      let degrees = Math.atan2(y, x) * RAD_TO_DEG;
      let d = (degrees + 360) % 360;

      let rate = millis() / 10;
      d += rate;

      x = sin(d * DEG_TO_RAD) * len;
      y = cos(d * DEG_TO_RAD) * len;

      x += this.map.img.width / 2;
      y += this.map.img.height / 2;

      this.pos[idx * 2 + 0] = x;
      this.pos[idx * 2 + 1] = y;

      //this.pos[idx * 2 + 0] += random(0, imgScale / 6);
      //this.pos[idx * 2 + 1] += random(0, imgScale / 6);

      this.age[idx] = 0;
      this.alive[idx] = 1;
      this.lifetime[idx] = random(this.lifeTimeRange[0], this.lifeTimeRange[1]);

      // if (this.sizeRange) {
      //   this.sizeOri[idx] = random(this.sizeRange[0], this.sizeRange[1]);
      // }

      // if (this.velRange) {
      //   this.acc[idx] = random(this.velRange[0], this.velRange[1]);
      //   this.vel[idx * 2 + 1] = this.acc[idx];
      // }

      // this.vel[idx * 2 + 1] = -15;
      // this.vel[idx * 2 + 1] = random(-5, -8);

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

    let a = this.age[i];
    let l = this.lifetime[i];

    // this.col[i * 4 + 3] = 255 - ((a / l) * 255);
    // this.size[i] = this.sizeOri[i] - (a / l * this.sizeOri[i]);

    if (this.szSpeed === 0) {
      this.size[i] = this.sizeOri[i];
    } else {
      this.size[i] = this.sizeOri[i] - (a / l * this.sizeOri[i]);
    }

    this.vel[i + 0] += this.acc[0];
    this.vel[i + 1] += this.acc[1];
  }

  update(dt) {
    this.timer += dt;

    if (this.timer > .01) {
      this.timer = 0;
      for (let i = 0; i < this.rate; i++) {
        this.spawnParticle();
      }
    }

    for (let i = 0; i < this.count; i++) {
      this.updateParticle(i, dt);
    }
  }

  drawParticle(i) {
    //  if (this.particleIsAlive(i) === false) { return; }
    // this.fn(x, y, i, this.size[i]);
  }

  draw() {
    noFill(255, 0, 0);
    noStroke(255, 0, 0);
    strokeWeight(1);

    let x, y;
    for (let i = 0; i < this.count; i++) {

      if (this.particleIsAlive(i) === false) { continue; }

      fill(this.col[i * 4 + 0],
        this.col[i * 4 + 1],
        this.col[i * 4 + 2],
        this.col[i * 4 + 3]);

      x = this.pos[i * 2 + 0] * imgScale;
      y = this.pos[i * 2 + 1] * imgScale;

      let v = 8 * sin((this.age[i] / this.lifetime[i]) * PI);

      ellipse(x, y, v);
    }
  }
}

class ImageMap {
  constructor() {
    this.scale = 1;
    this.indices = [];
    this.img;
  }

  load(p5Img, pixelSelector) {
    let px = p5Img.pixels;
    this.img = p5Img;

    for (let i = 0, len = px.length; i < len; i += 4) {
      let r = px[i + 0];
      let g = px[i + 1];
      let b = px[i + 2];
      let a = px[i + 3];

      if (pixelSelector(r, g, b, a)) {
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

    c[0] = this.img.pixels[idx * 4 + 0];
    c[1] = this.img.pixels[idx * 4 + 1];
    c[2] = this.img.pixels[idx * 4 + 2];
    c[3] = this.img.pixels[idx * 4 + 3];
  }
}

window.preload = function() {

  loadImage('data/image/yy_red.png', function(_img) {
    _img.loadPixels();

    mainImageMap = new ImageMap();
    mainImageMap.load(_img, function(r, g, b, a) {
      return r > 0 && g > 0 && b > 0;
    });
    mainImageMap.setScale(imgScale);

    dotsImageMap = new ImageMap();
    dotsImageMap.load(_img, function(r, g, b, a) {
      return r > 100 && b < 50 && g < 30;
    });
    dotsImageMap.setScale(imgScale);

    imgLoaded++;
  });
}

window.setup = function() {
  [WW, WH] = [windowWidth, windowHeight];
  createCanvas(WW, WH);

  background(0);

  mainParticles = new Particles({
    map: mainImageMap,
    count: 1000,
    rate: 70,
    lifeTimeRange: [0.2, .3],
  });

  dotsParticles = new Particles({
    map: dotsImageMap,
    count: 100,
    rate: 5,
    lifeTimeRange: [0.3, 0.4]
  });
}

function update(dt) {
  mainParticles.update(dt);
  dotsParticles.update(dt);
}

function drawTransparencyLayer() {
  fill(0, 20);
  noStroke();
  rect(0, 0, WW, WH);
}

function drawDebug() {
  fill(255);
  text(frameRate(), 20, 30);
}

window.draw = function() {
  if (imgLoaded !== 1) { return; }

  let dt = (millis() - lastTime) / 1000;

  update(dt);

  drawTransparencyLayer();

  push();
  scale(scl, scl);
  translate(WW / 2 - mainImageMap.img.width, WH / 2 - mainImageMap.img.height);
  mainParticles.draw();
  dotsParticles.draw();
  pop();

  // drawDebug();
  lastTime = millis();
}