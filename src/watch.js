const chokidar = require('chokidar');
const sass = require('node-sass');
const fs = require('fs');
const concat = require('concat');

var TacticWatcher = chokidar.watch('./models/Tactics/**/*.js', {
  persistent: true
});

TacticWatcher.on('change', (path, stats) => {

});

chokidar.watch('./views/**/*.handlebars').on('all', (event, at) => {
  console.log('template change');
  console.log(event);
});

chokidar.watch('./sass/**/*.scss').on('all', (event, at) => {
  console.log('scss change');
  console.log(event);
});
