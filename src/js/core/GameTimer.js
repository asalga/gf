'use strict';

export default class GameTimer {
  constructor(deltaTime = 1 / 60) {
    this.deltaTime = deltaTime;
    let accumTime = 0;
    let lastTime = 0;
    let that = this;

    this.tick = function tick(time) {

      // deltaTime = (time - lastTime) / 1000.0;
      accumTime += (time - lastTime) / 1000.0;

      if(accumTime > 1){
        accumTime = deltaTime;
      }

      while (accumTime > deltaTime) {
        that.update(deltaTime);
        accumTime -= deltaTime;
      }

      // setTimeout(update, 1000/15);
      // setTimeout(update, 1000 / 1, performance.now());
      requestAnimationFrame(that.tick);
      lastTime = time;
    };
  }

  start() {
    this.tick(0);
  }
}