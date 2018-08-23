var gulp = require('gulp'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util'),
    minifyCss = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    gulpIf = require('gulp-if'),
    stripDebug = require('gulp-strip-debug'),
    ngAnnotate = require('gulp-ng-annotate'),
    replace = require('gulp-replace'),
    minifyHtml = require('gulp-htmlmin'),
    del = require('del'),
    argv = require('yargs').argv;

var sourceRoot = './src/';
var outputRoot = './build/';

var scssFiles = [
    sourceRoot + 'sass/angular-material.scss',
    sourceRoot + 'sass/main.scss'
];

var jsDepSources = [
    sourceRoot + 'lib/angular.js',
    sourceRoot + 'lib/angular-animate.js',
    sourceRoot + 'lib/angular-aria.js',
    sourceRoot + 'lib/angular-material.js',
    sourceRoot + 'lib/angular-google-analytics.js',
    sourceRoot + 'lib/angular-ui-router.js',
    sourceRoot + 'lib/lodash.js',
    sourceRoot + 'lib/papaparse.js'
];

var appSources = [
	sourceRoot + 'app/**/*.js'
];

function bundleJs(sources, outputFileName) {
   return gulp.src(sources)
        .pipe(sourcemaps.init({
            base: 'src'
        }))
        .pipe(ngAnnotate({
            remove: true,
            add: true,
            single_quotes: true
        }))
        .pipe(concat(outputFileName))
        .pipe(gulpIf(argv.production, stripDebug()))
        .pipe(gulpIf(argv.production, uglify()))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(sourceRoot + 'lib/'))
        .pipe(gulp.dest(outputRoot + 'lib/'));
}

gulp.task('scss', function () {
    return gulp.src(scssFiles)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(minifyCss())
        .pipe(gulp.dest(sourceRoot + 'css'))
        .pipe(gulp.dest(outputRoot + 'css'));
});

gulp.task('clean', function () {
    try {
        var targets = [outputRoot + '**/*.*'],
            paths = del.sync(targets);
        gutil.log('Deleted files/folders:\n', paths.join('\n'));
    } catch (e) {
        gutil.log('Error - cleanOutputFiles');
    }
});

gulp.task('jsDependency', function () {
    return gulp.src(jsDepSources)
        .pipe(concat('dependency.js'))
        .pipe(uglify())
        .pipe(gulp.dest(outputRoot + 'lib'))    
        .pipe(gulp.dest(sourceRoot + 'lib'));
});

gulp.task('jsAppBundle', function () {
    bundleJs(sourceRoot + 'app/app.js', 'app.js');
    bundleJs(sourceRoot + 'app/app.env.js', 'app.env.js');
    bundleJs(sourceRoot + 'app/app.states.js', 'app.states.js');
    bundleJs(appSources, 'toolsApp_140420181257.js');
});

gulp.task('minifyHtml', function () {
    return gulp.src([sourceRoot + '*.html', sourceRoot + '**/*.html'])
        .pipe(minifyHtml({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(outputRoot));
});

gulp.task('seoFiles', function(){
    return gulp.src([sourceRoot + 'sitemap.xml'
                    , sourceRoot + 'manifest.webmanifest'])
    .pipe(gulp.dest(outputRoot));
});

gulp.task('icons', function(){
    return gulp.src([sourceRoot + 'icon/*.png', sourceRoot + 'icon/favicon.ico'])
    .pipe(gulp.dest(outputRoot + 'icon'));
});

gulp.task('screenshots',function(){
    return gulp.src(sourceRoot + 'screenshot/codetools.png')
    .pipe(gulp.dest(outputRoot + 'screenshot'));
})

gulp.task('serviceWorker', function(){
    return gulp.src(sourceRoot + 'service-worker.js')
    .pipe(gulp.dest(outputRoot));
})

// Publish to Amazon S3 / CloudFront
gulp.task('deploy', function () {
    var awspublish = require('gulp-awspublish'),
        aws = {};
     var aws = {
     	"accessKeyId": argv.AWS_S3_KEY,
     	"secretAccessKey": argv.AWS_S3_SECRET,
     	"params": {
     		Bucket: argv.BUCKET
     	},
     	"region": argv.REGION
     };
    var publisher = awspublish.create(aws),
        headers = {
            'Cache-Control': 'max-age=315360000, no-transform, public'
        };

    return gulp.src('./build/**')
        // Gzip, set Content-Encoding headers
        //        .pipe(awspublish.gzip({
        //            ext: '.gz'
        //        }))
        // Publisher will add Content-Length, Content-Type and headers specified above
        // If not specified it will set x-amz-acl to public-read by default
        .pipe(publisher.publish(headers))
        // Create a cache file to speed up consecutive uploads
        //.pipe(publisher.cache())
        // Print upload updates to console
        .pipe(awspublish.reporter());
});

gulp.task('default', ['clean', 'scss', 'jsDependency', 'jsAppBundle', 'minifyHtml', 'seoFiles', 'icons', 'screenshots','serviceWorker']);

gulp.task('watch', ['default'], function () {
    gulp.watch(sourceRoot + 'app/**/*.js', ['jsAppBundle']);
    gulp.watch(sourceRoot + 'sass/*.scss', ['scss']);
    gulp.watch([sourceRoot + 'app/**/*.html', sourceRoot + '*.html'], ['minifyHtml']);
}, function () {
    console.log("Watching files");
});