const notifier          = require('node-notifier');
// Núcleo do Gulp
var gulp                = require('gulp'),
    fs                  = require('fs');
    gutil               = require('gulp-util'),
    watch               = require('gulp-watch'),
    plumber             = require('gulp-plumber'),
    browserify          = require('browserify'),
    browserSync         = require('browser-sync').create(),
    reload              = browserSync.reload;
    map                 = require('map-stream' ),
    pjson               = require('./package.json')
    uglify              = require("gulp-uglify"),   // Transforma o javascript em formato ilegível para humanos
    babel               = require('gulp-babel'),
    concat              = require("gulp-concat"), // Agrupa todos os arquivos em um
    cssmin              = require("gulp-cssmin"), // Minifica o CSS
    less                = require('gulp-less'),
    sass                = require('gulp-sass'),
    rename              = require('gulp-rename'),
    stripCssComments    = require('gulp-strip-css-comments'), // Remove comentários CSS
    imagemin            = require("gulp-imagemin"), //minificar imagem
    jshint              = require("gulp-jshint"),
    stylish             = require('jshint-stylish'),
    cache               = require('gulp-cached'),
    FtpDeploy           = require('ftp-deploy');


var currentFile         = null;
var assets_path         = "assets/";
var src                 = "./src/";
var dist                = "./dist/";

var less_files  = [ src + "youCover.less"];
var js_files    = [ src + "youCover.js"];
var css_files   = [ src + "youCover.css"];

var watcher   = gulp.watch([js_files,less_files]);
watcher.on('change', function(event) {
    currentFile = event.path;
});

// Tarefa padrão quando executado o comando GULP
gulp.task('default',['welcome'],function(){
    gulp.watch(js_files, ['jshint']);
    gulp.watch(less_files, ['less']);
    gulp.watch(css_files, ['minify-css']);
    gulp.watch(js_files, ['minify-js']);
});

// Tarefa de monitoração caso algum arquivo seja modificado, deve ser executado e deixado aberto, comando "gulp watch".
gulp.task('watch',['welcome','browser-sync'], function() {
    gulp.watch(js_files, ['jshint']);
    gulp.watch(less_files, ['less']);
    gulp.watch(css_files, ['minify-css']);
    gulp.watch(js_files, ['minify-js']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

//compile less files locate in src/less to css path minified
gulp.task('less', function(){
    gutil.log("RUN: [less] -> " + currentFile);
    gulp.src(less_files)
    .pipe(cache('linting'))
    //.pipe(concat('main.css'))
    .pipe(less())
    .pipe(cssmin())
    .pipe(gulp.dest(dist))
    .pipe(browserSync.reload({stream: true})); // prompts a reload after compilation
    notify({message:'Task [less/minify-css] complete'});
});

//minify css files
gulp.task('minify-css', function(){
    gutil.log("Starting [minify-css] task.");
    __minify_css(css_files,dist);
    notify({message:'Task [minify-css] complete'});
});

//minify js files
gulp.task('minify-js', function () {
    gutil.log("Starting [minify-js] task.");
    __minify_js(js_files,dist);
    notify({message:'Task [minify-js] complete'});
});

var jsHintErrorReporter = function(file, cb) {
    return map(function (file, cb) {
        if (!file.jshint.success) {
            var files = [];
            file.jshint.results.forEach(function (err) {
                if(files.indexOf(err.file)<0) files.push(err.file);
                if (err) {
                    //emmitter.emit('error');
                }
            });
            var message = "Error in file(s): " + files.join("\n");
            notify({message:message,icon:'error',sound:true});
            
        }
        cb(null, file);
    });
};

gulp.task('jshint', function () {
    gutil.log('Starting [jshint] task.');
    return gulp.src(js_files)
            .pipe(cache('linting'))
            .pipe(jshint())
            .pipe(jshint.reporter(stylish))
            .pipe(jsHintErrorReporter() );
});


function __minify_css(_src,_dist){
    if(currentFile) gutil.log("RUN: [minify-css] -> " + currentFile);
    return gulp.src(_src)
            //.pipe(cache('linting'))
            //.pipe(stripCssComments({all: true}))
            .pipe(cssmin())
            .pipe(gulp.dest(_dist))
            .pipe(browserSync.reload({stream: true}));
}

function __minify_js(_src,_dist){
    if(currentFile) gutil.log("RUN: [minify-js] -> " + currentFile);
    
    return gulp.src(_src)
            .pipe(babel({ presets: ['es2015']}))  //ES6 support
            .pipe(plumber({errorHandler: function(error){
                notify({message:error,icon:'error',sound:true});
            }}))
            .pipe(
                uglify().on('error', function(e){
                    gutil.log(e);
                }))
            .pipe(gulp.dest(_dist))
            .pipe(browserSync.reload({stream: true}));
}

var notify = function(options){
    var _options =  {
        title: pjson.title,
        message: 'nothing here',
        time: 1000, // How long to show balloon in ms
        icon: 'default',
        sound:false
    };
    options = Object.assign({},_options,options);
    gutil.log(options.message);
    notifier.notify(options);
}

/**
 * task:[init]:
 * copy src files to dest folders,
 * run it at project start
 */
gulp.task('welcome', function() {
    clearConsole();
     gutil.log(
    '\n****************** - WELCOME - *******************' + 
    '\n* Title: ' + pjson.title + "\t\t\t *" + 
    '\n* Project: ' + pjson.name + "\t\t\t *" + 
    '\n* Author: ' + pjson.author + "\t\t\t\t\t *" + 
    '\n**************************************************\n');
    return true;
});



gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: __dirname
        }
    });
});

function clearConsole(){
    var lines = process.stdout.getWindowSize()[1];
    for(var i = 0; i < lines; i++) {
        console.log('\r\n');
    }
}