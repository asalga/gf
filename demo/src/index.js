'use strict';

import manifest from './Manifest.js';


import Utils from './Utils.js';
import Debug from './debug/Debug.js';
import Scene from './Scene.js';
import Assets from './assets/Assets.js';

import Event from './event/Event.js';
import EventSystem from './event/EventSystem.js';

import Renderer from './Renderer.js';

import cfg from './cfg.js';
// import Pool from './core/Pool.js';



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