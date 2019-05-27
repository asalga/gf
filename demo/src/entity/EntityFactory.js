'use strict';

// import mario from './actors/pac/Mario.js';
// import ls from './actors/LetterSelector.js';
// import background from './actors/decorations/Background.js';

import empty from './actors/Empty.js';
import ball from './actors/pong/Ball.js';

import blinky from './actors/pac/Blinky.js';
import pinky from './actors/pac/Pinky.js';
import inky from './actors/pac/Inky.js';
import clyde from './actors/pac/Clyde.js';

let createFuncs = new Map([
  ['empty', empty],
  ['ball', ball],

  // pac
  ['blinky', blinky],
  ['inky', inky],
  ['pinky', pinky],
  ['clyde', clyde]
]);

export default class gfEntityFactory {
  static create(str, args) {
  	let ret = createFuncs.get(str)(args);
    return ret;
  }
}