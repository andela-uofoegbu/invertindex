const gulp = require('gulp'),
  connect = require('gulp-connect'),
  browse

const paths = {
  jsFiles: ['./src/inverted-index.js'],
  htmlFiles: '*.html',
  cssFiles: 'public/css/*.css',
  scriptFiles: 'public/js/*.js',
};

// serve
gulp.task('server', () => {
  const options = {
    root: './',
    livereload: true,
    port: process.env.PORT || 3000
  };

  connect.server(options);
});

// reload
gulp.task('reloadServer', () => {
  gulp.src(['*.html', 'css/*.css', 'src/*.js'])
    .pipe(connect.reload());
});

// test
gulp.task('test', () => {
  spawn('node_modules/karma/bin/karma', ['start', '--single-run'], {
    stdio: 'inherit'
  }).on('close', process.exit);
});




gulp.task('default', ['reloadServer', 'server']);
