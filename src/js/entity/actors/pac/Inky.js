'use strict';

import Asset from '../../../assets/Assets.js';
import Entity from '../../Entity.js';
import SpriteRenderAni from '../../components/SpriteRenderAnimation.js';
import FollowBehaviour from '../../components/steering/FollowBehaviour.js';

export default function createInky() {
  let e = new Entity({ name: 'inky' });

  e.pos.x = 100;
  e.pos.y = 100;
  
  let a = new Asset();

  let img = a.get('image', 'node');
  let anims = a.get('animations', 'test');
  let atlas = a.get('atlas', 'pac');

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
    // target: scene.findEntity('ball'),
    maxSpeed: 50,
    maxSteering: random(0.1, 0.5)
  });

  e.addComponent(spriteRenderAni);
  e.addComponent(followBehaviour);

  return e;
}