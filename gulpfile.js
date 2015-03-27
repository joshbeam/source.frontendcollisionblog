var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var child = require('child_process');
var gulp = require('gulp');

gulp.task('js',function() {
	gulp.src([
		'js/src/utils/*.js',
		'bower_components/jquery/dist/jquery.js',
		'js/src/lib/lunr.js',
		'js/src/search/Query.js',
		'js/src/search/search.js'
		])
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest('js/dist'))
		.pipe(rename('scripts.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('js/dist'));

	return gulp.src([
		'js/src/search/results.js'
		])
		.pipe(gulp.dest('js/dist/search'))
		.pipe(rename('results.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('js/dist/search'));
});

gulp.task('watch',function() {
	gulp.watch('js/src/*.js',['js']);
});

gulp.task('default',['js','watch']);

//child.spawn('jekyll', ['build'], {stdio: 'inherit'});
//child.spawn('jekyll', ['serve'], {stdio: 'inherit'});