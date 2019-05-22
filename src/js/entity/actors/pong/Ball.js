'use strict';

import Entity from '../../Entity.js';
import SpriteRender from '../../components/SpriteRender.js';
import BounceBehaviour from '../../components/pong/BounceBehaviour.js';
import Collidable from '../../components/Collidable.js';

import BoundingCircle from '../../../collision/BoundingCircle.js';
import CType from '../../../collision/CollisionType.js';

export default function createBall() {
  let e = new Entity({ name: 'ball' });

  e.pos.x = 300;
  e.pos.y = 300;

  let rad = 15;
  e.bounds = new BoundingCircle(e.pos, rad);

  e.updateProxy = function(dt) {};

  let spriteRender = new SpriteRender(e, { layerName: 'sprite' });
  spriteRender.draw = function(_p5) {
    _p5.fill(255, 0, 0);
    _p5.ellipse(this.entity.pos.x, this.entity.pos.y, rad * 2, rad * 2);
  };

  let bounceBehaviour = new BounceBehaviour(e, {});

  e.addComponent(spriteRender);
  e.addComponent(bounceBehaviour);

  return e;
}