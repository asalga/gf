'use strict';

import Assets from '../../../assets/Assets.js';
import Entity from '../../Entity.js';
import SpriteRenderAni from '../../components/SpriteRenderAnimation.js';
import FollowBehaviour from '../../components/steering/FollowBehaviour.js';

export default function createBlinky() {
  let e = new Entity({ name: 'blinky' });

  e.pos.x = 100;
  e.pos.y = 100;

  let anims = Assets.get('pac_anim');
  let atlas = Assets.get('pac_atlas');

  e.updateProxy = function(dt) {
    if(this.pos.x < mouseX)
      spriteRenderAni.play('blinky_right');
    else
      spriteRenderAni.play('blinky_left');
  };

  let spriteRenderAni = new SpriteRenderAni(e, {
    layerName: 'sprite',
    atlas: atlas,
    animations: anims,
    animationTime: 1,
    loop: true,
    pingpong: false,
    currAnimation: 'blinky_left'
  });
   
  let followBehaviour = new FollowBehaviour(e, {
    target: 'cursor',
    maxSpeed: 50,
    maxSteering: 0.5
  });

  e.addComponent(spriteRenderAni);
  e.addComponent(followBehaviour);

  return e;
}