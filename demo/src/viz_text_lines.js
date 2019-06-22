'use strict';

let startTime;
let currTime = 1000;
let idx = 0;
let needsUpdate = true;

let WW, WH;
let CH, CW;
let str = '';
let gfx;
let timings = [];
let rederCount = 0;

window.setup = function() {
  CH = 200;
  CW = 400;

  createCanvas(CW, CH);
  gfx = createGraphics(CW, CH);
  gfx.textAlign(CENTER, CENTER);
  gfx.textFont('monospace');
  gfx.textSize(80);

  WW = windowWidth;
  WH = windowHeight;
};

function update(dt) {
  if (startTime) {

    if (idx < typed.length) {
      let lastTime = typed[idx].t;

      if (millis() - startTime > lastTime) {
        str += typed[idx].key;
        idx++;
        needsBlur = true;
      }
    }
  }
}

window.draw = function() {
  update(0.016);

  background(0, 255);

  if (needsUpdate) {
    gfx.background(0, 255);

    for (let i = 0; i < 3; i++) {
      gfx.push();

      gfx.translate(CW / 2, CH / 2);
      gfx.noStroke();
      gfx.fill(255);

      gfx.push();
      gfx.text(str, 0, 0);
      gfx.filter(BLUR, 2);
      gfx.pop();
      // for (let i = 0; i < 10; i++) {
      //   gfx.push();
      //   let t = 0;//(millis() / 750);
      //   let intensity = (((i + 1) / 20 - t) * 255) % 255;
      //   gfx.fill((255 - intensity) % 255);
      //   gfx.scale(1 + (i)/100);
      //         gfx.text(str, 0, 0);
      //         gfx.pop();
      // }
      gfx.text(str, 0, 0);
      rederCount++;
      gfx.pop();
    }
  }

  image(gfx, 0, 0);
  rederCount = 0;
  needsUpdate = false;

  fill(255);
  text(frameRate(), 40, 40);
};

window.addEventListener('keydown', k => {
  // loop();

  needsUpdate = true;

  if (k.key === 'Tab') {
    startTime = millis();
    window.setInterval(() => {
      str = '';
    }, 2000)
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