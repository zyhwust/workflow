var gulp = require( 'gulp' ); 
var uglify = require('gulp-uglify');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnext = require('cssnext');
var precss = require('precss');
var cssmin = require('gulp-minify-css');

// 生成md5并替换
var rev = require('gulp-rev') , 
    revCollector = require('gulp-rev-collector'),
    clean = require('gulp-clean');
// 压缩Html
var minifyHTML   = require('gulp-minify-html');
// 控制gulp任务顺序执行
// var gulpSequence = require('run-sequence');

// 处理css兼容
var processors = [
  autoprefixer({browsers: ['last 5 version']}),
  autoprefixer,
  cssnext,
  precss
];

// 清除md5冗余版本
gulp.task('clean', function() {
  gulp.src(['./js/*.js', './html/*.html' , './css/*.css'])                    
  gulp.src(['./rev/*/*.json']) 
  .pipe(clean())                            
});

// 兼容、压缩css
gulp.task('css', function () {
  return gulp.src('./cssbackup/*.css')
    .pipe(postcss(processors))
    .pipe(cssmin())
    .pipe(rev())
    .pipe(gulp.dest('./css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./rev/css'));
});

// 压缩js文件
gulp.task('script',function(){
    gulp.src('./jsbackup/*.js')
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('./js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./rev/js'));
    console.log('\13');
    console.log('完成一次JS压缩任务~~~');
    console.log('\13');
});

gulp.task('revJs' ,  function() {
  gulp.src(['./rev/js/rev-manifest.json', './htmlbackup/*.html'])                    
  //- 读取 rev-manifest.json 文件以及需要进行js名替换的文件
  .pipe(revCollector({
    replaceReved: true
  }))
  //- 执行文件内css名的替换
  .pipe(gulp.dest('./html'));                               
  //- 替换后的文件输出的目录
});

gulp.task('revCss' , function() {
  gulp.src(['./rev/css/rev-manifest.json', './html/*.html'])                    
  //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
  .pipe(revCollector({
    replaceReved: true
  }))
  .pipe(minifyHTML({
        empty:true,
        spare:true
    }))
  //- 执行文件内css名的替换
  .pipe(gulp.dest('./html'));                               
  //- 替换后的文件输出的目录
});

gulp.task('default', ['clean', 'css' , 'script', 'revJs']);
// 默认任务
/*gulp.task('default', function(){
    // gulp.run('clean');

    gulp.run('script');
    // gulp.run('scriptcomponents');
    gulp.run('css');
    // gulp.run('csscommon');

    gulp.run('revCss');
    gulp.run('revJs');
    console.log('Finish~~~~~~~~~~~~~~~~');

});*/

// gulp.task('sequence-1',gulpSequence('clean' , ['script' , 'css'], 'revJs' , 'revCss'));
// gulp.task('default', ['clean' , 'revJs', 'revCss']);
// gulp.task('default', ['sequence-1']);