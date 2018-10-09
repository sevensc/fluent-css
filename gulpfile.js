'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var gzip = require('gulp-gzip');
var gulpif = require('gulp-if');
var sourcemaps = require('gulp-sourcemaps');
var log = require('fancy-log');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var del = require('del');

gulp.task('sass', ['sass:clean'], function () {
    var output = getPath();
    var watch = getParam("watch");
    var maps = getParam("sourcemaps");
    var zip = getParam("gzip");
    var compress = getParam("compress");
    var filename = getParam("filename");

    var forcedEnding;
    var endings = [".css", ".scss"];
    if (!filename) {
        filename = "fluent-css";
    }
    else if (filename.indexOf(".scss") > -1) {
        filename = filename.replace(".scss", "");
        forcedEnding = ".scss";
    }
    else if (filename.indexOf(".css") > -1) {
        filename = filename.replace(".css", "");
        forcedEnding = ".css";
    }

    if (compress != "false") {
        compress = "compressed";
    }

    if (watch) {
        gulp.start("sass:watch")
    }

    var packagesArray = getPackages();
    var sourcemapsOutput = output;
    if (sourcemapsOutput.indexOf('./') == 0) {
        sourcemapsOutput = "." + sourcemapsOutput;
    }
    else if (sourcemapsOutput.indexOf('../') == 0) {
        sourcemapsOutput = "./" + output.replace("../", "");
    }

    for (var i = 0; i < endings.length; i++) {
        var tempFileName = filename + endings[i];

        if (zip && endings[i] == ".css") {
            gulp.src(packagesArray)
                .pipe(concat('concat.txt'))
                .pipe(sass({ outputStyle: compress }).on('error', sass.logError))
                .pipe(rename(filename + ".css"))
                .pipe(gzip())
                .pipe(gulp.dest(output));
        }
        
        gulp.src(packagesArray)
            .pipe(concat('concat.txt'))
            .pipe(gulpif(maps != "false" && endings[i] != ".scss", sourcemaps.init()))
            .pipe(sass({ outputStyle: compress }).on('error', sass.logError))
            .pipe(rename(tempFileName))
            .pipe(gulpif(maps != "false" && endings[i] != ".scss", sourcemaps.write(sourcemapsOutput)))
            .pipe(gulp.dest(output))
            .pipe(gulpif(forcedEnding == ".scss" && endings[i] != ".scss", clean({ read: false, force: true })))
            .pipe(gulpif(forcedEnding == ".css" && endings[i] != ".css", clean({ read: false, force: true })));
    }

    return;
});

gulp.task('sass:clean', function () {
    var shouldclean = getParam("clean");
    if (shouldclean == "false") {
        return;
    }

    var output = getPath();
    gulp.src(output + '/*.scss*').pipe(clean({ read: false, force: true }));
    return gulp.src(output + '/*.css*').pipe(clean({ read: false, force: true }));
});

gulp.task('sass:watch', () => gulp.watch('./**/*.scss', ['sass']));

var getPackages = function () {
    var packages = getParam("packages");

    if (!packages) {
        return ['fluent-css.scss']
    }

    var packagesArray = [];
    var splitted = packages.split(',');
    for (var i = 0; i < splitted.length; i++) {
        var current = splitted[i].trim();
        if (current.indexOf('.scss') < 0) {
            current += '.scss';
        }

        packagesArray.push(current);
    }

    return packagesArray;
}

var getPath = function () {
    var output = getParam('output');
    if (!output) {
        return './dist'
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