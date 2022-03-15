'use strict';

// eslint-disable-next-line node/no-unpublished-require
const sass = require('sass');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'app', 'styles', 'ember-side-menu.scss');
const outputFile = path.join(__dirname, 'vendor', 'ember-side-menu.css');
const buf = fs.readFileSync(inputFile, 'utf8');

// Compile main file
const result = sass.renderSync({
  data: buf,
});

fs.writeFileSync(outputFile, result.css);
