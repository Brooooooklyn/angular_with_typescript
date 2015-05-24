'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload();

var path = {
  'jsapp': './app/**/*.ts',
  'testapp': './test/spec/**/*.ts'
};

gulp.task('compile', function () {
  return gulp.src(path.jsapp)
    .pipe($.sourcemaps.init())
    .pipe($.typescript({
      out: 'app.js'
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function () {
  return gulp.src('./dist')
    .pipe($.rimraf());
});

gulp.task('build-test', function () {
  return gulp.src(path.testapp)
    .pipe($.sourcemap.init())
    .pipe($.concat('spec.js'))
    .pipe(gulp.dest('./test/'));
});


gulp.task('default', $.sequence('clean', 'compile'));
