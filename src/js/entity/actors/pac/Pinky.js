'use strict';

import Assets from '../../../assets/Assets.js';
import Entity from '../../Entity.js';
import SpriteRenderAni from '../../components/SpriteRenderAnimation.js';
import FollowBehaviour from '../../components/steering/FollowBehaviour.js';

export default function createPinky() {
  let e = new Entity({ name: 'pinky' });

  e.pos.x = 200;
  e.pos.y = 100;

  let anims = Assets.get('pac_anim');
  let atlas = Assets.get('pac_atlas');

  e.updateProxy = function(dt) {
    if(this.pos.x < mouseX)
      spriteRenderAni.play('pinky_right');
    else
      spriteRenderAni.play('pinky_left');
  };

  let spriteRenderAni = new SpriteRenderAni(e, {
    layerName: 'sprite',
    atlas: atlas,
    animations: anims,
    animationTime: 1,
    loop: true,
    pingpong: false,
    currAnimation: 'pinky_left'
  });
   
  // let wanderBehaviour = new wanderBehaviour(e, {});
  // let followBehaviour = new FollowBehaviour(e, {
  //   target: 'cursor',
  //   maxSpeed: 20,
  //   maxSteering: 1
  // });

  e.addComponent(spriteRenderAni);
  // e.addComponent(followBehaviour);

  return e;
}