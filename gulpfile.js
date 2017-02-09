const gulp = require('gulp'),
  spawn = require('child_process').spawn;
const browserify = require('gulp-browserify');
const rename = require('gulp-rename');
const browsersync = require('browser-sync').create();
const testbrowsersync = require('browser-sync').create();

gulp.task('scripts', () => {
  gulp.src('jasmine/spec/inverted-index-test.js')
   .pipe(browserify())
   .pipe(rename('bundle.js'))
   .pipe(gulp.dest('jasmine/build'));
});

// watch
gulp.task('browser-sync', () => {
  browsersync.init({
    server: {
      baseDir: './',
      index: 'index.html'
    },
    port: process.env.PORT || 3000,
    ui: false,
    ghostMode: false
  });
});

gulp.task('browserSyncTest', ['scripts'], () => {
  testbrowsersync.init({
    server: {
      baseDir: ['.src/', './jasmine'],
      index: 'SpecRunner.html'
    },
    port: 5000,
    ui: false,
    ghostMode: false
  });
});

gulp.task('watchtest', ['browserSyncTest'], () => {
  gulp.watch(['.src/inverted-index.js',
    'jasmine/spec/inverted-index-test.js'], ['scripts']);
  gulp.watch(['.src/inverted-index.js',
    'jasmine/spec/inverted-index-test.js'], testbrowsersync.reload);
});

gulp.task('watch', ['browser-sync'], () => {
  gulp.watch('src/*.js', browsersync.reload);
  gulp.watch('css/*.css', browsersync.reload);
  gulp.watch('*.html', browsersync.reload);
});

// test
gulp.task('test', () => {
  spawn('node_modules/karma/bin/karma', ['start', '--single-run'], {
    stdio: 'inherit'
  }).on('close', process.exit);
});


gulp.task('default', ['browser-sync', 'browserSyncTest', 'watch', 'watchtest']);
