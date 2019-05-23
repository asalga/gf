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
import Pool from './core/Pool.js';

import EntityFactory from './entity/EntityFactory.js';

let assets;
let scene;

let preloadCallback = function() {
  console.log('preload callback');

  Pool.init();
  Debug.init({ toggleKey: 'Escape' });
  Renderer.init();

  scene = new Scene();
  scene.restartGame();

  createCanvas(400, 400);

  let e = EntityFactory.create('ball');
  scene.add(e);
}

window.preload = function() {
  console.log('preload');

  assets = new Assets(manifest);
  assets.preload(preloadCallback);
};

window.setup = function() {
  console.log('setup');
};

function update(dt) {
  Debug.add(`Root Entity count: ${scene.entities.size}`);

  scene.update(dt);
}

function render() {
  // let img = assets.get('image', 'img');
  // image(img, 0, 0);
  Renderer.render(scene);
}

function preRender() {
  background(0);
  Renderer.preRender();
}

function postRender() {
  let bytes = window.performance.memory.totalJSHeapSize.toLocaleString();
  Debug.add(`heap: ${bytes} bytes`);
  Debug.draw();
  Debug.postRender();
  Renderer.postRender();
}

window.draw = function() {
  if (!assets.checkIfDone()) { return; }

  update(0.016);

  preRender();
  render();
  postRender();
};