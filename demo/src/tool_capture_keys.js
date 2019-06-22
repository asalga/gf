/*
	Andor Saga
	
	This script captures key presses along with the time between them (deltas)
	so they can be used in other sketches to emulate typing of text.
	
	To start capturing keystrokes, hit Escape.
	To stop, hit Escape again.
	The data will then be written to the console.
	
	Since delta times are used, it is easy to fix any typos by manually editing the array.
*/
let WW, WH;
const TextHeight = 50;
let stringToPrint = [{ "key": "T", "dt": 0 }, { "key": "h", "dt": 324 }, { "key": "e", "dt": 128 }, { "key": " ", "dt": 184 }, { "key": "p", "dt": 367 }, { "key": "u", "dt": 87 }, { "key": "r", "dt": 136 }, { "key": "p", "dt": 393 }, { "key": "o", "dt": 102 }, { "key": "s", "dt": 119 }, { "key": "e", "dt": 107 }, { "key": " ", "dt": 372 }, { "key": "o", "dt": 81 }, { "key": "f", "dt": 262 }, { "key": " ", "dt": 123 }, { "key": "t", "dt": 244 }, { "key": "h", "dt": 112 }, { "key": "i", "dt": 71 }, { "key": "s", "dt": 76 }, { "key": " ", "dt": 139 }, { "key": "p", "dt": 319 }, { "key": "a", "dt": 531 }, { "key": "a", "dt": 200 }, { "key": " ", "dt": 308 }, { "key": "i", "dt": 136 }, { "key": "s", "dt": 119 }, { "key": " ", "dt": 104 }, { "key": "t", "dt": 447 }, { "key": "o", "dt": 271 }, { "key": " ", "dt": 208 }];

// For capturing
let timerStarted = false;
let timings = [];
let str = '';
let startTime;
let lastTime = 0;

// For Playback
let isUserTyping = false;
let currIdx = 0;
let playbackTimer = 0;
let aniLastTime = 0;

window.setup = function() {
  createCanvas(windowWidth, windowHeight);
  WW = windowWidth;
  WH = windowHeight;

  noStroke();
  fill(255);
  textSize(40);
}

window.draw = function() {
  let delta = (millis() - aniLastTime) / 1000;
  // console.log(delta*1000);
  update(delta*1000);

  background(0);
  printText(stringToPrint, currIdx);

  aniLastTime = millis();
}

/*
*/
function update(dt) {
  playbackTimer += dt;
  //if (isUserTyping) return;

  if (currIdx >= stringToPrint.length) return;

  // debugger;
  let el = stringToPrint[currIdx];
  if (playbackTimer >= el.dt) {
    playbackTimer = 0;//el.dt;
    currIdx++;
  }
}

// keyTyped() doesn't register control keys, so use this instead
document.onkeydown = function(evt) {

  if (evt.key === 'Escape' && timerStarted === false) {
    timerStarted = true;
    str = '';
    timings.length = 0;

    background(0);
    isUserTyping = true;
    playbackStr = '';
    yLine = 0;
  }
  // Output the user data!
  else if (evt.key === 'Escape' && timerStarted === true) {
    timerStarted = false;
    console.log('--- timing data ---');
    console.log(JSON.stringify(timings));
  }
  //
  else {
    let dt;

    // Best if the first chart starts at time = 0
    if (timings.length === 0) {
      dt = 0;
    } else {
      dt = floor(millis() - lastTime);
    }
    lastTime = millis();

    // if(isControlKey(evt) === false){
    str += evt.key;
    timings.push({ key: evt.key, dt: dt })
    // }
    // else{
    // 	if(evt.key === 'Enter'){
    // 		cursorX = 0;
    // 		yLine += textHeight;
    // 		return;
    // 	}
  }
};

function isControlKey(evt) {
  return evt.metaKey || evt.shiftKey || evt.key === "Enter";
}

/*
	str - string to print out
	idx - up to this index
*/
function printText(str, idx) {
  push();
  translate(20, 50);

  let strLine = '';
  for (let i = 0; i < idx; i++) {
    strLine += str[i].key;
  }
  text(strLine, 0, 0);

  //for(let y = 0; y < playbackStr.length; y++){
  //  text(playbackStrings[y], 0, y * textHeight);
  //}
  pop();
}