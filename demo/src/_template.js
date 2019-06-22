'use strict';

let WW, WH;

window.preload = function() {
  console.log('preload');
};

window.setup = function() {
  createCanvas(windowWidth, windowHeight);
  WW = windowWidth;
  WH = windowHeight;
};

function update(dt) {}

window.draw = function() {
  update(0.016);
  background(100);
};