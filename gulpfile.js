var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    webserver = require('gulp-webserver'),
    scss = require('gulp-sass');

var src = './process',
    app = './builds/app';

/*
gulp.task('es6', () => {
    return gulp.src( './node_modules/react-sortable-tree/dist/main.js' )
        .pipe(babel({
            presets: ['react']
        }))
        .pipe(gulp.dest(src + '/js'));
});
*/

gulp.task('js', function() {
  return gulp.src( src + '/js/app.js' )
    .pipe(browserify({
      transform: 'reactify',
      debug: true
    }))
    .on('error', function (err) {
      console.error('Error!', err.message);
    })
    .pipe(gulp.dest(app + '/js'));
});

gulp.task('html', function() {
  gulp.src( app + '/**/*.html');
});

gulp.task('scss', function() {
    gulp.src(app + '/scss/**/*.scss')
        .pipe(scss().on('error', scss.logError))
        .pipe(gulp.dest(app + '/css/'));
});

gulp.task('css', function() {
    gulp.src( app + '/css/*.css');
});

gulp.task('watch', function() {
  gulp.watch( src + '/js/**/*.js', ['js']);
  gulp.watch( app + '/scss/*.scss', ['scss']);
  gulp.watch( app + '/css/**/*.css', ['css']);
  gulp.watch([ app + '/**/*.html'], ['html']);
});

gulp.task('webserver', function() {
    gulp.src(app + '/')
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});

gulp.task('default', ['watch', 'html', 'js', 'scss', 'css', 'webserver']);
