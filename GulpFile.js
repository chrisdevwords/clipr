'use strict';

var gulp        = require('gulp');
var watch       = require('gulp-watch');
var browserify  = require('gulp-browserify');
var minify      = require('gulp-minify');
var sass        = require('gulp-sass');



// Rerun the task when a file changes

gulp.task('buildcss', function () {
    return gulp.src('./public/styles/sass/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/styles/dist/'));
});

gulp.task('buildjs', function() {
  var stream = gulp.src('./public/scripts/src/main.js', {read: false})
    .pipe(browserify())
    .pipe(minify())
    .pipe(gulp.dest('public/scripts/dist/'));
  return stream;
});

gulp.task('buildassets', ['buildjs', 'buildcss']);

// The default task (called when you run `gulp` from cli)
//gulp.task('default', ['buildassets']);

gulp.task('default', function () {
    gulp.watch('./public/styles/sass/*.scss', ['buildcss']);
    gulp.watch('./public/scripts/src/*.js', ['buildjs']);    
});