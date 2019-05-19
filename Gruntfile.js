'use strict';

/*
 */
module.exports = function(grunt) {

  const LivereloadPort = 35729;
  const ServeStatic = require('serve-static');

  // for printing to console
  const Colors = {
    red: `"\x1B[91m"`,
    pink: `"\x1B[35m"`,
    default: `"\x1B[39m"`
  };

  // directories
  const src = 'src';
  const tmp = '.tmp';
  const app = 'app';
  const lib = 'src/libs';
  const basePath = 'src/sketches/';

  let config = {
    // load by default if we can't find the target
    target: `src/`,
    library: 'p5js-0.6',
    bundleMethod: 'copy:js'
  };

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    /** 
     * Delete all working directories and contents
     */
    clean: {
      build: {
        src: [
          `${app}`,
          `${tmp}`
        ]
      }
    },

    /**
     * 
     */
    sass: {
      dev: {
        options: {
          style: 'nested',
          sourcemap: 'auto',
          update: true
        },
        files: [{
          dest: `${app}/css/style.css`,
          src: `src/css/scss/style.scss`
        }]
      }
      // dist: {
      //   options: {
      //     style: 'compressed',
      //     sourcemap: 'none'
      //   },
      //   files: [{
      //     dest: `${dist}/assets/css/style.min.css`,
      //     src: `${config.dir}/src/scss/style.scss`
      //   }]
      // }
    },

    /**
     * Connect port/livereload
     * https://github.com/gruntjs/grunt-contrib-connect
     */
    connect: {
      options: {
        port: 9000,
        hostname: '*'
      },
      livereload: {
        options: {
          middleware: function(connect, options) {
            return [
              ServeStatic(`${app}`),
              connect().use(`${app}`, ServeStatic(`${app}`)),
              ServeStatic(`${app}`)
            ]
          }
        }
      }
    },

    /**
     *
     */
    concat: {
      dev: {
        dest: `${app}/index.js`,
        src: `${src}/*.js`
      },
      options: {}
    },

    /**
     *
     */
    copy: {

      // bundle method
      js: {
        files: [{
          expand: true,
          cwd: `${src}`,
          src: 'js/**/*.js',
          dest: `${app}/`,
          filter: 'isFile'
        }]
      },

      dev: {
        files: [
          // MARKUP
          {
            expand: true,
            cwd: `demo/`,
            src: 'index.html',
            dest: `${app}/`,
            filter: 'isFile'
          },
          // STYLE
          {
            expand: true,
            cwd: `demo/css/`,
            src: '*.css',
            dest: `${app}/`,
            filter: 'isFile'
          },
          // DEMO JS
          {
            expand: true,
            cwd: `demo/src/`,
            src: '*.js',
            dest: `${app}/js`,
            filter: 'isFile'
          },
          // DEMO LIBS
          {
            expand: true,
            cwd: `demo/libs/`,
            src: '*.js',
            dest: `${app}/libs`,
            filter: 'isFile'
          },



          // DATA
          {
            expand: true,
            cwd: `${src}/data`,
            src: '**/*.json',
            dest: `${app}/data/`,
            filter: 'isFile'
          },
          // JS LIBS
          {
            expand: true,
            cwd: `${lib}`,
            src: '*.js',
            dest: `${app}/libs`,
            filter: 'isFile'
          },
          // AUDIO
          {
            expand: true,
            flatten: false,
            cwd: `${src}/data/audio`,
            src: ['**/*.{mp3,ogg}'],
            dest: `${app}/data/audio`,
            filter: 'isFile'
          },

          // IMAGES
          {
            expand: true,
            flatten: false,
            cwd: `${src}/data/`,
            src: ['**/*.{jpg,jpeg,png,gif,svg}'],
            dest: `${app}/data/`,
            filter: 'isFile'
          },

          // SHADERS
          {
            expand: true,
            flatten: false,
            cwd: `${src}/data/`,
            src: ['**/*.glsl'],
            dest: `${app}/data/`,
            filter: 'isFile'
          }
        ]
      }
    },

    /**
     * 
     */
    browserify: {
      dev: {
        files: [{
          dest: `${app}/dev_bundle.js`,
          src: `${src}/js/index.js`
        }],
        options: {
          mangle: false
        }
      }
    },


    /**
     * https://github.com/gruntjs/grunt-contrib-jshint
     * options inside .jshintrc file
     */
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },

      files: [
        `${src}/js/**/*.js`,
        `${src}/json/**/*.js`,
        `!${src}/js/vendor/**/*.js`
      ]
    },

    /**
     *  https://www.npmjs.com/package/grunt-processhtml
     *
     *  process <!-- build:include --> directives
     */
    processhtml: {
      dev: {
        options: {
          process: true,
          data: config,
          strip: true,
        },
        files: [{
          src: `${src}/index.html`,
          dest: `${app}/index.html`
        }]
      }
    },

    /**
     * https://github.com/gruntjs/grunt-contrib-watch
     *
     */
    watch: {
      options: {
        spawn: true,
        livereload: true
      },
      scripts_dev: {
        files: [
          `${src}/**/*.js`
        ],
        tasks: [
          'copy:dev',
          'bundle'
        ],
        options: {
          livereload: true
        }
      },
      // AUDIO
      audio: {
        files: [
          `${src}/data/**/*.{mp3,ogg}`
        ],
        tasks: [
          'copy:dev'
        ],
        options: {
          livereload: true
        }
      },
      // IMAGES
      images: {
        files: [
          `${src}/data/**/*.{png,jpg,jpeg,gif,svg}`
        ],
        tasks: [
          'copy:dev'
        ],
        options: {
          livereload: true
        }
      },
      // DATA
      data: {
        files: [
          `${src}/data/**/*.{json,glsl}`
        ],
        tasks: [
          'copy:dev'
        ],
        options: {
          livereload: true
        }
      },
      // STYLE
      style: {
        files: [
          `demo/css/style.css`
        ],
        tasks: [
          'copy:dev'
        ],
        options: {
          livereload: true
        }
      },
      // MARKUP
      markup: {
        files: [
          `demo/index.html`
        ],
        tasks: [
          'copy:dev'
        ],
        options: {
          livereload: true
        }
      }
    }
  });

  /*
    TODO: make this more intuitive
  */
  grunt.registerTask('bundle', function() {
    grunt.task.run(`${config.bundleMethod}`);
  });

  grunt.registerTask('default', [
    // STATIC ASSETS
    'copy:dev',

    // JS
    'bundle',
    // 'jshint',

    // HTML
    // 'processhtml',

    // LIVE UPDATES / PREVIEW
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('prod', [
    'copy:dev',
    'bundle'
  ]);

};