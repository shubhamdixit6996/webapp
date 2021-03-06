'use strict';

var gulp = require('gulp');

gulp.paths = {
  src: 'src',
  // REQUIRED FOR CORDOVA
  // dist: '../platforms/android/assets/www',
  // END
  // 
  // REQUIRED FOR WEBAPP
  dist: 'dist',
  // END
  tmp: '.tmp',
  e2e: 'e2e'
};

require('require-dir')('./gulp');

gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
