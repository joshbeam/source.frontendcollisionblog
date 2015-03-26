var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var child = require('child_process');
var gulp = require('gulp');

gulp.task('js',function() {
	return gulp.src([
		'js/src/utils/*.js',
		'bower_components/jquery/dist/jquery.js',
		'js/src/Query.js',
		'js/src/search.js',
		'js/src/lib/*.js'
		])
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest('js/dist'))
		.pipe(rename('scripts.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('js/dist'));
});

gulp.task('watch',function() {
	gulp.watch('js/src/*.js',['js']);
});

gulp.task('default',['js','watch']);

//child.spawn('jekyll', ['build'], {stdio: 'inherit'});
//child.spawn('jekyll', ['serve'], {stdio: 'inherit'});