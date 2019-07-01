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

window.maxSteer = 60;
window.maxTest = 8;
window.minDist = 10;

let timer = new GameTimer(1 / 60);

let preloadCallback = function() {
  console.log('Main: preload callback');

  Renderer.init();

  let arr = ['blinky', 'pinky', 'clyde', 'inky'];
  // let arr = ['blinky', 'clyde', 'pinky'];
  //let arr = ['blinky'];
  arr = Utils.repeat(arr, 25)

  arr.forEach(name => {
    let sprite = EntityFactory.create(name);
    scene.add(sprite);
  });

  createCanvas(cfg.gameWidth, cfg.gameHeight);
};

window.preload = function() {
  console.log('Main: preload');
  Assets.load(manifest, preloadCallback);
};

window.setup = function() {
  console.log('Main: setup');

  window.scene = new Scene();

  timer.start();
  timer.update = function(dt) {
    window.scene.update(dt);
    render();
  };
};


window.mousePressed = function() {
  console.log('Main: mousePressed');
};

function render() {
  // push();
  background(0);
  // scale(0.5, 0.5);
  Renderer.render(window.scene);
  // pop();
}