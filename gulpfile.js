var gulp= require('gulp')
var dts = require('dts-generator');

gulp.task('default', function(){
  dts  .generate({
    name: 'uservices-socket.io-client',
    baseDir: './module',
    excludes: ['./typings/es6/es6.d.ts', './typings/typescript/lib.es6.d.ts'],
    files: [ './index.ts' ],
    out: './uservices-socket.io-client.d.ts'
  });
})
