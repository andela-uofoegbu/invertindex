const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload();

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: './',
    },
    port: 3000,
    ghostMode: false
  });
});


gulp.task('default', ['browserSync']);
gulp.task('watch', () => {
  gulp.watch('.src/css/*.css').on('change', reload);
  gulp.watch('index.html').on('change', reload);
  gulp.watch('src/*.js').on('change', reload);
});
