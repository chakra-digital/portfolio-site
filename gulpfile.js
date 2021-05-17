var { src, dest, watch, series } = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var copy = require('gulp-copy');
var browsersync = require('browser-sync');
var del = require('del');
var surge = require('gulp-surge');

var deployUrl = 'chakra-digital.surge.sh';

var cleanDist = function (done) {
  del.sync('dist/');
  return done();
};

var buildStyle = function (done) {
  return src('src/scss/**/*.scss')
    .pipe(
      sass({
        outputStyle: 'expanded',
      })
    )
    .pipe(prefix())
    .pipe(dest('dist/css'));

  done();
};

var watchSrc = function (done) {
  watch('src/', series(exports.default, reloadBrowser));
  done();
};

var copyFiles = function (done) {
  return src(['src/**/*', '!src/scss/**']).pipe(dest('dist/'));
};

var startServer = function (done) {
  browsersync.init({
    server: {
      baseDir: './dist/',
    },
    browser: 'google chrome',
  });

  return done();
};

var deploy = function (done) {
  return surge({
    project: './dist',
    domain: deployUrl,
  });
};

var reloadBrowser = function (done) {
  browsersync.reload();
  done();
};

exports.default = series(cleanDist, buildStyle, copyFiles);

exports.watch = series(exports.default, startServer, watchSrc);

exports.deploy = series(exports.default, deploy);
