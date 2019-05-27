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
    currAnimation {String}
*/
export default class SpriteAniDynamic extends Component {
  
  constructor(e, cfg) {
    super(e, 'spriterender');
    this.cfg = cfg;
    this.reset();

    this._frames;
  }

  reset() {
    this.renderable = true;
    this.visible = true;
    this.opacity = 1;
    this.layer = this.cfg && this.cfg.layer || 0;
    Utils.applyProps(this, this.cfg);

    this.dirty = true;

    this.frame = 0;
    this.idx = 0;
  }

  /*
    s - scalar value
  */
  routeFrame(s) {
    console.log(this.entity.distance)
    this._frames = this.animations[this.currAnimation].frames;
    this.idx = Math.floor(s/10 % this._frames.length)
    return this.atlas.get(this._frames[this.idx]);
  }

  draw(p) {
    let img = this.routeFrame(this.entity.distance.x);
    p.image(img, this.entity.pos.x, this.entity.pos.y);
    this.drawProxy && this.drawProxy();
  }

  update(dt) {}
}