'use strict';

let dir = '../data';

export default {
  images: [{
      name: 'img',
      path: `${dir}/image/test.png`
    },
    {
      name: 'node',
      path: `${dir}/image/node.png`
    }
  ],

  animations: [{
    name: 'pac_anim',
    path: `${dir}/animations/pac.json`
  }],

  atlases: [{
    name: 'pac_atlas',
    imgPath: `${dir}/atlas/pac/pac.png`,
    metaPath: `${dir}/atlas/pac/pac.json`
  }]
};