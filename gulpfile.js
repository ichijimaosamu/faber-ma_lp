var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browser = require('browser-sync');
var aigis = require('gulp-aigis');
var del = require('del');
var runSequence = require('run-sequence');
var postcss = require('gulp-postcss');
var mqpacker = require('css-mqpacker');
var cssdeclsort = require('css-declaration-sorter');
var assets = require('postcss-assets');
var autoprefixer = require('autoprefixer');

var paths = {
  srcDir: '/files/user/',
  appScss: 'app/sass/**/*.scss',
  appStyleguide: 'app/sass/styleguide/styleguide.scss',
  appScripts: 'app/js/**/*.js',
  appEjs: 'app/ejs/**/*.ejs',
  appEjsDir: 'app/ejs/**/_*/**/*',
  appImages: 'app/images/**/*',
  appFonts: 'app/fonts/**/*',
  appSvg: 'app/svg/**/*',
  dist: 'dist',
  distCss: 'dist/files/user/css',
  distStyleguide: 'dist/styleguide/aigis_assets/css/styleguide',
  distScripts: 'dist/files/user/js',
  distImages: 'dist/files/user/images',
  distFonts: 'dist/files/user/fonts',
  distSvg: 'dist/files/user/svg'
}

gulp.task('server', function() {
  browser({
    server: {
      baseDir: paths.dist
    }
  });
});

gulp.task('sass', function() {
  return gulp.src([paths.appScss, '!' + paths.appStyleguide]) // スタイルガイド用CSSは除外
    .pipe($.plumber({
      errorHandler: $.notify.onError("Error: <%= error.message %>")
    }))
    .pipe($.sourcemaps.init())
    .pipe($.sassGlob())
    .pipe($.sass({
      outputStyle: 'nested'
    }))
    .pipe(postcss([mqpacker()]))
    .pipe(postcss([cssdeclsort({
      order: 'smacss'
    })]))
    .pipe(postcss([assets({
      basePath: 'app/',       // プロジェクトのルートディレクトリ
      baseUrl: paths.srcDir,  // Webサーバーを実行しているときのプロジェクトのURL
      loadPaths: ['images/'], // ファイルを探す特定のディレクトリ
      // loadPaths: ['images','images/common','images/icon'], // images内でディレクトリを区切る場合は複数指定
    })]))
    .pipe(postcss([autoprefixer({
      browsers: ['last 1 versions', 'ie 10'],
      cascade: false
    })]))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(paths.distCss))
    .pipe(browser.reload({
      stream: true
    }));
});

// スタイルガイドの設定
gulp.task('aigis', function() {
  gulp.src(paths.appStyleguide) // 取り込むスタイルガイド用SCSS
    .pipe($.plumber({
      // errorHandler: $.notify.onError("Error: <%= error.message %>")
    }))
    .pipe($.sourcemaps.init())
    .pipe($.sassGlob())
    .pipe($.sass({
      outputStyle: 'nested'
    }))
    .pipe(postcss([mqpacker()]))
    .pipe(postcss([cssdeclsort({
      order: 'smacss'
    })]))
    .pipe(postcss([assets({
      basePath: 'app/',       // プロジェクトのルートディレクトリ
      baseUrl: paths.srcDir,  // Webサーバーを実行しているときのプロジェクトのURL
      loadPaths: ['images/'], // ファイルを探す特定のディレクトリ
      // loadPaths: ['images','images/common','images/icon'], // images内でディレクトリを区切る場合は複数指定
    })]))
    .pipe(postcss([autoprefixer({
      browsers: ['last 1 versions', 'ie 10'],
      cascade: false
    })]))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(paths.distStyleguide)); // スタイルガイド用CSSの出力先

  gulp.src('./aigis_config.yml')
    .pipe($.aigis())
    .pipe(browser.reload({
      stream: true
    }));
});

gulp.task('jsLib', function() {
  return gulp.src([paths.appScripts, '!app/js/script.js'])  //script.js以外をlibrary.jsとしてまとめる
    .pipe($.plumber({
      errorHandler: $.notify.onError("Error: <%= error.message %>")
    }))
    .pipe($.concat('library.js')) // 結合
    .pipe(gulp.dest(paths.distScripts))
    .pipe(browser.reload({
      stream: true
    }))
});

gulp.task('js', function() {
  return gulp.src(['app/js/script.js'])                    //script.jsのみ
    .pipe($.plumber({
      errorHandler: $.notify.onError("Error: <%= error.message %>")
    }))
    .pipe($.concat('scripts.js')) // scripts.js（script【s】つき）として出力
    .pipe(gulp.dest(paths.distScripts))
    .pipe(browser.reload({
      stream: true
    }))
});

gulp.task('font', function() {
  return gulp.src(paths.appFonts)
    .pipe($.plumber({
      errorHandler: $.notify.onError("Error: <%= error.message %>")
    }))
    .pipe(gulp.dest(paths.distFonts));
});

gulp.task('svg', function() {
  return gulp.src(paths.appSvg)
    .pipe($.plumber({
      errorHandler: $.notify.onError("Error: <%= error.message %>")
    }))
    .pipe(gulp.dest(paths.distSvg));
});

gulp.task('ejs', function() {
  return gulp.src(
      [paths.appEjs, '!' + paths.appEjsDir]
    )
    .pipe($.plumber({
      errorHandler: $.notify.onError("Error: <%= error.message %>")
    }))
    .pipe($.newer(paths.dist))
    .pipe($.fileInclude({
      basepath: '@root'
    }))
    .pipe($.ejs({}, {}, {
      ext: '.html'
    }))
    .pipe(gulp.dest(paths.dist))
    .pipe(browser.reload({
      stream: true
    }))
});

gulp.task('imagemin', function() {
  return gulp.src(paths.appImages)
    .pipe($.newer(paths.distImages))
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(paths.distImages));
});

// dist内部を削除
gulp.task('clean', function(cb) {
  del([paths.dist + '/*'], cb);
});

// gulp 時に一度タスクを走らせる
gulp.task('build', function(callback) {
  runSequence('clean', callback);
});

gulp.task('watch', ['ejs', 'imagemin', 'sass', 'aigis', 'font', 'svg', 'jsLib', 'js'], function() {
  gulp.watch(paths.appScss, ['sass', 'aigis']);
  gulp.watch(paths.appScripts, ['jsLib']);
  gulp.watch(paths.appScripts, ['js']);
  gulp.watch(paths.appEjs, ['ejs']);
  gulp.watch(paths.appFonts, ['font']);
  gulp.watch(paths.appFonts, ['svg']);
  gulp.watch(paths.distImages, ['imagemin']);
});

gulp.task('default', ['watch', 'server']);
