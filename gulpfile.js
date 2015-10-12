var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
  lazy: true,
});
var browserSync = require('browser-sync').create();
var poststylus = require('poststylus');

var koutoSwiss = require('kouto-swiss');
var nib = require('nib');
var rupture = require('rupture');
var del = require('del');
var pngquant = require('imagemin-pngquant');

gulp.task('csscomb', function() {
  return gulp.src('./public/css/*.css')
    .pipe($.csscomb())
    .pipe(gulp.dest('./public/css'));
});

// gulp.task('purify', function() {
//   return gulp.src('./dist/css/**/*.css')
//     .pipe($.purifycss(['./dist/js/*.js', './dist/**/*.html']))
//     .pipe(gulp.dest('./dist/css/'));
// });
//
// gulp.task('uncss', function() {
//   return gulp.src('./dist/css/**/*.css')
//     .pipe($.uncss({
//       html: ['./dist/**/*.html']
//     }))
//     .pipe(gulp.dest('./dist/css/'));
// });

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
  gulp.src('./public/*.jade')
    .pipe($.jade({
      pretty: true,
    }))
    .pipe(gulp.dest('./public/'));
});

gulp.task('imgmin', function() {
  return gulp.src('./public/ori_images/*')
    .pipe($.imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false,
      }, ],
      use: [pngquant()],
    }))
    .pipe(gulp.dest('./public/img/'));
});

gulp.task('stylus', function() {
  return gulp
    .src(
      ['./public/stylus/*.styl', '!./public/stylus/{_partial,_partial/**}', '!./public/stylus/{_const,_const/**}']
    )
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
    .pipe($.purifycss(['./public/js/*.js', './public/**/*.html']))
    .pipe($.sourcemaps.write('.', {
      sourceMappingURL: function(file) {
        return file.relative + '.map';
      }
    }))
    .pipe(gulp.dest('./public/css/'));

});

// dependencies tasks in order

gulp.task('clean', del.bind(null, ['dist']));

gulp.task('copyDist', ['clean'], function() {
  return gulp
    .src(['./public/**/*.*', '!./public/js/**/!(script.js)', '!./public/css/**/!(style.css)', '!./public/demo/**/*.jade', '!./public/demo/css/*styl'])
    .pipe(gulp.dest('dist'));
});

gulp.task('useref', ['copyDist'], function() {
  var assets = $.useref.assets();

  return gulp.src('./public/*.html')
    .pipe(assets)
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe(gulp.dest('./dist'));
});

gulp.task('minifyAll', ['useref'], function() {
  return gulp
    .src('./dist/**/*.*')
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe($.if('*.html', $.minifyHtml({
      conditionals: true,
      loose: true,
    })))

  // .pipe($.rename(function(path) {
  //   if (path.extname === '.js') {
  //     path.basename += '.min';
  //   }
  //   if (path.extnmae === '.css') {
  //     path.basename += '.min';
  //   }
  // }))
  .pipe(gulp.dest('dist'));
});

gulp.task('build', ['minifyAll'], function(cb) {
  del(['./dist/stylus', './dist/css/**.map', './dist/scss', './dist/ori_images', './dist/**.jade', './dist/partials'], cb);
  browserSync.init({
    server: './dist/',
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
    return gulp.src('./public/demo/index.jade')
      .pipe($.jade())
      .pipe(gulp.dest('./public/demo/'));
  });

  gulp.task('demoStylus', function() {
    return gulp.src('./public/demo/css/*.styl')
      .pipe($.stylus({
        compress: true,
      }))
      .pipe(gulp.dest('./public/demo/css/'));
  });

  // gulp.watch('public/scss/*.scss', ['compass']);
  gulp.watch('./public/demo/**/*.*', ['demoJade', 'demoStylus']);
  gulp.watch('./public/stylus/**', ['stylus']);
  gulp.watch('./public/css/*.css', ['csscomb']);
  gulp.watch('./public/**/*.jade', ['jade']);
  gulp.watch('./public/**/*.*').on('change', browserSync.reload);
});
