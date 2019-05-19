'use strict';

window.preload = function() {
  console.log('preload');
};

window.setup = function() {
  console.log('setup');
  createCanvas(400, 400);
};

window.draw = function() {
  background(100);
};