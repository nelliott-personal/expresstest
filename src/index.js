const _ = require('lodash'),
      beeper = require('beeper'),
      chalk = require('chalk'),
      co = require('co'),
      crypto = require('crypto'),
      dotenv = require('dotenv').config(),
      express = require('express'),
      fs = require('mz/fs'),
      log = require('./utils/Log'),
      path = require('path'),
      uglify = require('uglify-js');

const app = express();
const JSGenerator = require('./JSGenerator');

// ROUTES

app.get('/js/:hash?', (req, res, next) => {
  const JS = uglify.minify(JSGenerator()).code;
  const JSPATH = `./jstemplates/${ req.params.hash || `${ crypto.createHash('md5').update(JS).digest('hex') }.js` }`;

  log(chalk.rgb(0, 223, 255)(JSPATH));
  co(function *(){
    let ex = yield fs.exists(process.env.JSTEMPLATE_PATH);
    if(!ex) {
      yield fs.mkdir(process.env.JSTEMPLATE_PATH);
    }
    let fEx = yield fs.exists(JSPATH);
    if(!fEx){
      yield fs.writeFile(JSPATH, JS);
    }
  })
  .then(() => {
    res.set('Content-Type', 'application/javascript');
    fs.readFile(JSPATH).then((data) => {
      res.send(data);
    }).catch((err) => {
      onError(err);
    });
  })
  .catch((err) => {
    onError(err);
  });
});

function onError(err) {
  beeper();
  log(err);
}

app.listen(process.env.PORT, () => log(`Listening on port ${ process.env.PORT }!`));
