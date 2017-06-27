var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

gulp.task('scss', function () {
    return gulp.src('./scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', '> 5%'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('js', function() {
    return gulp.src('./js/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('build.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./js/min'));
});

// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('watch', function () {
    browserSync.init({
        proxy: "workshop.dev"
    });

    gulp.watch('./scss/**/*.scss', ['scss']);
    gulp.watch('./js/*.js', ['js-watch']);
    gulp.watch('./**/*.php').on('change', browserSync.reload);
});