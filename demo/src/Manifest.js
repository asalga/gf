'use strict';

let dir = '../data';

export default {
  images: [{
      name: 'img',
      path: `${dir}/test.png`
    },
    {
      name: 'node',
      path: `${dir}/node.png`
    }
  ],

  animations: [{
    name: 'test',
    path: `${dir}/animations/test.json`
  }],

  atlases: [{
    name: 'pac',
    imgPath: `${dir}/atlas/pac.png`,
    metaPath: `${dir}/atlas/pac.json`
  }]
};