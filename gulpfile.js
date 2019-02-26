var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
var minify = require("gulp-minify");

var reload = browserSync.reload;

var htmlSrc = "./src/*.html";
var styleSrc = "./src/sass/*.scss";
var jsSrc = "./src/js/*.js";

var htmlDest = "./dist/";
var styleDest = "./dist/css/";
var jsDest = "./dist/js/";

// ############################
// Tasks
// ############################

function browser_sync() {
  browserSync.init({
    server: {
      baseDir: "./dist/"
    }
  });
}

function reload(done) {
  browserSync.reload();
  done();
}

function css(done) {
  return gulp
    .src(styleSrc)
    .pipe(
      sass({
        errLogToConsole: true,
        outputStyle: "compressed"
      })
    )
    .on("error", console.error.bind(console))
    .pipe(gulp.dest(styleDest))
    .pipe(browserSync.stream());
  done();
}

function html(done) {
  return gulp.src(htmlSrc).pipe(gulp.dest(htmlDest));
  done();
}

function js(done) {
  return gulp
    .src(jsSrc)
    .pipe(minify())
    .pipe(gulp.dest(jsDest));

  done();
}

function watch_files() {
  gulp.watch(styleSrc).on("change", gulp.series(css, reload));
  gulp.watch(htmlSrc).on("change", gulp.series(html, reload));
  gulp.watch(jsSrc).on("change", gulp.series(js, reload));
}

gulp.task("css", css);
gulp.task("html", html);
gulp.task("js", js);

// Default task: watch and build
gulp.task("default", gulp.parallel(css, html, js, browser_sync, watch_files));

// Build project to dist/
gulp.task("build", gulp.series(css, html, js));
