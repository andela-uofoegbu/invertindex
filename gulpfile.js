const gulp = require('gulp'),
  connect = require('gulp-connect'),
  spawn = require('child_process').spawn;
const browserify = require('gulp-browserify');
const rename = require('gulp-rename');

const paths = {
  html_file: '*.html',
  stylesheet_file: '/css/*.css',
  test_file: 'jasmine/spec/inverted-index-test.js',
  source_file: 'src/*.js',
  javascript_file: ['src/inverted-index.js'],
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
  gulp.watch(paths.javascript_file, ['reloadServer']);
  gulp.watch(paths.html_file, ['reloadServer']);
  gulp.watch(paths.stylesheet_file, ['reloadServer']);
  gulp.watch(paths.source_file, ['reloadServer']);
  gulp.watch(paths.test_file, ['reloadServer']);
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
  gulp.watch(paths.test_file, ['testReload']);
});

gulp.task('testReload', () => {
  gulp.src(paths.specRunner)
    .pipe(connect.reload());
});

gulp.task('default', ['reloadServer', 'testWatch', 'testReload', 'serve',
  'watch']);
