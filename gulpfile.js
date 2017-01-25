const gulp = require('gulp'),
  connect = require('gulp-connect'),
  spawn = require('child_process').spawn;
const browserify = require('gulp-browserify');
const rename = require('gulp-rename');

const paths = {
  jsFiles: ['src/inverted-index.js'],
  htmlFiles: '*.html',
  cssFiles: '/css/*.css',
  scriptFiles: 'src/*.js',
  testFiles: 'jasmine/spec/inverted-index-test.js',
  specRunner: 'jasmine/specRunner.html'
};

gulp.task('scripts', () => {
  gulp.src('jasmine/spec/inverted-index-test.js')
   .pipe(browserify())
   .pipe(rename('bundle.js'))
   .pipe(gulp.dest('jasmine/build'));
});

// serve
gulp.task('serve', () => {
  const options = {
    root: './',
    livereload: true,
    port: process.env.PORT || 3000
  };

  connect.server(options);
});

// watch
gulp.task('watch', () => {
  gulp.watch(paths.jsFiles, ['reloadServer']);
  gulp.watch(paths.htmlFiles, ['reloadServer']);
  gulp.watch(paths.cssFiles, ['reloadServer']);
  gulp.watch(paths.scriptFiles, ['reloadServer']);
});

// reload
gulp.task('reloadServer', () => {
  gulp.src(['*.html', 'public/css/*.css', 'public/js/*.js', 'src/*.js'])
    .pipe(connect.reload());
});

// test
gulp.task('test', () => {
  spawn('node_modules/karma/bin/karma', ['start', '--single-run'], {
    stdio: 'inherit'
  }).on('close', process.exit);
});

gulp.task('testWatch', () => {
  gulp.watch(paths.testFiles, ['testReload']);
});

gulp.task('testReload', () => {
  gulp.src(paths.specRunner)
    .pipe(connect.reload());
});

gulp.task('default', ['reloadServer', 'testWatch', 'testReload', 'serve', 'watch']);
