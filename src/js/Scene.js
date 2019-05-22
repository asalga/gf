'use strict';

import EventSystem from './event/EventSystem.js';
import Event from './event/Event.js';

// import EntityFactory from './entity/EntityFactory.js';
import bk from './entity/actors/decorations/BK.js';

import Vec2 from './math/Vec2.js';
import cfg from './cfg.js';
import Utils from './Utils.js';
import Assert from './core/Assert.js';

export default class Scene {

  constructor() {
    this.entities = new Set();
    this.user = null;
    this.restartGameCallback = function(){};

    this.entitiesAddedOrRemovedDirty = false;
    this.deleteQueue = [];
    this.eventsToFireNextFrame = [];
  }

  update(dt) {

    // We can't fire events while we are iterating of the 
    // objects being removed, it breaks everything.
    this.eventsToFireNextFrame.forEach(e => e.fire());
    Utils.clearArray(this.eventsToFireNextFrame);

    // Seems like this is the best place for this flag to be turned on.
    if (this.deleteQueue.length > 0) {
      this.entitiesAddedOrRemovedDirty = true;

      // let the children do any cleanup.
      this.deleteQueue.forEach(e => {
        new Event({ evtName: 'death', data: e }).fire();

        // The seekTarget relies on this event and tries to get a new 
        // target. but if the entity is still alive, it may return
        // a target that will be removed next frame.
        let rm = new Event({ evtName: 'remove', data: e });

        this.eventsToFireNextFrame.push(rm);
      });

      this.deleteQueue.forEach(e => {
        this.entities.delete(e);
      });

      // Allow the entities to do any cleanup
      this.deleteQueue.forEach(e => e.indicateRemove());

      Utils.clearArray(this.deleteQueue);
    }

    this.entities.forEach(e => e.update(dt));
  }

  clearFlags() {
    this.entitiesAddedOrRemovedDirty = false;
  }

  add(e) {
    this.entities.add(e);
    this.entitiesAddedOrRemovedDirty = true;
    new Event({ evtName: 'entityadded', data: e }).fire();
  }

  restartGame() {
    this.entities.clear();
    this.deleteQueue = [];

    this.restartGameCallback();
    // let kblistener = EntityFactory.create('keyboardlistener');

    // this.add(EntityFactory.create('audioeventlistener'));

    // this.add(EntityFactory.create('background'));
    
    // this.add(EntityFactory.create('ui'));
  }

  remove(e) {
    Assert(e);

    for (let i = 0; i < this.deleteQueue.length; i++) {
      if (e === this.deleteQueue[i]) {
        continue;
        // TODO: Entities are being put in this list more than once
      }
    }

    this.deleteQueue.push(e);
    // this.entitiesAddedOrRemovedDirty = true;
  }

  getUser() {
    return this.user;
  }
}