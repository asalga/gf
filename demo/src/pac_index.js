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

let scene = new Scene();
let timer = new GameTimer(1 / 60);

let preloadCallback = function() {
  console.log('Main: preload callback');

  Renderer.init();
  scene = new Scene();

  ['blinky', 'pinky' ].forEach(name => {
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

  timer.start();
  timer.update = function(dt) {
    scene.update(dt);
    render();
  };

};


window.mousePressed = function() {
  console.log('Main: mousePressed');
};

function render() {
  background(100);
  Renderer.render(scene);
}