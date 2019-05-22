'use strict';

import Entity from '../../Entity.js';
import SpriteRender from '../../components/SpriteRender.js';

export default function createBall() {
  let e = new Entity({ name: 'ball' });

  e.updateProxy = function(dt) {};

  let spriteRender = new SpriteRender(e, { layerName: 'sprite' });

  spriteRender.draw = function(_p5) {
    _p5.fill(255, 0, 0);
    _p5.ellipse(this.entity.pos.x, this.entity.pos.y, 30, 30);
  };

  e.addComponent(spriteRender);

  return e;
}




// export default function createMouse() {

//   e.bounds = new BoundingCircle(e.pos, 10);

//   let setRandPosition = function(entity) {
//     let r = Vec2.rand().mult(400);

//     // just so they all don't all arrive at the user at the same time
//     let deviate = Vec2.rand().normalize().mult(20);

//     let v = new Vec2(p3.width / 2, p3.height / 2);
//     v.add(r).add(deviate);
//     entity.pos.set(v.x, v.y);
//   };
//   setRandPosition(e);

//   let sz = e.bounds.radius;
//   let spriteRender = new SpriteRender(e, { layerName: 'sprite' });

//   spriteRender.draw = function(_p3) {
//     let sz = e.bounds.radius;
//     _p3.save();
//     _p3.noStroke();
//     _p3.fill(14, 202, 238);
//     // _p3.translate(this.p3.width / 2, this.p3.height / 2);
//     _p3.ellipse(this.entity.pos.x, this.entity.pos.y, sz, sz);
//     _p3.restore();
//     // _p3.drawImage(this.sprite, 0, 0);
//   };
//   e.addComponent(spriteRender);

//   e.addComponent(new GoToTarget(e, {
//     target: scene.getUser(),
//     speed: 80,
//     hasArrived: function(data) {
//       // if (data.self !== this) { return; }
//       // setRandPosition(e);
//     }
//   }));

//   e.addComponent(new Killable(e));
//   e.addComponent(new ScorePoints(e, { points: 100 }));
//   e.addComponent(new Stun(e, { multiplier: 5 }));
//   e.addComponent(new Health(e, { amt: 2 }));
//   e.addComponent(new HealthRender(e, { layer: 200 }));
//   e.addComponent(new MeleePayload(e, { damage: 20 }));
//   e.addComponent(new Collidable(e, { type: CType.ENEMY, mask: CType.PLAYER | CType.PLAYER_BULLET }));
//   e.addComponent(new Targetable(e));

//   return e;
// }