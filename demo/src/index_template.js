'use strict';

import Assets from './assets/Assets.js';
import manifest from './Manifest.js';

import Utils from './Utils.js';
import Debug from './debug/Debug.js';
import Scene from './Scene.js';

import Event from './event/Event.js';
import EventSystem from './event/EventSystem.js';

import Renderer from './Renderer.js';

import cfg from './cfg.js';
import Pool from './core/Pool.js';

import EntityFactory from './entity/EntityFactory.js';

let scene = new Scene();


let preloadCallback = function() {
  console.log('Main: preload callback');

  Renderer.init();
  // scene = new Scene();

  createCanvas(cfg.gameWidth, cfg.gameHeight);
};

window.preload = function() {
  console.log('Main: preload');
  Assets.load(manifest, preloadCallback);
};

window.setup = function() {
  console.log('Main: setup');
};

window.draw = function() {
  if (!Assets.isDone()) { return; }

  update(0.016);
  render();
};

window.mousePressed = function() {
  console.log('Main: mousePressed');
};

function update(dt) {
  scene.update(dt);
}

function render() {
  background(100);
  image(Assets.get('image', 'img'), 0, 0);
  Renderer.render(scene);
}