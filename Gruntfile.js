module.exports = function (grunt) {

    // Configure grunt here
    

    var appConfig = {
      svgPath: 'app/images/svg',
      pngPath: 'app/images/png',
      tmpPath: '.tmp/images',
      outputPath: 'build',
      maxPngWidth: 200,
      maxPngheight: 200,
      retinaScale: 2
    };

    grunt.initConfig({

      config: appConfig,

    	svg2png: {
        all: {
            files: [
              { cwd: "<%= config.svgPath %>/", src: ["**/*.svg"], dest: "<%= config.tmpPath %>" }
            ]
        }
      },

      image_resize: {
        retina: {
          options: {
            width: "<%= config.maxPngWidth * config.retinaScale %>",
            height: "<%= config.maxPngheight * config.retinaScale %>",
            overwrite: true,
            upscale: false
          },
          src: "<%= config.tmpPath %>/*.png",
          dest: "<%= config.tmpPath %>/retina/"
        },
        normal: {
          options: {
            width: "<%= config.maxPngWidth %>",
            height: "<%= config.maxPngheight %>",
            overwrite: true,
            upscale: false
          },
          src: "<%= config.tmpPath %>/*.png",
          dest: "<%= config.tmpPath %>/normal/"
        }
      },

      copy: {
        core: {
          files: [{
            expand: true,
            dot: true,
            cwd: "app",
            dest: "<%= config.outputPath %>/",
            src: [
              '{,*/}*.html',
              '{,*/}*.css',
              '**/{,*/}*.svg'
            ],
            rename: function(dest, src) {
              return dest + src.replace('.png','@2x.png');
            }
          }]
        },
        retina: {
          files: [{
            expand: true,
            dot: true,
            cwd: "<%= config.tmpPath %>/retina",
            dest: "<%= config.outputPath %>/images/png/",
            src: [
              '{,*/}*.png'
            ],
            rename: function(dest, src) {
              return dest + src.replace('.png','@2x.png');
            }
          }]
        },
        normal: {
          files: [{
            expand: true,
            dot: true,
            cwd: "<%= config.tmpPath %>/normal",
            dest: "<%= config.outputPath %>/images/png/",
            src: [
              '{,*/}*.png'
            ]
          }]
        }
      },

      imagemin: {                    
        svg: {                       
          options: {                    
            optimizationLevel: 3,
            svgoPlugins: [{ removeViewBox: true }]
          },
          files: [{
            expand: true,             
            cwd: "<%= config.outputPath %>/images/svg/",               
            src: ['**/*.svg'],   
            dest: "<%= config.outputPath %>/images/svg/"            
          }]
        },
        png: {                        
          options: {                      
            optimizationLevel: 3,
          },
          files: [{
            expand: true,  
            cwd: "<%= config.outputPath %>/images/png/",                 
            src: ['**/*.png'], 
            dest: "<%= config.outputPath %>/images/png/"  
          }]
        },
      },

      clean: {
        build: ["<%= config.tmpPath %>"],
      },

      sass: {   
        options: {
          style: 'expanded'
        },                           
        dist: {                            
          files: {
            "<%= config.outputPath %>/styles/main.css": 'app/styles/main.sass'
          }
        }
      }

    });

    grunt.loadNpmTasks('grunt-svg2png');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-image-resize');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    grunt.registerTask('default', ['imagemin:svg', 'svg2png', 'image_resize', 'copy', 'imagemin:png', 'clean', 'sass:dist']);
}