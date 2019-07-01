'use strict';

import Component from './Component.js';
import Utils from '../../Utils.js';
import Pool from '../../core/Pool.js';
import cfg from '../../cfg.js';
// import setupKB from '../../input/kb.js';
import KeyboardState from '../../input/KeyboardState.js';

export default class SlideBehaviour extends Component {

  /*
    cfg
      - vel
  */
  constructor(e, cfg) {
    super(e, 'slide');

    this.test = Pool.get('vec2');

    let defaults = {
      speed: 350
    };
    Utils.applyProps(this, defaults, cfg);

    let input = new KeyboardState();
    input.addMapping('ArrowRight', (k) => {
      this.slideRight();
    });

    input.addMapping('ArrowLeft', (k) => {
      this.slideLeft();
    });

    input.listenTo(window);

    // input.addMapping('space', function(){
    //   e.vel.x = 10;
    //    this.slideRight();
    // })
    // input.listenTo(window);

    // let input = setupKB(e);
    // input.listenTo(window);
    // input = setupKB(e);
  }

  update(dt, entity) {
    this.stayInViewport();
  }

  stayInViewport() {
    let e = this.entity;

    if (e.pos.x < 0 && e.vel.x < 0) {
      e.vel.x = 0;
      e.pos.x = 0;
    }
    if (e.pos.x > cfg.gameWidth - 32 && e.vel.x > 0) {
      e.vel.x = 0;
    }
  }

  slideRight() {
    this.entity.vel.x = this.speed;
  }
  slideLeft() {
    this.entity.vel.x = -this.speed;
  }

  slideUp() {}

  slideDown() {}

  free() {
    debugger;
  }

  indicateRemove() {
    Pool.free(this.test);
  }
}