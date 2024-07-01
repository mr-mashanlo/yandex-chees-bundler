import pkg from 'gulp';

import browserSync from 'browser-sync';
import del from 'del';
import gulpIf from 'gulp-if';
import newer from 'gulp-newer';
import rename from 'gulp-rename';

import autoprefixer from 'gulp-autoprefixer';
import csso from 'gulp-csso';
import fileinclude from 'gulp-file-include';
import groupMediaQueries from 'gulp-group-css-media-queries';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';

import rollup from 'gulp-rollup';
import terser from 'gulp-terser';
import webp from 'gulp-webp';
import babel from 'rollup-plugin-babel';

const { dest, parallel, series, src, watch } = pkg;
const sass = gulpSass( dartSass );
const bs = browserSync.create();

const paths = {
  html: {
    src: 'src/*.html',
    dest: 'dist/',
    watch: 'src/***.html'
  },
  styles: {
    src: 'src/styles/**/*.sass',
    dest: 'dist/styles/',
    watch: 'src/styles/**/*.sass'
  },
  scripts: {
    src: 'src/scripts/main.js',
    dest: 'dist/scripts/',
    watch: 'src/scripts/**/*.js'
  },
  images: {
    src: 'src/images/**/*.{png,jpg,jpeg,gif,svg,webp}',
    dest: 'dist/images/',
    watch: 'src/images/**/*.{png,jpg,jpeg,gif,svg,webp}'
  },
  fonts: {
    src: 'src/fonts/**/*.*',
    dest: 'dist/fonts/',
    watch: 'src/fonts/**/*.*'
  }
};

function serve() {
  browserSync.init( {
    server: { baseDir: 'dist/' },
    notify: false,
    open: false
  } );

  watch( paths.html.watch, html );
  watch( paths.styles.watch, styles );
  watch( paths.scripts.watch, scripts );
  watch( paths.images.watch, images );
  watch( paths.fonts.watch, fonts );
}

function clean() {
  return del( [ 'dist/' ] );
}

function html() {
  return src( paths.html.src )
    .pipe( fileinclude() )
    .pipe( dest( paths.html.dest ) )
    .pipe( bs.stream() );
}

function styles() {
  return src( paths.styles.src )
    .pipe( sass().on( 'error', sass.logError ) )
    .pipe( autoprefixer() )
    .pipe( groupMediaQueries() )
    .pipe( csso() )
    .pipe( rename( { suffix: '.min' } ) )
    .pipe( dest( paths.styles.dest ) )
    .pipe( bs.stream() );
}

function scripts() {
  return src( paths.scripts.src )
    .pipe( rollup( {
      allowRealFiles: true,
      input: paths.scripts.src,
      output: { file: paths.scripts.dest, format: 'iife', compact: true },
      plugins: [ babel( { exclude: 'node_modules/**', presets: [ '@babel/preset-env' ] } ) ]
    } ) )
    .pipe( terser() )
    .pipe( rename( { suffix: '.min' } ) )
    .pipe( dest( paths.scripts.dest ) )
    .pipe( bs.stream() );
}

function images() {
  return src( paths.images.src )
    .pipe( newer( paths.images.dest ) )
    .pipe( gulpIf( file => [ '.png', '.jpg', '.jpeg' ].includes( file.extname ), webp( { quality: 90 } ) ) )
    .pipe( dest( paths.images.dest ) )
    .pipe( bs.stream() );
}

function fonts() {
  return src( paths.fonts.src )
    .pipe( newer( paths.fonts.dest ) )
    .pipe( dest( paths.fonts.dest ) )
    .pipe( bs.stream() );
}

export default series(
  clean,
  parallel( html, styles, scripts, images, fonts ),
  serve
);
