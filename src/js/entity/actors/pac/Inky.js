'use strict';

import Assets from '../../../assets/Assets.js';
import Entity from '../../Entity.js';

import SpriteRenderAni from '../../components/SpriteRenderAnimation.js';
import WanderBehaviour from '../../components/steering/WanderBehaviour.js';
import StayInBoundsBehaviour from '../../components/steering/StayInBoundsBehaviour.js';

export default function createInky() {
  let e = new Entity({ name: 'inky' });

  e.pos.x = random(30, 200);
  e.pos.y = random(30, 300);

  let anims = Assets.get('pac_anim');
  let atlas = Assets.get('pac_atlas');

  e.updateProxy = function(dt) {};

  let spriteRenderAni = new SpriteRenderAni(e, {
    layerName: 'sprite',
    atlas: atlas,
    animations: anims,
    animationTime: 1,
    loop: true,
    pingpong: false,
    currAnimation: 'inky_left'
  });

  let wander = new WanderBehaviour(e, {});

  let stayInBounds = new StayInBoundsBehaviour(e, {
    steerMag: 3,
    maxSpeed: 150,
    bounds: { x: 32, y: 32, w: scene.gameWidth - 64, h: scene.gameHeight - 64 }
  });

  e.addComponent(stayInBounds);
  e.addComponent(wander);
  e.addComponent(spriteRenderAni);

  return e;
}