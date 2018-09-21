'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var log = require('fancy-log');

gulp.task('sass', ['sass:clean'], function () {
    var output = getPath(process.argv);
    var watch = getParam("watch");
    var maps = getParam("sourcemaps");

    if (watch) {
        gulp.start("sass:watch")
    }
    log(maps);
    if (maps == 'false') {
        return gulp.src('fluent-css.scss')
            .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
            .pipe(gulp.dest(output));
    }

    return gulp.src('fluent-css.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(sourcemaps.write(output))
        .pipe(gulp.dest(output));
});


gulp.task('sass:clean', function () {
    var output = getPath(process.argv);
    return gulp.src(output + '*.css*').pipe(clean({ read: false, force: true }));
})

gulp.task('sass:watch', () => gulp.watch('./**/*.scss', ['sass:clean', 'sass']));

var getPath = function (cmdParams) {
    var output = getParam('output');
    if (!output) {
        return './'
    }
    return output;
}

var getParam = function (param) {
    for (var i = 0; i < process.argv.length; i++) {
        var current = process.argv[i];
        var variable = '--' + param + '=';
        if (current.indexOf(variable) != -1) {
            var splitted = current.split(variable);
            return splitted[1] ? splitted[1] : true;
        }
        else if (current.indexOf(variable.replace('=', '')) != -1) {
            return true;
        }
    }

    return false;
}