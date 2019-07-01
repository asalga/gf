'use strict';

import Assets from '../../../assets/Assets.js';
import Entity from '../../gfEntity.js';

import SpriteRenderAni from '../../components/SpriteRenderAnimation.js';
// import SpriteAniDynamic from '../../components/SpriteAniDynamic.js';
import SlideBehaviour from '../../components/SlideBehaviour.js';

export default function createFunc() {
  let e = new Entity({ name: 'pacslider' });

  // [e.pos.x, e.pos.y] = [random(200,300), 200];

  let anims = Assets.get('pac_anim');
  let atlas = Assets.get('pac_atlas');

  e.updateProxy = function(dt) {
    // spriteRenderAni.play('blinky_right');
    // spriteRenderAni.play('blinky_left');
  };

  let slide = new SlideBehaviour(e, {});
  e.addComponent(slide);

  let spriteRenderAni = new SpriteRenderAni(e, {
    layerName: 'sprite',
    atlas: atlas,
    animations: anims,
    // animationTime: 10.3,
    // loop: false,
    // pingpong: false,
    currAnimation: 'blinky_right'
    // autoplay: false
  });
  e.addComponent(spriteRenderAni);

  return e;
}