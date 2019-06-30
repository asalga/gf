const scl = 20;

// use this to make circles overlap
const MAIN_SCALE = 1.25;
let y = 0;

let WW, WH;

let damping = 0.06;
let mx = 0, my = 0;
let mouseIsDown = false;

let gfx;
let images = [];
let curr = 0;

// prevent stalling the entire sketch, but also progressively draw the lines
let rowsPerFrame = 2;

function setup() {
	createCanvas(windowWidth, windowHeight);
	[WW, WH] = [windowWidth, windowHeight];
	background(0);
	newGfx();
}

function preload(){
	[0,1,2].forEach(i => {
		let fn = `${i}.png`;
		images[i] = loadImage(fn, function(_img){
			_img.loadPixels();
		});
	});
	
// 	img = loadImage('0.png', function(_img){
// 		_img.loadPixels();
// 		gfx = createGraphics(_img.width * scl, _img.height * scl);
// 		gfx.noStroke();
// 	});
}

function newGfx(){
	gfx = createGraphics(200 * scl, 200 * scl);
	gfx.noStroke();
}
function mousePressed(){
  y = 0;
	newGfx();
	
	curr++;
	if(curr > images.length-1){
		curr = 0;
	}
	
	mouseIsDown = true;
}

function mouseReleased(){
	mouseIsDown = false;
}

function draw() {
	if(images[curr].width === 0) return;
	
	if(y < images[curr].height){
		let idx;
		
		let img = images[curr];
	
		let targetY = y + rowsPerFrame;
		
		for(let row = y; row < targetY; row++, y++){
		
			if(row >= img.height) break;
			
			for(let x = 0; x < img.width; x++){
				idx = ((row * img.width) + x) * 4;
				let c = img.pixels[idx];
				let sz = map(c, 0, 255, 0, scl);

				gfx.fill(c);
				gfx.ellipse(x * scl, row * scl, sz * MAIN_SCALE, sz* MAIN_SCALE);
			}
		}
	}
	
	fill(0, 20);
	rect(0, 0, WW, WH);
	
	let dx = mouseX - mx;
	let vx = dx * damping;
	mx += vx;
	
	let dy = mouseY - my;
	let vy = dy * damping;
	my += vy;
	
	let tmx = map(mx, 0, WW, 0, -gfx.width/2);
	let tmy = map(my, 0, WH, 0, -gfx.height/2);
	
	image(gfx, tmx, tmy);
}