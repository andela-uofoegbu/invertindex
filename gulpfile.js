const gulp = require('gulp');
const browserSync = require('browser-sync').create();

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
  gulp.watch('.src/css/*.css', browserSync.reload);
  gulp.watch('index.html', browserSync.reload);
  gulp.watch('src/*.js', browserSync.reload);
});
