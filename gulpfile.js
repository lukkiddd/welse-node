var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    nodemon = require('gulp-nodemon'),
    path = require('path');

var paths = {
    src: ['site/**/*.js'],
    dest: 'site',
    sourceRoot: path.join(__dirname, 'site')
}

gulp.task('babel', function () {
    return gulp.src(paths.src)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015','es2017'],
            plugins: ['transform-object-rest-spread']
        }))
        .pipe(sourcemaps.write('.', { sourceRoot: paths.sourceRoot }))
        .pipe(gulp.dest(paths.dest));
});

gulp.task('nodemon', function () {
    nodemon({
        script: 'site\\bin\\www',
        // script: 'site/bin/www',
        ext: 'es6 jade sass js',
        ignore: ['*.map'],
        tasks: ['babel']
    })
    .on('restart', function () {
        console.log('restarted!');
    })
});

gulp.task('build', ['babel']);

gulp.task('default', ['build']);