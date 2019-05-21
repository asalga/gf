'use strict';

let id = -1;

export default class Utils {
  static getEl(selector) {
    return document.getElementById(selector);
  }
  static noop() {}

  static getId() {
    return ++id;
  }

  static get undef() {
    return undefined;
  }

  /*
    Returns Array
  */
  static strIntersection(str1, str2){
    let setB = new Set(str2);
    let res = [...new Set(str1)].filter( x => setB.has(x));
    return res;
  }

  static removeDuplicateChars(string) {
    return string
      .split('')
      .filter((item, pos, self) => {
        return self.indexOf(item) == pos;
      })
      .join('');
  }

  static applyProps(ctx, def, cfg) {

    Object.keys(def).forEach(k => {
      // if (ctx[k]) {
      // console.log(`${ctx[k]} already exists. Overwriting`);
      // }
      ctx[k] = def[k];
    });

    if (cfg) {
      Object.keys(cfg).forEach(k => {
        // if (ctx[k]) {
        // console.log(`${ctx[k]} already exists. Overwriting`);
        // }
        ctx[k] = cfg[k];
      });
    }
  }

  // playing around with perf testing
  // .length = [] vs allocating new array
  static clearArray(arr) {
    window.clearArrayCalls++;
    // arr = [];
    arr.length = 0;
  }

  // this is shit
  static removeFromArray(arr, el) {
    let idx = -1;
    for (let i = arr.length - 1; i > -1; --i) {
      if (el === arr[i]) {
        idx = i;
        break;
      }
    }

    if (idx === -1) {
      return false;
    }

    arr.splice(idx, 1);
    return true;
  }
}