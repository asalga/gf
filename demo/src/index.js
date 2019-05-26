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

  Pool.init([
    // { name: 'vec2', type: Vec2, count: 100 }
  ]);
  Debug.init({ toggleKey: 'Escape' });
  Renderer.init();

  scene = new Scene();
  scene.restartGame();
  window.scene = scene;


  createCanvas(windowWidth, windowHeight);

  scene.add(EntityFactory.create('ball'));

  for (let i = 0; i < 1000; i++) {
    let x = random(-2100, 2100);
    let y = random(-2100, 2100);

    let e = EntityFactory.create('inky');
    e.pos.set(x, y);

    scene.add(e);
  }
  // scene.add(EntityFactory.create('inky'));
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
  // Debug.add(`Root Entity count: ${scene.entities.size}`);
  scene.update(dt);
}

function render() {
  Renderer.render(scene);
}

function preRender() {
  background(0);
  Renderer.preRender();
}

function postRender() {
  // let bytes = window.performance.memory.totalJSHeapSize.toLocaleString();
  // Debug.add(`heap: ${bytes} bytes`);
  // Debug.draw();
  // Debug.postRender();
  Renderer.postRender();
}

window.draw = function() {
  if (!assets.checkIfDone()) { return; }
  update(0.016);
  preRender();
  render();
  postRender();
};

window.mousePressed = function() {
  let inky = scene.findEntity('ball');
  scene.remove(inky);
}