'use strict';

import Assets from './assets/Assets.js';
import manifest from './Manifest.js';

let assets;

let preloadCallback = function() {
  console.log('preload callback');
}

window.preload = function() {
  console.log('preload');
  assets = new Assets(manifest);
  assets.preload(preloadCallback);
};

window.setup = function() {
  console.log('setup');
  createCanvas(400, 400);
};

window.draw = function() {
  background(100);

  if (!assets.checkIfDone()) { return; }

  let img = assets.get('image', 'img');
  image(img, 0, 0);
};