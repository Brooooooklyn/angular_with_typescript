'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var phantomjs = require('phantomjs');
var merge2 = require('merge2');

var path = {
  'jsapp': './app/**/*.ts',
  'libs': [
            './bower_components/lodash/lodash.js',
            './node_modules/chai-spies/chai-spies.js'
          ],
  'jstest': [
              './test/spec/scope/digest',
              './test/spec/scope/watchgroup',
              './test/spec/scope/inherit'
            ]
};


function buildtest() {
  var dir = path.jstest;
  var teststream = [];
  for (var index = 0; index < dir.length; index++) {
    var element = dir[index];
    var jsstream = gulp.src(element + '/*.js');
    var startstream = gulp.src(element + '/*.start');
    var endstream = gulp.src(element + '/*.end');
    var buildstream = merge2(
      startstream,
      jsstream,
      endstream
    ).pipe($.concat('spec.js'));
    teststream.push(buildstream);
  }
  
  return teststream;
}

gulp.task('compile', function () {
  return gulp.src(path.jsapp)
    .pipe($.sourcemaps.init())
    .pipe($.typescript({
      out: 'app.js'
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build-lib', function () {
   return gulp.src(path.libs)
    .pipe($.concat('lib.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function () {
  return gulp.src(['./dist', './test/spec.js'])
    .pipe($.rimraf());
});

gulp.task('build-test', function () {
  return merge2(
    gulp.src('./test/spec/*/*.start'),
    buildtest(),
    gulp.src('./test/spec/*/*.end')
  )
  .pipe($.concat('spec.js'))
  .pipe(gulp.dest('./test/'));
});

gulp.task('test', ['build-test'], function () {
  browserSync({
    notify: false,
    port: 9002,
    server: {
      baseDir: ['test', 'dist'],
      routes: {
        '/dist': 'dist',
        '/bower_components': 'bower_components',
        '/node_modules': 'node_modules'
      }
    }
  });
  
  gulp.watch('app/**/*.ts', ['compile']);
  gulp.watch('test/spec/**/*.js', ['build-test']);

  // watch for changes
  gulp.watch([
    'test/*.html',
    'src/**/*.ts',
    'test/spec/**/*.js'
  ]).on('change', reload);

});


gulp.task('default', $.sequence('compile' , 'build-lib', 'test'));
