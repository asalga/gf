'use strict';

// import Pool from './core/Pool.js';
import Circle from './collision/Circle.js';
import Rectangle from './collision/Rectangle.js';
import Utils from './Utils.js';
import QuadTree from './collision/QuadTree.js';

let r, c, qt, e1, e2;
let WW, WH;



class Entity {
  constructor(cfg) {
    Object.assign(this, cfg);
    this.vel = createVector(random(-100, 100), random(-100, 100));
    this.intersecting = false;
  }

  draw() {
    strokeWeight(1);
    stroke(255, 0, 0);

    if (this.intersecting) {
      fill(0, 255, 0);
    } else {
      noFill();
    }

    ellipse(this.x, this.y, this.r * 2);
  }

  update(dt) {
    this.x += this.vel.x * dt;
    this.y += this.vel.y * dt;

    if (this.x < 0) this.vel.x *= -1;
    if (this.y < 0) this.vel.y *= -1;

    if (this.x > width) this.vel.x *= -1;
    if (this.y > height) this.vel.y *= -1;
  }
}




window.preload = function() {
  console.log('preload');
};

window.setup = function() {
  createCanvas(400, 400);
  // WW = windowWidth;
  // WH = windowHeight;
  WW = width;
  WH = height;

  r = new Rectangle({ x: 0, y: 0, w: 100, h: 150 });
  c = new Circle({ x: 100, y: 100, r: 20 });

  qt = new QuadTree({ w: WW, h: WH, depth: 4 });

  e1 = new Entity({ x: 100, y: 100, r: 30 });
  e2 = new Entity({ x: 100, y: 200, r: 30 });

  qt.insert(e1);
  qt.insert(e2);
};

function update(dt) {
  qt.update(dt);
}

window.draw = function() {
  update(0.016);

  background(100);

  // fill(100);
  // stroke(255);
  // rect(r.x, r.y, r.w, r.h);

  // if (Utils.isCircleInsideRect(c, r)) {
  // if (Utils.isPointInsideRect(c, r)) {
  // if (Utils.isCircleIntersectingRect(c, r)) {
  //   fill(255);
  // } else {
  //   fill(0);
  // }
  // ellipse(c.x, c.y, c.r * 2);

  qt.debugDraw();
  qt.draw();
};


// PImage ghost1, ghost2;
// QuadTree quadTree;
// QuadTree.Node root;

// void restart() {
//   numSprites = StartSpriteCount;
//   setupQuadTree(1);

//   timer = new Timer();
//   perfTimer = new Timer();
//   updateHUDTimer = new Timer();

//   r = new Rectangle(root.x, root.y, root.w, root.h);
//   camPos = new PVector(root.w/2 - width/2, root.h/2 - height/2);
// }

// void setupQuadTree(int depth) {
//   quadTree = new QuadTree();
//   quadTree.create(width * 4, height * 4, depth);
//   quadTree.setDebug(debugOn);
//   root = quadTree.getRoot();

//   for (int i = 0; i < numSprites; i++) {
//     Ghost g = new Ghost();
//     g.pos.x = random(0, root.w); 
//     g.pos.y = random(0, root.h);
//     quadTree.addSprite(g);
//   }

//   // Add one to center to user has idea of what's going on
//   Ghost g = new Ghost();
//   g.pos.x = root.w/2;
//   g.pos.y = root.h/2;
//   quadTree.addSprite(g);
//   numSprites++;

// }

// void draw() {
//   update();

//   background(0);

//   pushMatrix();
//   translate(-camPos.x, -camPos.y);
//   quadTree.draw();
//   popMatrix();

//   if (mousePressed && timer.isPaused() == false) {
//     if (numSprites < MaxSprites) {

//       int x = int(mouseX + camPos.x);
//       int y = int(mouseY + camPos.y);

//       if (Utils.isPointInRect(new PVector(x, y), r)) { 
//         Sprite s = new Ghost();
//         // Prevent the sprite from leaving the quadtree
//         s.pos.x = x;
//         s.pos.y = y;
//         quadTree.addSprite(s);
//         numSprites++;
//       }
//     }
//   }

//   int x = 20;
//   // Drawing the debug lines for the quadtree 
//   fill(0, 255, 0);
//   textFont(fpsFont);
//   text("FPS:" + floor(frameRate), x, 20);
//   text("Sprites: " + numSprites, x, 60);
//   text("Collisions Tests " + numTests, x, 80);
//   text("QuadTree Depth: " + quadTree.getDepth(), x, 100);
//   text("Update Time (ms): " + updateTime, x, 120);
// }

// /*

//  */
// public class Ghost extends Sprite {  

//   private float speed = 50.0f;

//   public Ghost() {
//     pos.x = 0;
//     pos.y = 0;
//     circleBounds.r = 0;

//     setRadius(SpriteSize / 2);

//     dir = new PVector(random(-1, 1), random(-1, 1));
//     // force moving along x
//     dir.x *= 2.0f;

//     dir.normalize();
//   }

//   public void setRadius(float r) {
//     if (r > 0) {
//       circleBounds.r = r;
//     }
//   }

//   public void update(float delta) {
//     if (hasUpdated) {
//       return;
//     }
//     hasUpdated = true;

//     QuadTree.Node root = quadTree.getRoot();

//     pos.x += dir.x * delta * speed;
//     pos.y += dir.y * delta * speed;

//     if (pos.x + circleBounds.r >= root.w && dir.x > 0) {
//       dir.x *= -1;
//     }

//     else if (pos.x - circleBounds.r < root.x && dir.x < 0) {
//       dir.x *= -1;
//     }

//     if (pos.y - circleBounds.r < root.y && dir.y < 0) {
//       dir.y *= -1;
//     }

//     else if ( pos.y + circleBounds.r >= root.h && dir.y > 0) {
//       dir.y *= -1;
//     }

//     circleBounds.x = pos.x;
//     circleBounds.y = pos.y;
//   }

//   /*
//    */
//   public void draw() {
//     renderCallCount++;

//     if (renderCallCount < quadrantCount) {
//       return;
//     }

//     pushMatrix();
//     translate(pos.x, pos.y);

//     if (dir.x < 0) {
//       scale(-1, 1);
//     }

//     image(isIntersecting ? ghost2 : ghost1, 0, 0);

//     // Outline circle is too expensive, just leave it out
//     /*if (debugOn) {
//      stroke(255, 0, 0);
//      noFill();
//      ellipse(0, 0, circleBounds.r*2, circleBounds.r*2);
//      }*/
//     popMatrix();

//     // Draw number of nodes this sprite is inside
//     //fill(255, 0, 0);
//     //text(quadrantCount, pos.x, pos.y);
//     clearStates();
//   }
// }