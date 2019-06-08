// A.Saga

// TODO: 
//		prevent circles from touching bounds
//		OR
// 		do checks with row above and below
//		add vignette
// 		iterate down over rows?

let maxAttempts = 10;

let circlesPerFrame = 200;
let minSize = 2;
let maxSize = 5;
let padding = 2;
let gfx;
let WW, WH;
let img, imageLoaded;
let viewportScale = 0.8;

let useGradient = true;
let gradient = [0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1];

let preventPointsInsideOtherCircles = false;
let rows;
let currRow = 0;
let numRows = 200;
let rowBounds;
let timer = 0;
let maxTimePerRow = 0.25;

let maxCirclesPerRow = 300;
let done = false;


function preload(){
	let imgName = 'i4.png';
	// let imgName = 'img.gif';
	img = loadImage(imgName, function(_img){
		imageLoaded = true;
		_img.loadPixels();
	});
}


function drawCenteredImage(gfx, _img, truncate){
	
	let h = (gfx.height / _img.height) * viewportScale;
	
	gfx.push();
	gfx.translate(WW/2, WH/2);
	gfx.scale(h,h);
	gfx.translate(-img.width/2, -img.height/2);
	gfx.image(img, 0, 0);
	gfx.pop();
}

function setup() {
  WW = windowWidth;
  WH = windowHeight;
	
	createCanvas(WW, WH);
	background(0);
	noiseSeed(100);
	
	gfx = createGraphics(WW, WH);

  reset();
}

function reset() {
  background(0);

	timer = 0;
	currRow = 0;
	noiseSeed(random(50,100));
	// maxCirclesPerRow = random(200, 400);
	// minSize = random(1, 5);
	// maxSize = minSize + random(0,5);
	// console.log(maxCirclesPerRow, minSize, maxSize);
	
	rows = new Array(numRows);
	for(let i = 0; i < rows.length; i++){
		rows[i] = [];
	}
	
	rowHeight = WW/numRows;
  bounds = {x: 0, y: 0, w: WW, h: rowHeight};
}

/*
*/
function createCircle() {
  let p = createVector();
	getRandomPointInRect(bounds, p);

  let shortestDistance = Infinity;
  let rad = minSize;
  
	// Make sure we didn't pick a point inside another circle
	let invalidSpot = true;
  let attempts = 0;
	if(preventPointsInsideOtherCircles){
		while (invalidSpot && attempts < maxAttempts) {

			// getRandomPoint(p);
			// getRandomPointInCircle(parent, p);
			getRandomPointInRect(bounds, p);

			attempts++;
			invalidSpot = false;

			for (let i = 0; i < rows[currRow].length; i++) {
				if (pointInCircle(p, rows[currRow][i])) {
					invalidSpot = true;
				}
			}
		}
		
		// Use this to prevent really long loops
		if (invalidSpot) {
			return;
		}
	}

  // If it's the first one
  if (rows[currRow].length === 0) {
    rad = minSize;
  } else {
    // find closest circle
    rows[currRow].forEach(c => {
      let d = distToCircle(c, p);
      if (d < shortestDistance) {
        shortestDistance = d;
        rad = d;
      }
    });
  }

	// Finally add the circle to our list
	rad = constrain(rad, minSize, maxSize);
  let c = new Circle({ pos: p, rad: rad });
	rows[currRow].push(c);
}

function draw() {
	if(!imageLoaded) { return; }
	if(done) { return; }
	
	drawCenteredImage(gfx, img, true);
	
	updateBounds(0.016);
	
  for (let i = 0; i < circlesPerFrame; i++) {
    createCircle();
  }

  push();
  noStroke();
	let circles = rows[currRow];
	rows[currRow].forEach(c=>c.draw());
	// stroke(25);
	// line(bounds.x, bounds.y, bounds.w, bounds.y);
  pop();
}

function canAddMore() {
  return rows[currRow].length <= maxCircles;
}

function updateBounds(dt) {
	timer += dt;

	if(rows[currRow].length >= maxCirclesPerRow || timer > maxTimePerRow ){
		timer = 0;
		bounds.y += rowHeight;
		
		currRow++;
		if(currRow >= rows.length-1){ 
			done = true;
		}
	}
}

function mousePressed() {
  reset();
}


let id = 0;

class Circle{
	constructor(cfg){
		this.pos = cfg.pos;
		this.rad = cfg.rad;
	}
	
	animate(){
	}
	
	update(dt){
	}
	
	draw(){		
		let x = this.pos.x;
		let y = this.pos.y;
		
		let col = gfx.get(x,y);
		
		if(useGradient){
			let idx = floor(map(col[0],0,255, 0, gradient.length-1));
			col[0] = col[1] = col[2] = gradient[idx] * 255;
		}
		
		let n = noise(x/1000, y/1000);
		if(n > 0.5){
			col[0] *= n * 50;
		}
		
		if(col[3] === 0 || (col[0]===0 && col[1] === 0 && col[2] === 0) ){
			return;
		}
		else{
			fill(col);
		}
		
		ellipse(this.pos.x, this.pos.y, this.rad, this.rad);
	}
}


function getRandomPointInCircle(c, p){
	let v = createVector(random(-1, 1), random(-1,1) * noise(p.x));
	v.normalize();
	v.mult(random(0, c.rad));
	p.x = v.x;
	p.y = v.y;
}

function getRandomPointInRect(b, p) {
  p.x = random(b.x, b.x + b.w);
  p.y = random(b.y, b.y + b.h);
}

function distToCircle(c, pos){
	return dist(c.pos.x, c.pos.y, pos.x, pos.y) - c.rad - padding;
}

function pointInCircle(pos, c){
  return dist(pos.x, pos.y, c.pos.x, c.pos.y) <= c.rad;
}
