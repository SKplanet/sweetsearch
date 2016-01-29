var 
	gulp 			= require('gulp'),
	runSequence 	= require('run-sequence'),
	sourcemaps 		= require('gulp-sourcemaps'),
	babel 			= require('gulp-babel'),
	concat 			= require('gulp-concat'),
	watch 			= require('gulp-watch'),
	batch 			= require('gulp-batch'),
 	uglify 			= require('gulp-uglify'),
 	clean 			= require('gulp-clean');


var allJS = ['src/common/commonUtil.js',
	 			 'src/common/commonComponent.js',
	 			 'src/RecentWordPlugin.js',
	 			 'src/RecentWordPluginLocalStorageAddOn.js',
	 			 'src/SmartSearch.js'];


gulp.task('cleanDist', function() {
	gulp.src("dist/*.*", {read: false})
			.pipe(clean())
});

//development. AMD(for requireJS)
//TODO. move to upper variables src files"
gulp.task('compileBabelAMD', function() {
	 gulp.src(allJS)
			.pipe(concat('ss_merge_es5.js'))
	        .pipe(sourcemaps.init())
	        .pipe(babel({
	        	//for supporting this below code, you have to add 'module export' code in source.
	        	//plugins: ['transform-es2015-modules-amd'], 
	        }))
	        .pipe(babel({
	        	presets: ['es2015']
	        }))
	        //.pipe(uglify())
	        .pipe(sourcemaps.write('.'))
	        .pipe(gulp.dest('dist'))
});


gulp.task('buildJS', function() {
	runSequence(
		'cleanDist', 'compileBabelAMD' 
	);
});

gulp.task('watchSS', function() {
    	watch(['src/*.js', 'src/common/*.js'] , batch(function(events, done) { 
    		gulp.start('buildJS', done);
	    }));
});

gulp.task('default', function() {
	runSequence(
		'buildJS', 'jsBuild'  //use Array for parallel work.
	);
});