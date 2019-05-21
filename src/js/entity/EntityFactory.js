// 'use strict';

// // import ls from './actors/LetterSelector.js';

// import glyph from './actors/letter.js';
// import kb from './actors/KeyboardListener.js';
// import charSlot from './actors/CharSlot.js';
// import wordSlot from './actors/WordSlot.js';
// import ui from './actors/Ui.js';
// import typo from './actors/TypoDetector.js';
// import empty from './actors/Empty.js';
// import audio from './actors/AudioEventListener.js';

// // Playing around with new paths
// import ws from '../_game/entity/actors/WordSelector.js';
// import word from '../_game/entity/actors/Word.js';

// // BHV
// import sequenceselector from './actors/SequenceSelector.js';
// import randomselector from './actors/RandomSelector.js';
// import romanjianswer from './actors/RomanjiAnswer.js';

// import background from './actors/decorations/Background.js';

// let createFuncs = new Map([
//   // ['letterselector', ls],
//   ['glyph', glyph],
//   ['keyboardlistener', kb],
//   ['wordselector', ws],
//   ['charslot', charSlot],
//   ['wordslot', wordSlot],
//   ['word', word],
//   ['ui', ui],
//   ['typo', typo],
//   ['empty', empty],
//   ['audioeventlistener', audio],

//   ['sequenceselector', sequenceselector],
//   ['randomselector', randomselector],
//   ['romanjianswer', romanjianswer],

//   ['background', background],
// ]);

// export default class EntityFactory {
//   static create(str, args) {
//     return createFuncs.get(str)(args);
//   }
// }