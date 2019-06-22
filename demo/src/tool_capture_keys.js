/*
	Andor Saga
	
	This script captures key presses along with the time between them (deltas)
	so they can be used in other sketches to emulate typing of text.
	
	To start capturing keystrokes, hit Escape.
	To stop, hit Escape again.
	The data will then be written to the console.
	
	Since delta times are used, it is easy to insert missing chars
	and to fix any typos by directly editing the data.
*/
let WW, WH;
const TextHeight = 50;

let demoData = [{"key":"H","dt":0},{"key":"e","dt":184},{"key":"l","dt":151},{"key":"l","dt":135},{"key":"o","dt":144},{"key":"!","dt":935},{"key":"Backspace","dt":808},{"key":"Backspace","dt":127},{"key":"Backspace","dt":136},{"key":"Backspace","dt":135},{"key":"Backspace","dt":120},{"key":"Backspace","dt":127},{"key":"T","dt":1081},{"key":"h","dt":230},{"key":"i","dt":64},{"key":"s","dt":96},{"key":" ","dt":95},{"key":"s","dt":168},{"key":"c","dt":151},{"key":"r","dt":208},{"key":"i","dt":87},{"key":"p","dt":72},{"key":"t","dt":128},{"key":" ","dt":96},{"key":"c","dt":479},{"key":"a","dt":79},{"key":"p","dt":279},{"key":"t","dt":224},{"key":"u","dt":104},{"key":"r","dt":105},{"key":"e","dt":86},{"key":"s","dt":96},{"key":" ","dt":159},{"key":"k","dt":111},{"key":"e","dt":95},{"key":"y","dt":104},{"key":" ","dt":64},{"key":"p","dt":176},{"key":"r","dt":95},{"key":"e","dt":48},{"key":"s","dt":216},{"key":"s","dt":136},{"key":"e","dt":145},{"key":"s","dt":110},{"key":" ","dt":95},{"key":"a","dt":71},{"key":"l","dt":112},{"key":"o","dt":160},{"key":"n","dt":71},{"key":"g","dt":79},{"key":" ","dt":65},{"key":"w","dt":158},{"key":"i","dt":79},{"key":"t","dt":111},{"key":"h","dt":72},{"key":" ","dt":79},{"key":"t","dt":66},{"key":"h","dt":102},{"key":"e","dt":72},{"key":" ","dt":31},{"key":"t","dt":352},{"key":"i","dt":24},{"key":"m","dt":70},{"key":"e","dt":151},{"key":"Enter","dt":304},{"key":"b","dt":425},{"key":"e","dt":184},{"key":"t","dt":158},{"key":"w","dt":159},{"key":"e","dt":192},{"key":"e","dt":143},{"key":"n","dt":383},{"key":" ","dt":95},{"key":"t","dt":224},{"key":"h","dt":295},{"key":"e","dt":176},{"key":"m","dt":127},{"key":"(","dt":376},{"key":"d","dt":528},{"key":"e","dt":167},{"key":"l","dt":88},{"key":"t","dt":488},{"key":"a","dt":95},{"key":"s","dt":207},{"key":")","dt":287},{"key":" ","dt":999},{"key":"s","dt":152},{"key":"o","dt":95},{"key":" ","dt":72},{"key":"t","dt":255},{"key":"h","dt":96},{"key":"e","dt":151},{"key":"y","dt":80},{"key":" ","dt":576},{"key":"c","dt":167},{"key":"a","dt":63},{"key":"n","dt":80},{"key":" ","dt":95},{"key":"l","dt":111},{"key":"a","dt":48},{"key":"t","dt":192},{"key":"e","dt":95},{"key":"r","dt":129},{"key":" ","dt":94},{"key":"b","dt":223},{"key":"e","dt":160},{"key":" ","dt":223},{"key":"u","dt":168},{"key":"s","dt":71},{"key":"e","dt":136},{"key":"d","dt":175},{"key":" ","dt":55},{"key":"i","dt":127},{"key":"n","dt":104},{"key":" ","dt":95},{"key":"t","dt":160},{"key":"o","dt":23},{"key":"Backspace","dt":519},{"key":"Backspace","dt":119},{"key":"o","dt":248},{"key":"t","dt":160},{"key":"h","dt":80},{"key":"e","dt":112},{"key":"r","dt":79},{"key":"Enter","dt":256},{"key":"s","dt":159},{"key":"k","dt":471},{"key":"e","dt":120},{"key":"t","dt":191},{"key":"c","dt":176},{"key":"h","dt":111},{"key":"e","dt":129},{"key":"s","dt":110},{"key":" ","dt":89},{"key":"t","dt":126},{"key":"o","dt":57},{"key":" ","dt":94},{"key":"e","dt":175},{"key":"m","dt":88},{"key":"u","dt":175},{"key":"l","dt":112},{"key":"a","dt":104},{"key":"t","dt":78},{"key":"e","dt":97},{"key":" ","dt":126},{"key":"t","dt":207},{"key":"h","dt":64},{"key":"e","dt":96},{"key":" ","dt":103},{"key":"t","dt":143},{"key":"y","dt":95},{"key":"u","dt":16},{"key":"p","dt":31},{"key":"i","dt":199},{"key":"n","dt":64},{"key":"Backspace","dt":343},{"key":"Backspace","dt":136},{"key":"Backspace","dt":129},{"key":"Backspace","dt":134},{"key":"p","dt":400},{"key":"i","dt":175},{"key":"n","dt":63},{"key":"g","dt":120},{"key":" ","dt":87},{"key":"o","dt":96},{"key":"f","dt":111},{"key":" ","dt":104},{"key":"t","dt":232},{"key":"e","dt":95},{"key":"x","dt":559},{"key":"t","dt":199},{"key":"(","dt":192},{"key":" ","dt":407},{"key":"Backspace","dt":408},{"key":"Backspace","dt":119},{"key":" ","dt":256},{"key":"(","dt":159},{"key":"j","dt":383},{"key":"u","dt":144},{"key":"s","dt":79},{"key":"t","dt":72},{"key":" ","dt":72},{"key":"l","dt":55},{"key":"i","dt":72},{"key":"k","dt":160},{"key":"e","dt":135},{"key":" ","dt":32},{"key":"t","dt":824},{"key":"h","dt":47},{"key":"i","dt":64},{"key":"s","dt":79},{"key":"!","dt":296},{"key":")","dt":351},{"key":"Enter","dt":943},{"key":"Enter","dt":144},{"key":"T","dt":1088},{"key":"o","dt":119},{"key":" ","dt":112},{"key":"s","dt":329},{"key":"t","dt":262},{"key":"a","dt":105},{"key":"r","dt":126},{"key":"t","dt":167},{"key":" ","dt":144},{"key":"c","dt":303},{"key":"a","dt":88},{"key":"p","dt":127},{"key":"t","dt":383},{"key":"u","dt":120},{"key":"r","dt":191},{"key":"i","dt":120},{"key":"n","dt":47},{"key":" ","dt":199},{"key":"k","dt":200},{"key":"e","dt":128},{"key":"y","dt":137},{"key":"s","dt":614},{"key":",","dt":487},{"key":" ","dt":65},{"key":"h","dt":183},{"key":"i","dt":30},{"key":"t","dt":143},{"key":" ","dt":112},{"key":"e","dt":584},{"key":"s","dt":1136},{"key":"c","dt":199},{"key":"a","dt":98},{"key":"p","dt":189},{"key":"e","dt":88},{"key":".","dt":1047},{"key":"Enter","dt":248},{"key":"T","dt":1048},{"key":"o","dt":112},{"key":" ","dt":105},{"key":"s","dt":167},{"key":"t","dt":118},{"key":"o","dt":527},{"key":"p","dt":95},{"key":",","dt":328},{"key":" ","dt":55},{"key":"h","dt":215},{"key":"i","dt":31},{"key":"t","dt":120},{"key":" ","dt":128},{"key":"e","dt":528},{"key":"s","dt":327},{"key":"c","dt":200},{"key":"a","dt":104},{"key":"p","dt":183},{"key":"e","dt":89},{"key":" ","dt":126},{"key":"a","dt":359},{"key":"g","dt":130},{"key":"a","dt":85},{"key":"i","dt":97},{"key":"n","dt":62},{"key":".","dt":191},{"key":"Enter","dt":280},{"key":"T","dt":343},{"key":"h","dt":95},{"key":"e","dt":112},{"key":" ","dt":87},{"key":"d","dt":146},{"key":"a","dt":93},{"key":"t","dt":106},{"key":"a","dt":69},{"key":" ","dt":97},{"key":"w","dt":102},{"key":"i","dt":88},{"key":"l","dt":176},{"key":"l","dt":119},{"key":" ","dt":97},{"key":"t","dt":86},{"key":"h","dt":97},{"key":"e","dt":94},{"key":"n","dt":105},{"key":" ","dt":78},{"key":"b","dt":175},{"key":"e","dt":135},{"key":" ","dt":128},{"key":"w","dt":175},{"key":"r","dt":199},{"key":"i","dt":160},{"key":"t","dt":176},{"key":"t","dt":121},{"key":"e","dt":118},{"key":"n","dt":119},{"key":" ","dt":96},{"key":"t","dt":127},{"key":"o","dt":79},{"key":" ","dt":96},{"key":"t","dt":31},{"key":"h","dt":128},{"key":"e","dt":71},{"key":" ","dt":144},{"key":"c","dt":431},{"key":"o","dt":73},{"key":"n","dt":62},{"key":"s","dt":159},{"key":"o","dt":63},{"key":"l","dt":152},{"key":"e","dt":288},{"key":".","dt":176},{"key":"Enter","dt":617},{"key":"Enter","dt":615},{"key":"S","dt":342},{"key":"i","dt":168},{"key":"n","dt":79},{"key":"c","dt":145},{"key":"e","dt":190},{"key":" ","dt":208},{"key":"d","dt":320},{"key":"e","dt":183},{"key":"l","dt":135},{"key":"t","dt":97},{"key":"a","dt":78},{"key":" ","dt":79},{"key":"t","dt":168},{"key":"i","dt":47},{"key":"m","dt":64},{"key":"e","dt":47},{"key":"s","dt":160},{"key":" ","dt":143},{"key":"a","dt":47},{"key":"r","dt":72},{"key":"e","dt":95},{"key":" ","dt":72},{"key":"u","dt":135},{"key":"s","dt":72},{"key":"e","dt":111},{"key":"d","dt":144},{"key":",","dt":95},{"key":" ","dt":32},{"key":"i","dt":160},{"key":"t","dt":89},{"key":" ","dt":110},{"key":"i","dt":207},{"key":"s","dt":104},{"key":" ","dt":176},{"key":"e","dt":337},{"key":"a","dt":94},{"key":"s","dt":305},{"key":"y","dt":134},{"key":" ","dt":64},{"key":"t","dt":111},{"key":"o","dt":96},{"key":" ","dt":63},{"key":"i","dt":151},{"key":"n","dt":96},{"key":"s","dt":87},{"key":"e","dt":168},{"key":"r","dt":103},{"key":"t","dt":159},{"key":" ","dt":112},{"key":"m","dt":160},{"key":"i","dt":111},{"key":"s","dt":151},{"key":"s","dt":129},{"key":"i","dt":86},{"key":"n","dt":72},{"key":"g","dt":55},{"key":" ","dt":111},{"key":"c","dt":272},{"key":"h","dt":96},{"key":"a","dt":87},{"key":"r","dt":104},{"key":"s","dt":720},{"key":"Enter","dt":527},{"key":"a","dt":87},{"key":"n","dt":152},{"key":"d","dt":111},{"key":" ","dt":96},{"key":"t","dt":135},{"key":"o","dt":96},{"key":" ","dt":87},{"key":"f","dt":808},{"key":"i","dt":127},{"key":"x","dt":72},{"key":" ","dt":127},{"key":"a","dt":151},{"key":"n","dt":80},{"key":"y","dt":184},{"key":" ","dt":167},{"key":"t","dt":423},{"key":"y","dt":80},{"key":"p","dt":72},{"key":"o","dt":95},{"key":"s","dt":144},{"key":" ","dt":119},{"key":"b","dt":288},{"key":"y","dt":120},{"key":" ","dt":80},{"key":"d","dt":239},{"key":"i","dt":87},{"key":"r","dt":119},{"key":"e","dt":72},{"key":"c","dt":264},{"key":"t","dt":679},{"key":"l","dt":160},{"key":"y","dt":79},{"key":" ","dt":119},{"key":"e","dt":336},{"key":"d","dt":209},{"key":"i","dt":118},{"key":"t","dt":79},{"key":"i","dt":104},{"key":"n","dt":56},{"key":"g","dt":55},{"key":" ","dt":144},{"key":"t","dt":193},{"key":"h","dt":62},{"key":"e","dt":104},{"key":" ","dt":135},{"key":"d","dt":159},{"key":"a","dt":121},{"key":"t","dt":94},{"key":"a","dt":89},{"key":"!","dt":752},{"key":"Enter","dt":2197}]

let dataToPrint = demoData;
const KeysToIgnore = ['Shift'];

// For capturing
let timerStarted = false;
let timings = [];
let startTime;
let lastTime = 0;

// For Playback
let playBackSpeed = 3.0;
let currIdx = 0;
let playbackTimer = 0;
let aniLastTime = 0;
let cursorChar = '_';

window.setup = function() {
  createCanvas(windowWidth, windowHeight);
  WW = windowWidth;
  WH = windowHeight;

  noStroke();
  fill(255);
  textSize(40);
}

window.draw = function() {
  let deltaMS = (millis() - aniLastTime) * playBackSpeed;
  update(deltaMS);

  background(0);
  printText(dataToPrint, currIdx);

  aniLastTime = millis();
}

/*
 */
function update(dt) {
  playbackTimer += dt;

  if (currIdx >= dataToPrint.length) return;

  let el = dataToPrint[currIdx];
  if (playbackTimer >= el.dt) {
    playbackTimer -= el.dt;
    currIdx++;
  }
}

// keyTyped() doesn't register control keys, so use this instead
document.onkeydown = function(evt) {

  if (evt.key === 'Escape' && timerStarted === false) {
    playBackSpeed = 1;
    currIdx = 0;
    timings.length = 0;
    dataToPrint = timings;
    timerStarted = true;
  }
  // Output the user data!
  else if (evt.key === 'Escape' && timerStarted === true) {
    timerStarted = false;
    console.log('--- timing data ---');
    console.log(JSON.stringify(timings));
  }
  //
  else {
    if (keyIsIgnored(evt.key)) return;

    let dt;

    // Best if the first chart starts at time = 0
    if (timings.length === 0) {
      dt = 0;
    } else {
      dt = floor(millis() - lastTime);
    }
    lastTime = millis();


    str += evt.key;
    timings.push({ key: evt.key, dt: dt })
  }
};

function keyIsIgnored(key) {
  return KeysToIgnore.indexOf(key) > -1;
}

/*
  str - string to print out
  idx - up to this index
*/
function printText(str, idx) {
  push();
  translate(20, 50);

  let y = 0;
  let currLine = '';
  // construct the lines along with the metadata
  for (let i = 0; i < idx; i++) {

    if (str[i].key === 'Backspace') {
      currLine = currLine.substring(0, currLine.length - 1);
      // "asdf".substring(0, 2)
    }
    // Flush to a new line
    else if (str[i].key === 'Enter') {
      text(currLine, 0, y);
      y += TextHeight;
      currLine = '';
    }
    //
    else {
      currLine += str[i].key;
    }
  }

  text(currLine + cursorChar, 0, y);

  pop();
}

function isControlKey(evt) {

  switch (evt.key) {
    case 'Backspace':
    case 'Enter':
    case 'Shift':
      return true;
  }

  return evt.metaKey || evt.shiftKey;
}