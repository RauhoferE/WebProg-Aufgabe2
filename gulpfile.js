const { src, dest, parallel, series, watch } = require('gulp');
const concat = require('gulp-concat');
const htmlhint = require("gulp-htmlhint");

const sass = require('gulp-sass');
sass.compiler = require('node-sass');

var uncomment = require('gulp-uncomment');

const debug = require('gulp-debug');

var ts = require('gulp-typescript');
 

async function tsFunc(){
  return src('src/*.ts')
  .pipe(ts({
      noImplicitAny: true,
      outFile: 'output.js'
  }))
  .pipe(dest('dist'));
}


function html() {
  return src('*.html')
	.pipe(debug({title: 'html:'}))
	.pipe(htmlhint())
	.pipe(htmlhint.failOnError())
	.pipe(dest('dist'));
}

async function css() {
  return src('src/*.scss')
	.pipe(debug({title: 'css :'}))
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('dist'));
}

exports.tsCall = tsFunc;
exports.css = css;
exports.html = series(html);
exports.default = parallel(html, css, tsFunc);
