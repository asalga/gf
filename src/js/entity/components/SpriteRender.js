'use strict';

import Component from './Component.js';
import Utils from '../../Utils.js';

/*
  We provide a layer to which the component renders to
*/
export default class SpriteRender extends Component {
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
  }

  draw() {
    this.drawProxy();
  }
}