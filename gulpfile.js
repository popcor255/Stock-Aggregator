const watch     = require('gulp-watch');
var gulp        = require('gulp');
var uglify      = require('gulp-uglify');
var pump        = require('pump');
var sass        = require('gulp-sass');
var minify      = require('gulp-minifier');
var connect     = require('gulp-connect');
var browserSync = require('browser-sync');

// Compile sass into CSS & auto-inject into browsers
gulp.task('scss', function() {
    return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', 'src/scss/*.scss'])
        .pipe(sass())
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Move the javascript files into our /src/js folder
gulp.task('js', function() {
    return gulp.src('src/*.js')
        .pipe(gulp.dest('src/js'));
});

gulp.task('minify', function() {
  return gulp.src(['src/**/*', '!src/scss', '!src/lib',  '!src/scss/*', '!src/lib/*', '!src/lib/**'],{base: './src'}).pipe(minify({
    minify: true,
    minifyHTML: {
      collapseWhitespace: true,
      conservativeCollapse: true,
    },
    minifyJS: {
      sourceMap: true
    },
    minifyCSS: true,
    getKeptComment: function (content, filePath) {
        var m = content.match(/\/\*![\s\S]*?\*\//img);
        return m && m.join('\n') + '\n' || '';
    }
  })).pipe(gulp.dest('var/www/'));
});


gulp.task('compress', function (cb) {
    pump([
          gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/tether/dist/js/tether.min.js']),
          uglify(),
          gulp.dest('src/js')
      ],
      cb
    );
  });



// Static Server + watching scss/html files
gulp.task('server', ['scss'], function() {
    
    browserSync.init({
        server: 'src'
    });

    gulp.watch('src/scss/*.scss', ['scss']);
    gulp.watch('src/js/*.js', browserSync.reload);
    gulp.watch('src/*.html').on('change', browserSync.reload);
});

gulp.task('built', function() {
    return connect.server({
        root: './var/www',
        port: 3000,
        fallback: 'index.html'
    });
});

//gulp debug
gulp.task('compile', [ 'js', 'server']);

//gulp build
gulp.task('build', ['compress', 'minify', 'built']);

//gulp default
gulp.task('default', ['compile']);