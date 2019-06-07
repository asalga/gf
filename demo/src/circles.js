let circles = [];
let speed = 2;
let WW, WH;
let bounds;
let maxAttempts = 10;
let maxCircles = 800;
let minSize = 4;
let maxSize = 40;
let padding = 0;
let parentSize;
let ar = 16 / 9;
let maxViewport;
let parent;
let dir = 1;

function getRandomPoint(p) {
  p.x = random(bounds.x, bounds.w);
  p.y = random(bounds.y, bounds.h);
}

function reset() {
  background(0);

	maxViewport = WH / 2 * 0.8;
  parentSize = maxViewport;
	parent = new Circle({pos:{x:0, y:0}, rad: 0.8});
	
  circles.length = 0;
  bounds = {
    // x:0, y:0, w:WW/4, h: WH/4
    x: 0,
    y: 0,
    w: 1,
    h: 1
  };
}

function createCircle() {
  let p = createVector();
  getRandomPoint(p);

  let shortestDistance = Infinity;
  let rad = minSize;
  let invalidSpot = true;
  let attempts = 0;

  // Make sure we didn't pick a point inside another circle
  while (invalidSpot && attempts < maxAttempts) {
    // getRandomPoint(p);
		getRandomPointInCircle(parent, p);
		
    attempts++;
    invalidSpot = false;

    for (let i = 0; i < circles.length; i++) {
      if (pointInCircle(p, circles[i])) {
        invalidSpot = true;
        circles[i].animate();
      }
    }
  }

  // Use this to prevent really long loops
  if (invalidSpot) {
    return;
  }

  // If it's the first one
  if (circles.length === 0) {
    rad = minSize;
  } else {
    // find closest circle
    circles.forEach(c => {
      let d = distToCircle(c, p);
      if (d < shortestDistance) {
        shortestDistance = d;
        rad = d;
      }
    });
  }

  if (rad < minSize) return;
  rad = rad > maxSize ? maxSize : rad;

  let c = new Circle({ pos: p, rad: rad });
  circles.push(c);
	c.animate();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  smooth();
  background(0);

  WW = windowWidth;
  WH = windowHeight;
	
	maxViewport = WW > WH ? WH : WW;

  reset();
}

function draw() {
  background(0);

  for (let i = 0; i < 10; i++) {
    if (circles.length < maxCircles) {
      createCircle();
    }
  }

  push();
  // translate(WW / 2 - bounds.w / 2, WH / 2 - bounds.h / 2);
  translate(WW/2, WH/2);

  noFill();
  stroke(255);
  circles.forEach(c => c.draw());

  updateBounds();

  // rect(bounds.x, bounds.y, bounds.w, bounds.h);
  pop();
	speed *= 1.01;
	
	
	if(parent.rad > maxViewport){
		parent.rad = maxViewport;
	}
	
	if(dir = 1 && parent.rad === maxViewport){
		// dir = -1;
		parent.rad = 0;
		minSize = 0;
	}
	else{
	  dir = 1;
	}
	
	if(dir === 1){
	  minSize += 0.00015;
		parent.rad += 1.83;
	}
	// else{
	// 	minSize -= 0.01;
	// 	parent.rad -= 0.05;
	// }
	minSize = constrain(minSize, 0, maxSize);
}

function canAddMore() {
  return circles.length < maxCircles;
}

function updateBounds() {
  if (!canAddMore()) return;
  bounds.y -= ar * speed;
  bounds.h += ar * speed;
  bounds.y = bounds.y < 0 ? 0 : bounds.y;
  bounds.h = bounds.h > WH ? WH : bounds.h;

  bounds.x -= ar * speed;
  bounds.w += ar * speed;
  bounds.x = bounds.x < 0 ? 0 : bounds.x;
  bounds.w = bounds.w > WW ? WW : bounds.w;
}

function mousePressed() {
  reset();
}



let id = 0;

class Circle{
	constructor(cfg){
		this.id = id;
		id++;
		this.pos = cfg.pos;
		this.rad = cfg.rad;
		this.col = 0;
		this.dist = dist(0,0,this.pos.x, this.pos.y);
		this.startTime = millis() * 1000;
	}
	animate(){
	  this.col = 1;
	}
	
	update(dt){
		this.col -= dt;
		this.col = this.col < 0 ? 0 : this.col;
	}
	
	draw(){
		this.col -= 0.01;
		//point(this.pos.x, this.pos.y);
		
		// stroke(100,255);
		// ellipse(this.pos.x+1, this.pos.y+1, this.rad*2, this.rad*2);
		
		// stroke(255, this.col * 255);
		fill(255, this.col * 255 );
		// stroke(255);
		let t = millis()/1000 * 6;
		let r = (sin( this.dist/maxViewport * 10 + t ) +1)/2;
		
		// let r = this.rad * 2;
		ellipse(this.pos.x, this.pos.y,  this.rad,  r *this.rad);
		ellipse(this.pos.x, this.pos.y, r * this.rad, this.rad);
		
		// push();
		// let theta = atan(this.pos.y/this.pos.x) / TAU;
		// translate(this.pos.x, this.pos.y);
		// rotate( (r + theta) * PI);
		// line(-this.rad/2, 0, this.rad /2, 0);
		// pop();
		
		// text(this.id, this.pos.x, this.pos.y);
	}
}

function getRandomPointInCircle(c, p){
	let v = createVector(random(-1, 1), random(-1,1) * noise(p.x));
	v.normalize();
	v.mult(random(0, c.rad));
	p.x = v.x;
	p.y = v.y;
}

function distToCircle(c, pos){
	return dist(c.pos.x, c.pos.y, pos.x, pos.y) - c.rad - padding;
}

function pointInCircle(pos, c){
  return dist(pos.x, pos.y, c.pos.x, c.pos.y) <= c.rad;
}
