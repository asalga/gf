'use strict';

import Assets from './assets/Assets.js';
import manifest from './pac_manifest.js';

import Utils from './Utils.js';
import Debug from './debug/Debug.js';
import Scene from './Scene.js';

import Renderer from './Renderer.js';

import cfg from './cfg.js';
import Pool from './core/Pool.js';
import GameTimer from './core/GameTimer.js';

import EntityFactory from './entity/EntityFactory.js';
import gfEntityFactory from './entity/gfEntityFactory.js';

let timer = new GameTimer(1 / 60);

let preloadCallback = function() {
  console.log('Main: preload callback');

  Renderer.init();
  createCanvas(cfg.gameWidth, cfg.gameHeight);
  window.scene = new Scene();

  let pacSlider = EntityFactory.create('pacslider');

  timer.start();
  timer.update = function(dt) {
    window.scene.update(dt);
    render();
  };

  scene.add(pacSlider);
};

window.preload = function() {
  console.log('Main: preload');

  Assets.load(manifest, preloadCallback);
};

window.setup = function() {
  console.log('Main: setup');

  // let kb = gfEntityFactory.create('keyboardlistener');
  // let empty = EntityFactory.create('empty');
  // scene.add(kb);
};

window.mousePressed = function() {
  console.log('Main: mousePressed');
};

function render() {
  background(0);

  // fill(255);
  // noStroke();
  // rect(0, 0, 100, 100);

  Renderer.render(scene);
}