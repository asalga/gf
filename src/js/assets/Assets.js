'use strict';

// const Howler = require('Howler');
// const Howl = require('Howler').Howl;
// import manifest from './Manifest.js';


import Atlas from './Atlas.js';

let instance;

export default function Assets(manifest) {

  if (instance) {
    return instance;
  }

  instance = this;
  this.cbCalled = false;
  this.cb = function() {};

  this.assetTypes = {
    'image': {},
    'atlas': {},
    'animations': {},
    'audio': {},
    'json': {},
    'shaders': {}
  };

  this.numAssetsLoaded = 0;
  this.totalAssetsToLoad = 0;

  // Count how many we need to load so we can compare as we load the assets
  let assetsToLoad = Object.values(manifest);
  assetsToLoad.forEach(assetType => {
    this.totalAssetsToLoad += assetType.length;
  });

  /*
   */
  this.preload = function(cb) {
    this.cb = cb;

    if (this.checkIfDone()) {
      return;
    }

    let that = this;

    //
    //
    // ** ATLASES
    //
    if (manifest.atlases) {
      manifest.atlases.forEach(a => {

        loadImage(a.imgPath, function(atlasImg) {
          // Once the image is loaded, get the meta file
          let xhr = new XMLHttpRequest();
          xhr.onload = function() {
            let atlas = new Atlas({
              name: a.name,
              p5Img: atlasImg,
              meta: xhr.responseText
            });

            that.assetTypes['atlas'][a.name] = atlas;
            that.numAssetsLoaded++;

            that.checkIfDone();
            console.log('Asset: loaded atlas: ', a.name);
          };
          xhr.open('GET', a.metaPath);
          xhr.send();
        });
      });
    }

    //
    //
    // ** AUDIO
    //
    // manifest.audio.forEach(v => {

    //   let h = new Howl({
    //     src: v.path,
    //     volume: 1,
    //     loop: false,
    //     autoplay: false,
    //     onload: v => {
    //       that.numAssetsLoaded++;
    //     }
    //   });

    //   // that.audio[v.path] = h;
    //   that.assetTypes['audio'][v.name] = h;
    // });

    //
    //
    // ** SHADERS
    //
    if (manifest.shaders) {
      manifest.shaders.forEach(j => {
        let n = j.name;

        let v = fetch(j.vert)
          .then(function(res) {
            return res.text().then(function(shaderSource) {
              return { name: n, src: shaderSource };
            })
          });

        let f = fetch(j.frag)
          .then(function(res) {
            return res.text().then(function(shaderSource) {
              return { name: n, src: shaderSource };
            })
          });

        Promise.all([v, f]).then(function(shaders) {
          let n = shaders[0].name;
          that.assetTypes['shaders'][n] = {
            vert: shaders[0].src,
            frag: shaders[1].src
          };

          that.checkIfDone();
          console.log('Asset: loaded shader: ', n);
          that.numAssetsLoaded++;
        });

      });
    }

    //
    //
    // ** GENERIC GAME SPECIFIC JSON
    //
    if (manifest.json) {
      manifest.json.forEach(j => {
        let n = j.name;

        fetch(j.path)
          .then(function(response) {
            return response.json().then(data => {
              return {
                n: j.name,
                json: data
              }
            });
          })
          .then(function(data) {
            that.numAssetsLoaded++;
            that.assetTypes['json'][data.n] = data.json;

            that.checkIfDone();
            console.log('Asset: loaded json: ', j.name);
          });
      });
    }

    //
    // ** ANIMATION
    //
    if (manifest.animations) {
      manifest.animations.forEach(j => {
        let n = j.name;

        fetch(j.path)
          .then(function(response) {
            return response.json().then(data => {
              return {
                n: j.name,
                animations: data
              }
            });
          })
          .then(function(data) {
            that.numAssetsLoaded++;
            that.assetTypes['animations'][data.n] = data.animations;

            that.checkIfDone();
            console.log('Asset: loaded animation: ', j.name);
          });
      });
    }

    // ** IMAGES **
    if (manifest.images) {
      manifest.images.forEach(v => {
        loadImage(v.path, p5img => {
          // that.images[v] = p5img;
          that.numAssetsLoaded++;
          that.assetTypes['image'][v.name] = p5img;

          that.checkIfDone();
          console.log('Asset: loaded image: ', v.name);
        });
      });
    }

  };

  /*
  */
  this.checkIfDone = function() {

    if (this.numAssetsLoaded === this.totalAssetsToLoad && this.cbCalled === false) {
      this.cbCalled = true;
      this.cb();
    }

    return this.numAssetsLoaded === this.totalAssetsToLoad;
  };

  /*
    Should find a better way of deciding which object to peek in.
   */
  this.get = function(...args) {

    if (args.length === 2) {
      let type = args[0];
      let k = args[1];
      return this.assetTypes[type][k];
    }
  };

};