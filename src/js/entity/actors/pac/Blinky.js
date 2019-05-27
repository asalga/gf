'use strict';

import Assets from '../../../assets/Assets.js';
import Entity from '../../Entity.js';

// import SpriteRenderAni from '../../components/SpriteRenderAnimation.js';
import SpriteAniDynamic from '../../components/SpriteAniDynamic.js';
import FollowBehaviour from '../../components/steering/FollowBehaviour.js';
import StayInBoundsBehaviour from '../../components/steering/StayInBoundsBehaviour.js';

export default function createBlinky() {
  let e = new Entity({ name: 'blinky' });

  e.pos.x = random(30, 200);
  e.pos.y = random(30, 300);


  let anims = Assets.get('pac_anim');
  let atlas = Assets.get('pac_atlas');

  e.updateProxy = function(dt) {
    // if(this.pos.x < mouseX)
    //   spriteRenderAni.play('blinky_right');
    // else
    //   spriteRenderAni.play('blinky_left');
  };

  // let spriteRenderAni = new SpriteRenderAni(e, {
  //   layerName: 'sprite',
  //   atlas: atlas,
  //   animations: anims,
  //   animationTime: 1,
  //   loop: true,
  //   pingpong: false,
  //   currAnimation: 'blinky_left',
  //   autoplay: false
  // });

  let spriteAniDynamic = new SpriteAniDynamic(e, {
    layerName: 'sprite',
    atlas: atlas,
    animations: anims,
    currAnimation: 'blinky_left',
    autoplay: false
  });
   
  let followBehaviour = new FollowBehaviour(e, {
    target: 'cursor',
    maxSpeed: 150,
    maxSteering: 2
  });

 let stayInBounds = new StayInBoundsBehaviour(e, {
    steerMag: 3,
    maxSpeed: 150,
    bounds: { x: 32, y: 32, w: scene.gameWidth - 64, h: scene.gameHeight - 64 }
  });

  e.addComponent(stayInBounds);
  // e.addComponent(spriteRenderAni);
  e.addComponent(spriteAniDynamic);
  e.addComponent(followBehaviour);

  return e;
}