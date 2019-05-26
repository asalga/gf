'use strict';

import Assets from '../../../assets/Assets.js';
import Entity from '../../Entity.js';
import SpriteRenderAni from '../../components/SpriteRenderAnimation.js';
import FollowBehaviour from '../../components/steering/FollowBehaviour.js';

export default function createInky() {
  let e = new Entity({ name: 'inky' });

  e.pos.x = 100;
  e.pos.y = 100;

  let anims = Assets.get('pac_anim');
  let atlas = Assets.get('pac_atlas');

  e.updateProxy = function(dt) {};

  let spriteRenderAni = new SpriteRenderAni(e, {
    layerName: 'sprite',
    atlas: atlas,
    animations: anims,
    animationTime: 1,
    loop: true,
    pingpong: false
  });
   
  let followBehaviour = new FollowBehaviour(e, {
    target: 'cursor',
    maxSpeed: 50,
    maxSteering: 2
  });

  e.addComponent(spriteRenderAni);
  e.addComponent(followBehaviour);

  return e;
}