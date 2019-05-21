'use strict';

import Entity from '../Entity.js';
// import EntityFactory from '../EntityFactory.js';

import KBListener from '../components/KBListener.js';

import Debug from '../../debug/Debug.js';


export default function createEmpty() {
  
  let e = new Entity({ name: 'empty' });

  e.updateProxy = function(dt) {};

  return e;
}