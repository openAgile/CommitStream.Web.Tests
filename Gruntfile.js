module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var es6Files = {
    expand: true,
    cwd: 'src',
    src: ['**/*.js'],
    dest: 'lib',
    ext: '.js'
  };

  grunt.initConfig({
    babel: {
      options: {
        babelrc: true
      },
      dist: {
        files: [es6Files]
      },
    },
    watch: {
      babel: {
        files: ['src/*.js'],
        tasks: ['babel']
      }
    }

  });

  grunt.registerTask('default', ['babel']);

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.event.on('watch', function(action, filepath) {
    es6Files.src = [filepath];
    es6Files.cwd = '';
    grunt.config('babel.dist.files', [es6Files]);
  });
};