'use strict';


function loadImage(url){
	return new Promise( (resolve) => {
		let img = new Image();
		img.addEventListener( 'load', () => {
			resolve(img);
			// return img;
		});
		img.src = url;
	});
}

const cvs = document.getElementById('cvs');
const ctx = cvs.getContext('2d');

// ctx.fillRect(0,0,30,30);

loadImage('data/images/user/coptop.png')
.then( img =>{
	ctx.drawImage(img, 0, 0, 31, 25, 10, 10, 31,25);	
});









// let Assets = require('./Assets');
// let p5 = require('p5');

// let assets;
// let debug = false;
// let paused = true;

// let _p5;

// let now = 0,
//   lastTime = 0,
//   gameTime = 0;


// function update(dt) {
//   if (paused) {
//     return;
//   }

//   gameTime += dt;
// }

// function render() {}

// var newp5 = new p5(function(p) {
//   _p5 = p;

//   p.setup = function setup() {
//     let cvs = p.createCanvas(640, 400);
//     cvs.parent('sketch-container');
//     p.frameRate(30);
//   };

//   /*
//    */
//   p.preload = function() {
//     assets = new Assets(p);
//     assets.preload();
//   };

//   /*
//     TODO:fix timing
//    */
//   p.draw = function() {
//     if (!assets.isDone()) {
//       return;
//     }

//     now = p.millis();
//     let delta = now - lastTime;

//     update(delta);
//     render();

//     // drawDebug();
//     // drawUI();

//     lastTime = now;
//   };
// }, "#cvs");