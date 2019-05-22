'use strict';

// import ls from './actors/LetterSelector.js';
// import background from './actors/decorations/Background.js';

import empty from './actors/Empty.js';
import ball from './actors/pong/Ball.js';

let createFuncs = new Map([
  ['empty', empty],
  ['ball', ball]
]);

export default class gfEntityFactory {
  static create(str, args) {
  	let ret = createFuncs.get(str)(args);
    return ret;
  }
}