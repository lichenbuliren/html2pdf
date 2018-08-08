/**
 * Create by maoshuchen
 * Date: 2017/10/27
 * Time: 上午11:20
 * Desc:
 */
var path = require('path');
var config = require('../gulp.config');
var gulp = require("gulp");
var babel = require("gulp-babel");
var guard = require('../lib/guard')();
var shell = require('shelljs');
var sequence = require('gulp-sequence');

gulp.task("clean-lib", function (cb) {
    shell.rm('-rf', path.join(config.dest, '/*'));
    cb();
});

gulp.task("babel-lib", function () {
    return gulp.src(config.src)
        .pipe(guard({ dest: config.dest}))
        .pipe(babel())
        .pipe(gulp.dest(config.dest));
});

gulp.task('build', sequence('clean-lib', 'babel-lib'));