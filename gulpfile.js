var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: true });
var browserSync = require('browser-sync').create();
var poststylus = require('poststylus');

var koutoSwiss = require('kouto-swiss');
var nib = require('nib');
var rupture = require('rupture');
var del = require('del');
var pngquant = require('imagemin-pngquant');

gulp.task('csscomb', function() {
  return gulp.src('public/css/*.css')
    .pipe($.csscomb())
    .pipe(gulp.dest('public/css'));
});

gulp.task('purify', function() {
  return gulp.src('dist/css/**/*.css')
    .pipe($.purifycss(['dist/js/*.js', 'dist/**/*.html']))
    .pipe(gulp.dest('dist/'));
});

// gulp.task('sass', function() {
//   return gulp
//     .src('public/scss/*.scss')
//     .pipe($.sass())
//     .pipe(gulp.dest('public/css/'))
//     .pipe(browserSync.stream());
// });

// gulp.task('compass', function() {
//   return gulp
//     .src('public/scss/*.scss')
//     .pipe($.compass({
//       config_file: 'config.rb',
//       css: 'public/css',
//       sass: 'public/scss'
//     }))
//     .pipe(gulp.dest('public/css/'))
//     .pipe(browserSync.stream());
// });

gulp.task('jade', function() {
  gulp.src('public/*.jade')
    .pipe($.jade({
      pretty: true,
    }))
    .pipe(gulp.dest('public/'));
});

gulp.task('imgmin', function() {
  return gulp.src('public/ori_images/*')
    .pipe($.imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
    }))
    .pipe(gulp.dest('public/img/'));
});

gulp.task('stylus', function() {
  return gulp
    .src('public/stylus/*.styl')
    .pipe($.sourcemaps.init())
    .pipe($.stylus({
      use: [

        //koutoSwiss(),
        //nib(),
        poststylus(['rucksack-css']),
        rupture(),
      ],
      'include css': true,

      // compress: true
    }))
    .pipe($.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie9', 'opera 11'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/css/'));

});

gulp.task('clean', del.bind(null, ['dist']));

gulp.task('html', ['clean'], function() {
  return gulp
    .src('public/**/*.*')
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', function() {
  browserSync.init({
    server: './public',
    ghostMode: {
      clicks: true,
      location: true,
      forms: true,
      scroll: true,
    },
  });

  gulp.task('demoJade', function() {
    return gulp.src('public/demo/index.jade')
      .pipe($.jade())
      .pipe(gulp.dest('public/demo/'));
  });

  gulp.task('demoStylus', function() {
    return gulp.src('public/demo/css/*.styl')
      .pipe($.stylus({compress: true}))
      .pipe(gulp.dest('public/demo/css/'));
  });

  gulp.watch('public/demo/**/*.*', ['demoJade', 'demoStylus']);
  gulp.watch('public/stylus/*.styl', ['stylus']);
  gulp.watch('public/css/*.css', ['csscomb']);
  gulp.watch('public/**/*.jade', ['jade']);

  // gulp.watch('public/scss/*.scss', ['compass']);
  gulp.watch('public/**/*.*').on('change', browserSync.reload);

});

gulp.task('build', ['html'], function(cb) {
  del(['dist/stylus', 'dist/css/**.map', 'dist/scss', 'dist/ori_images', 'dist/**.jade', 'dist/partials'], cb);
  browserSync.init({
    server: './dist/demo/',
    browser: ['google chrome', 'firefox', 'IExplore.exe'],
    notify: false,
    open: false,
    ghostMode: {
      clicks: true,
      location: true,
      forms: true,
      scroll: true,
    },
  });
});
