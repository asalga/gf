'use strict';

import Component from './Component.js';
import Utils from '../../Utils.js';

/*
  We provide a layer to which the component renders to

  cfg:
    layerName {String}
    atlas {String}
    frames {Array}
    animationTime {Number}
    loop {Boolean}
    pingpong {Boolean}
*/
export default class SpriteRenderAnimation extends Component {
  constructor(e, cfg) {
    super(e, 'spriterender');
    this.cfg = cfg;
    this.reset();
  }

  reset() {
    this.renderable = true;
    this.visible = true;
    this.opacity = 1;
    this.layer = this.cfg && this.cfg.layer || 0;
    Utils.applyProps(this, this.cfg);

    this.dirty = true;
    this.sprite = this.cfg.cvs;

    this.frame = 0;
  }

  draw(p) {
    let frames = this.animations["ghost_walk"].frames;

    this.frame = (millis()*4 % 1000) < 500 ? 0 : 1;

    let img = this.atlas.get(frames[this.frame]);

    p.image(img, this.entity.pos.x, this.entity.pos.y);
    
    this.drawProxy && this.drawProxy();
  }

  update(dt) {
    // debugger;
  }

}