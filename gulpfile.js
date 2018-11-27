const gulp = require('gulp')
const shell = require('gulp-shell')
const clean = require('gulp-clean')
const ts = require('gulp-typescript')
const tsProject = ts.createProject('tsconfig.json')

gulp.task('clean', () => {
  return gulp
    .src(['dist', 'data'], { read: false, allowEmpty: true })
    .pipe(clean())
})

gulp.task('build-common', gulp.series(shell.task('cd common;npm run build')));

gulp.task('install-ruffvm-index', () => {
    return gulp.src(['ruffvm/index.js'])
        .pipe(gulp.dest('./dist/blockchain-sdk/ruffchain/ruffvm'));
});

gulp.task('install-ruffvm-bindings', () => {
    return gulp.src(['ruffvm/build/Release/**']).pipe(gulp.dest('./build'));
});

gulp.task('build-ruffvm', gulp.series([shell.task('cd ruffvm'), 'install-ruffvm-index', 'install-ruffvm-bindings']));

gulp.task('compile', function() {
  return tsProject
    .src()
    .pipe(tsProject())
    .pipe(gulp.dest('dist/blockchain-sdk/ruffchain'))
})

gulp.task('build', gulp.series(['clean', 'build-common', 'build-ruffvm','compile'], () => {
    return gulp.src(['programs/node/chain/*.json'])
        .pipe(gulp.dest('./dist/blockchain-sdk/ruffchain'));
}));
