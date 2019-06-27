let id = 0;
Math.linearTween = function(t, b, c, d) {
  return c * t / d + b;
};

class Segment {

  constructor(cfg) {
    Object.assign(this, cfg);

    this.t = 0;
    this.dist = 0;
    this.id = id++;
    this.printed = false;

    this.normalizedYpos = map(this.pos.y, 0, numSegments, -1, 1);

    // [x,y, x,y, ...]
    // add 2 for a point starting at the very start of the viewport and one of the end.
    this.vertices = new Float32Array(segmentResolution * 2);
  }

  update(dt, gfxText) {
    this.t += dt * speed;

    let xSpacing = this.len / segmentResolution;

    this.dist += dt * speed;

    // let wave = sin(this.pos.y / CH * TAU);

    // if (this.pos.y > gfxText.height / segmentSpacing) {
    //  this.pos.y -= gfxText.height / segmentSpacing;
    // }
    // this.pos.y = this.pos.y % CH;
    // if (this.pos.y < 0) {
    //   this.pos.y += gfxText.height / segmentSpacing;
    // }

    let y = floor(this.pos.y * segmentSpacing) % CH;
    this.sinWave = y;

    if (this.printed === false) {
      console.log('------');
    }

    for (let i = 0; i < this.vertices.length; i += 2) {

      let x = (i / 2) * xSpacing;

      // let col = (gfxText.get(x,y)[0]) / 255;
      let col = gfxText.pixels[(y * CW + x) * 4];
      let intensity = col / 255;

      this.vertices[i + 0] = x;
      // this.vertices[i + 1] = (y - intensity * heightScale);
      // this.vertices[i + 1] = y;
      this.vertices[i + 1] = y - (intensity * heightScale);

      if (i < 50) {
        let test = (this.pos.y - 25) / 24;
        let l = Math.linearTween(i * 3 * test - intensity * heightScale, 0, i/50, 1);
        this.vertices[i + 1] = (CH / 2) + l;
      }
    }
  }

  draw() {
    // let waves = (sin(this.pos.y / 2.0 + this.t * -3) / PI) + 0.4;
    // let vignette = sin(this.pos.y%CH/ gfxText.height * PI);
    // stroke(255, 255  * vignette);
    stroke(255 * sin(this.sinWave/CH * PI) * 2 -1);
    // stroke(255);

    if (this.printed === false) {
      this.printed = true;
    }

    beginShape();
    for (let i = 0; i < this.vertices.length; i += 2) {
      vertex(this.vertices[i + 0], this.vertices[i + 1]);
    }
    endShape();
    // text((this.normalizedYpos), 40, this.vertices[1]*4);
  }
}
// if (i === 0) {
// vertex(-WW, this.vertices[i + 1]);
// } else if (i + 2 === this.vertices.length) {
// vertex(WW, this.vertices[i + 1]);
// } 
// else {
// if (this.id < numSegments - 1) {
//   let s = segments[id + 1];
//   vertex(this.vertices[i + 0], this.vertices[i + 1]);
// }
// }

'use strict';

// gfxText
let startTime;
let currTime = 1000;
let idx = 0;
let needsUpdate = true;
let WW, WH;
let CH, CW;
let str = 'type!';
let gfx;
let timings = [];
let renderCount = 0;
let cursorChar = '|';
let cursorCharTIme = 0;

// Lines
let segments = [];
let numSegments = 50;
let segmentResolution = 100; // TODO: fix bug here
let segmentLength;
let segmentSpacing;
let heightScale = 8;
let speed = 0;

let now, lastTime = 0;
let gfx2, gfxText;

window.setup = function() {
  createCanvas(windowWidth, windowHeight);
  [WW, WH] = [windowWidth, windowHeight];

  CH = 300;
  CW = 700;
  gfx2 = createGraphics(CW, CH);

  gfxText = createGraphics(CW, CH);
  gfxText.textAlign(CENTER, CENTER);
  gfxText.textFont('monospace');
  gfxText.textSize(160);

  segmentSpacing = gfxText.height / numSegments;
  segmentLength = gfxText.width;

  for (let i = 0; i < numSegments; i++) {
    segments.push(new Segment({ pos: { x: 0, y: i }, len: segmentLength }));
  }

  // fix some strange flashing at the top of the sketch
  // $('#defaultCanvas0').css('top', '-2px')
}

function update(dt) {

  cursorCharTIme += dt;
  if (cursorCharTIme > .25) {
    cursorCharTIme = 0;
    cursorChar = cursorChar === ' ' ? '|' : ' ';
  }

  updateText(dt);
  segments.forEach(s => s.update(dt, gfxText));
}

function updateText() {
  if (startTime) {

    if (idx < typed.length) {
      let lastTime = typed[idx].t;

      if (millis() - startTime > lastTime) {
        str += typed[idx].key;
        idx++;
      }
    }
  }
}

/*
 */
window.draw = function() {

  now = millis();
  let dt = (now - lastTime) / 1000;

  update(dt);
  background(0);

  if (frameCount % 2 === 0) {
    needsUpdate = true;
  }

  drawText();
  drawLines();
  // noLoop();
}

function drawText() {

  if (needsUpdate) {
    gfxText.loadPixels();
    gfxText.background(0, 20);

    for (let i = 0; i < 1; i++) {
      gfxText.push();
      gfxText.translate(CW / 2, CH / 2);

      gfxText.noStroke();
      gfxText.fill(255, 30);
      gfxText.text(str + cursorChar, 0, 0);
      gfxText.filter(BLUR, 1);
      gfxText.fill(255, 90);
      gfxText.text(str + cursorChar, 0, 0);

      renderCount++;
      gfxText.pop();
    }
  }

  if (renderCount > 1) {
    renderCount = 0;
    needsUpdate = false;
  }

  fill(255);
  text(floor(frameRate()), 30, 30);

  lastTime = now;
}


function drawLines() {
  strokeWeight(1);
  noFill();
  let gridHeight = numSegments * segmentSpacing;

  // heightScale = 60 + (sin(millis()/1000) / TAU) * 50;
  translate(windowWidth / 2 - gfxText.width * 0.75, windowHeight / 2 - gfxText.height * 0.75);
  scale(1.5, 1.5);
  segments.forEach(s => s.draw());
}

document.addEventListener('keydown', k => {

  needsUpdate = true;

  if (k.key === 'Tab') {
    startTime = millis();
    window.setInterval(() => {
      str = '';
    }, 2000)
  }

  if (k.key === 'Escape') {
    str = '';
    return;
  }

  if (k.key === 'Backspace' && str.length >= 0) {
    str = str.substring(0, str.length - 1);
  } else if (k.key === 'Escape') {
    str = '';
  }
  //
  else {
    str += k.key;
    timings.push({ key: k.key, t: millis() })
  }
});



/*
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */
let easingFunctions = {
  // no easing, no acceleration
  linear: function(t) { return t },
  // accelerating from zero velocity
  easeInQuad: function(t) { return t * t },
  // decelerating to zero velocity
  easeOutQuad: function(t) { return t * (2 - t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function(t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
  // accelerating from zero velocity 
  easeInCubic: function(t) { return t * t * t },
  // decelerating to zero velocity 
  easeOutCubic: function(t) { return (--t) * t * t + 1 },
  // acceleration until halfway, then deceleration 
  easeInOutCubic: function(t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
  // accelerating from zero velocity 
  easeInQuart: function(t) { return t * t * t * t },
  // decelerating to zero velocity 
  easeOutQuart: function(t) { return 1 - (--t) * t * t * t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function(t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t },
  // accelerating from zero velocity
  easeInQuint: function(t) { return t * t * t * t * t },
  // decelerating to zero velocity
  easeOutQuint: function(t) { return 1 + (--t) * t * t * t * t },
  // acceleration until halfway, then deceleration 
  easeInOutQuint: function(t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }
}