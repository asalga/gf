'use strict';

import Assets from '../../../assets/Assets.js';
import Entity from '../../Entity.js';
import SpriteRenderAni from '../../components/SpriteRenderAnimation.js';

import StayInBounds from '../../components/steering/StayInBoundsBehaviour.js';
import SeparateBehaviour from '../../components/steering/SeparateBehaviour.js';

export default function createPinky() {
  let e = new Entity({ name: 'pinky' });

  e.pos.x = random(30, 200);
  e.pos.y = random(30, 300);

  let anims = Assets.get('pac_anim');
  let atlas = Assets.get('pac_atlas');

  e.updateProxy = function(dt) {
    if (this.vel.x > 0)
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

  let separateBehaviour = new SeparateBehaviour(e, {
    minDistance: 32
  });
  
  let stayInBounds = new StayInBounds(e, {
    steerMag: 2,
    maxSpeed: 100,
    bounds: { x: 32, y: 32, w: scene.gameWidth - 64, h: scene.gameHeight - 64 }
  });

  e.addComponent(separateBehaviour);
  e.addComponent(spriteRenderAni);
  e.addComponent(stayInBounds);

  return e;
}