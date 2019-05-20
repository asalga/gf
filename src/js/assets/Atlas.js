'use strict';

/*
  Atlas.js
  
  cfg{
    name,
    p5Img,
    meta - string
  }
*/
export default function Atlas(cfg) {
  Object.assign(this, cfg);
  this.frames = {};
  this.split();
}

Atlas.prototype = {
  get(str) {
    return this.frames[str];
  },

  split() {
    let sheetFramesObj = JSON.parse(this.meta)['frames'];

    let arr = Object.entries(sheetFramesObj);

    arr.forEach( (f, i) => {
      let filename = f[0];
      let frame = f[1].frame;

      // remove '.png' part of filename, we don't need it.
      let imgName = filename.split('.')[0];

      this.frames[imgName] = this.p5Img.get(frame.x, frame.y, 
                                            frame.w, frame.h);
    });
  }
};
