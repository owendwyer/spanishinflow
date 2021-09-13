

//var baseURL='http://localhost:8080/sites/spanishinflow/src/dist';
//var baseURL='http://188.166.45.159';
var baseURL='https://www.spanishinflow.com';

var gulp = require('gulp'); 
var concat = require('gulp-concat');
var rename = require('gulp-rename');
//var notify = require('gulp-notify');
var argv = require('yargs').argv;
var inject = require('gulp-inject-string');
var gulpif = require('gulp-if');
var fs=require('fs');

var lePages=require('./pages.json');

//load components
var componentHeader=fs.readFileSync("./components/header.html");
var componentStyleLine=fs.readFileSync("./components/styleLine.html");
var componentTop=fs.readFileSync("./components/top.html");
var componentNavigationBar=fs.readFileSync("./components/navigationBar.html");
var componentOpenMainBlock=fs.readFileSync("./components/openMainBlock.html");
var componentCloseMainBlock=fs.readFileSync("./components/closeMainBlock.html");
var componentFooter=fs.readFileSync("./components/footer.html");
//var cjsLine="<script src='./js/createjs-2015.11.26.min.js'></script>";
var cjsLine="<script defer src='https://code.createjs.com/createjs-2015.11.26.min.js'></script>";

var defaultFontsLine="<link href='https://fonts.googleapis.com/css?family=Alegreya+Sans+SC:900|Reem+Kufi' rel='stylesheet' type='text/css'>";

var assemblePage=function(key,entry){
  	gulp.src('./pages/'+entry.htmlSrc)

        .pipe(inject.replace('insertHere-header',componentHeader))
        .pipe(inject.replace('insertHere-styleLine',componentStyleLine))
        .pipe(inject.replace('insertHere-top',componentTop))
        .pipe(inject.replace('insertHere-navigationBar',componentNavigationBar))
        .pipe(inject.replace('insertHere-openMainBlock',componentOpenMainBlock))
        .pipe(inject.replace('insertHere-closeMainBlock',componentCloseMainBlock))
        .pipe(inject.replace('insertHere-createjs',cjsLine))
        .pipe(inject.replace('insertHere-defaultFonts',defaultFontsLine))
        .pipe(inject.replace('insertHere-footer',componentFooter))

        .pipe(inject.replace('insert-baseURL',baseURL))

        .pipe(concat('index.html'))
        .pipe(gulp.dest('../dist/'+entry.dir));
        //.pipe(notify({ message: 'assembled '+key}));
};

gulp.task('page',function(){
	if(argv.p===undefined){
		console.log("use '--p [pagename]' to specify the page to make"); 
	}else{
		if(lePages[argv.p]===undefined){
			console.log("page "+argv.p+" not found in pages.json file"); 
		}else{
			assemblePage(argv.p,lePages[argv.p]);
		}
	}
});

gulp.task('site',function(){
	var keys=Object.keys(lePages);
	keys.map(function(key){
		assemblePage(key,lePages[key]);
	});
});

