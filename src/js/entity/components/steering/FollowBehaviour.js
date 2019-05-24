'use strict';

import Component from '../Component.js';
import Utils from '../../../Utils.js';
import Pool from '../../../core/Pool.js';

export default class FollowBehaviour extends Component {

  /*
    cfg
      cursor | Entity
  */
  constructor(e, cfg) {
    super(e, 'follow');

    this.acc = Pool.get('vec2');
    this.targetPos = Pool.get('vec2');
    this.toTarget = Pool.get('vec2');
    this.desired = Pool.get('vec2');
    this.steer = Pool.get('vec2');

    let defaults = {
      // speed: 100.5,
      maxSpeed: 200,
      maxSteering: 1
    };
    Utils.applyProps(this, defaults, cfg);
  }

  update(dt, entity) {
    if (this.target === 'cursor') {
      this.targetPos.set(mouseX, mouseY);
    } else {
      this.targetPos.set(this.target.pos.x, this.target.pos.y);
    }

    this.seek();

    this.entity.vel.add(this.acc);

    if(this.entity.vel.length() > this.maxSpeed){
      this.entity.vel.normalize();
      this.entity.vel.mult(this.maxSpeed);
    }

    this.acc.mult(0);
  }

  applyForce(a){
    this.acc.add(a);
  }

  seek() {
    this.toTarget.set(this.targetPos.x - this.entity.pos.x, this.targetPos.y - this.entity.pos.y);

    this.desired.set(this.toTarget);
    this.desired.normalize();
    this.desired.mult(this.maxSpeed);

    this.steer.set(this.desired.x - this.entity.vel.x, this.desired.y - this.entity.vel.y);

    if(this.steer.length() > this.maxSteering){
      this.steer.normalize();
      this.steer.mult(this.maxSteering);
    }

    this.applyForce(this.steer);
  }

  free(){
    debugger;
  }

  indicateRemove(){
    Pool.free(this.acc);
    Pool.free(this.targetPos);
  }
}