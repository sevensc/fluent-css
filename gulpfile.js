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
var copy = require('gulp-copy');
var config = {
    output: "./fluent-css",
    filename: "fluent-css",
    outputtype: "css",
    compress: true,
    gzip: true,
    sourcemaps: true,
    packages: [
        "fluent-css"
    ]
};


gulp.task('init', function () {
    return gulp
        .src(['./fluent-css.json'])
        .pipe(copy("../../", {}));
});

gulp.task('sass', ['sass:clean'], function () {
    var config = getConfig();

    var forcedEnding;
    var endings = [".css", ".scss"];
    if (!config.filename) {
        config.filename = "fluent-css";
    }
    else if (config.filename.indexOf(".scss") > -1) {
        config.filename = config.filename.replace(".scss", "");
        forcedEnding = ".scss";
    }
    else if (config.filename.indexOf(".css") > -1) {
        config.filename = config.filename.replace(".css", "");
        forcedEnding = ".css";
    }

    if (config.compress != "false") {
        config.compress = "compressed";
    }

    if (config.watch) {
        gulp.start("sass:watch");
    }

    var sourcemapsOutput = "../" + config.output;


    for (var i = 0; i < endings.length; i++) {
        var tempFileName = config.filename + endings[i];

        if (config.gzip && endings[i] == ".css") {
            gulp.src(config.packages)
                .pipe(concat('concat.txt'))
                .pipe(sass({ outputStyle: config.compress }).on('error', sass.logError))
                .pipe(rename(config.filename + ".css"))
                .pipe(gzip())
                .pipe(gulp.dest(config.output));

            log("created " + tempFileName + ".gz" + " successfuly to " + config.output);
        }

        gulp.src(config.packages)
            .pipe(concat('concat.txt'))
            .pipe(gulpif(config.maps != "false" && endings[i] != ".scss", sourcemaps.init()))
            .pipe(sass({ outputStyle: config.compress }).on('error', sass.logError))
            .pipe(rename(tempFileName))
            .pipe(gulpif(config.maps != "false" && endings[i] != ".scss", sourcemaps.write(sourcemapsOutput)))
            .pipe(gulp.dest(config.output))
            .pipe(gulpif(forcedEnding == ".scss" && endings[i] != ".scss", clean({ read: false, force: true })))
            .pipe(gulpif(forcedEnding == ".css" && endings[i] != ".css", clean({ read: false, force: true })));

        log("created " + tempFileName + " successfuly to " + config.output);
    }

    return;
});

gulp.task('sass:clean', function () {
    var shouldclean = getParam("clean");
    if (shouldclean === "false") {
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
        return [];
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
};

var getPath = function () {
    var jsonConfig = tryRequire('../../fluent-css.json');
    var output = getParam('output');
    if (jsonConfig && jsonConfig.output) {
        var tempConfig = jsonConfig;
        if (tempConfig.output.indexOf("./") === 0) {
            tempConfig.output = tempConfig.output.replace("./", "");
        }

        output = "../../" + tempConfig.output; // navigate from node_modules
    }

    if (!output) {
        return '../../fluent-css';
    }
    return output;
};

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
};

var tryRequire = function (filepath) {
    try {
        return require(filepath);
    }
    catch (e) {
        return null;
    }
};

var getConfig = function () {
    var jsonConfig = tryRequire('../../fluent-css.json');
    var output;
    if (jsonConfig) {
        config = jsonConfig;
        if (config.output) {
            config.output = "../../" + config.output; // navigate from node_modules
        }
        if (config.filename && config.outputtype) {
            config.filename += "." + config.outputtype;
        }
    }

    output = getParam('output');
    var watch = getParam("watch");
    var maps = getParam("sourcemaps");
    var zip = getParam("gzip");
    var compress = getParam("compress");
    var filename = getParam("filename");
    var packages = getPackages();

    if (output) {
        config.output = "../../" + output;
    }
    if (watch) {
        config.watch = watch;
    }
    if (maps) {
        config.maps = maps;
    }
    if (zip) {
        config.gzip = zip;
    }
    if (compress) {
        config.compress = compress;
    }
    if (filename) {
        config.filename = filename;
    }
    if (packages.length > 0) {
        config.packages = packages;
    }
    else if (config.packages) {
        var tempPackages = [];
        for (var i = 0; i < config.packages.length; i++) {
            var current = config.packages[i];
            if (current.indexOf(".scss") < 0) {
                tempPackages.push(current + ".scss");
            }
            else {
                tempPackages.push(current);
            }
        }
        config.packages = tempPackages;
    }

    if (config.output.indexOf("./") === 0) {
        config.output = config.output.replace("./", "");
    }

    return config;
};