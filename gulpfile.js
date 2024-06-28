import browserSync from 'browser-sync';
import del from 'del';
import gulp from 'gulp';
import newer from 'gulp-newer';
import rename from 'gulp-rename';

import autoprefixer from 'gulp-autoprefixer';
import csso from 'gulp-csso';
import fileinclude from 'gulp-file-include';
import groupMediaQueries from 'gulp-group-css-media-queries';
import rollup from 'gulp-rollup';
import gulpSass from 'gulp-sass';
import webp from 'gulp-webp';
import babel from 'rollup-plugin-babel';
import * as dartSass from 'sass';
const sass = gulpSass( dartSass );

function server() {
  browserSync.init( {
    server: { baseDir: 'dist/' },
    notify: false,
    open: false,
  } );
}

function clear() {
  return del( 'dist/' );
}

function html() {
  return gulp.src( 'src/*.html' )
    .pipe( fileinclude() )
    .pipe( gulp.dest( 'dist' ) )
    .pipe( browserSync.stream() );
}

function styles() {
  return gulp.src( 'src/styles/**/*.sass' )
    .pipe( sass( { outputStyle: 'compressed' } ).on( 'error', sass.logError ) )
    .pipe( autoprefixer() )
    .pipe( groupMediaQueries() )
    .pipe( csso() )
    .pipe( rename( { suffix: '.min' } ) )
    .pipe( gulp.dest( 'dist/styles' ) )
    .pipe( browserSync.stream() );
}

function scripts() {
  return gulp.src( 'src/scripts/main.js' )
    .pipe( rollup( {
      allowRealFiles: true,
      input: 'src/scripts/main.js',
      output: {
        file: 'dist/scripts',
        format: 'iife',
        compact: true,
      },
      plugins: [
        babel( {
          exclude: 'node_modules/**',
          presets: [ '@babel/preset-env' ],
        } ),
      ],
    } ) )
    .pipe( rename( { suffix: '.min' } ) )
    .pipe( gulp.dest( 'dist/scripts' ) )
    .pipe( browserSync.stream() );
}

function compressImages() {
  return gulp.src( 'src/images/**/*.{png,jpg,jpeg}' )
    .pipe( newer( 'dist/images' ) )
    .pipe( webp( { quality: 95 } ) )
    .pipe( gulp.dest( 'dist/images' ) )
    .pipe( browserSync.stream() );
}

function copyImages() {
  return gulp.src( 'src/images/**/*.{webp,svg,json,ico}' )
    .pipe( newer( 'dist/images' ) )
    .pipe( gulp.dest( 'dist/images' ) )
    .pipe( browserSync.stream() );
}

function copyFonts() {
  return gulp.src( 'src/fonts/**/*.woff2' )
    .pipe( newer( 'dist/fonts' ) )
    .pipe( gulp.dest( 'dist/fonts' ) )
    .pipe( browserSync.stream() );
}

function watcher() {
  gulp.watch( 'src/*.html', gulp.parallel( html, styles ) );
  gulp.watch( 'src/styles/**/*.sass', styles );
  gulp.watch( 'src/scripts/**/*.js', scripts );
  gulp.watch( 'src/images/**/*.{webp,svg,json,ico}', copyImages );
  gulp.watch( 'src/images/**/*.{png,jpg,jpeg}', compressImages );
  gulp.watch( 'src/fonts/**/*.woff2', copyFonts );
}

const dev = gulp.series( clear, gulp.parallel( html, styles, scripts, compressImages, copyImages, copyFonts ), gulp.parallel( server, watcher ) );
const build = gulp.series( clear, html, styles, scripts, compressImages, copyImages, copyFonts );

export { build, dev as default };
