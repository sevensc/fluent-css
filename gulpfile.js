'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var log = require('fancy-log');

gulp.task('sass', function () {
    var output = getpath(process.argv);
    return gulp.src('fluent-css.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(sourcemaps.write(output))
        .pipe(gulp.dest(output));
});

gulp.task('sass:clean', function () {
    var output = getpath(process.argv);
    return gulp.src(output + '*.css*').pipe(clean({ read: false, force: true }));
})

gulp.task('sass:watch', () => gulp.watch('./**/*.scss', ['sass:clean', 'sass']));

var getpath = function (cmdParams) {
    if (cmdParams[3] && cmdParams[3].indexOf('--output=') != -1) {
        return cmdParams[3].split('--output=')[1];
    }

    return './';
}