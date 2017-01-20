let gulp = require('gulp');
let browserSync = require('browser-sync').create();
let sass = require('gulp-sass');
let reload = browserSync.reload;

gulp.task('serve', ['sass'], () => {
  browserSync.init({
    server: "./"
  });

  gulp.watch("css/*.css", ['sass']);
  gulp.watch(["index.html", "src/*.js"]).on('change', reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', () => {
  return gulp.src("css/*.css")
        .pipe(sass())
        .pipe(gulp.dest("css"))
        .pipe(reload({stream: true}));
});

gulp.task('default', ['serve']);
