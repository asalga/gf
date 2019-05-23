'use strict';

import Component from '../Component.js';
import Utils from '../../../Utils.js';

export default class Killable extends Component {

  constructor(e, cfg) {
    super(e, 'killable');

    let defaults = {
      timeToDeath: 0
    };

    Utils.applyProps(this, defaults, cfg);

    this.entity.vel.set(random(-1, 1), random(-1, 1));
    this.entity.vel.normalize();
    this.entity.vel.mult(50);
  }

  update(dt, entity) {
    this.timer += dt;
    let r = this.entity.bounds.radius;

    if (this.entity.pos.x + r > 400) {
      this.entity.vel.x *= -1;
    }
    if (this.entity.pos.y + r > 400) {
      this.entity.vel.y *= -1;
    }

    if (this.entity.pos.y - r < 0) {
      this.entity.vel.y *= -1;
    }

    if (this.entity.pos.x - r < 0) {
      this.entity.vel.x *= -1;
    }
  }
}