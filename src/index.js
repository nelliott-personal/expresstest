const _ = require('lodash'),
      chalk = require('chalk'),
      crypto = require('crypto'),
      dotenv = require('dotenv').config(),
      express = require('express'),
      fs = require('fs'),
      JSGenerator = require('./JSGenerator'),
      log = require('./utils/Log'),
      path = require('path'),
      uglify = require('uglify-js'),
      url = require('url');

const app = express(),
      port = process.env.PORT;

//app.enable('view cache');

// ROUTES

app.get('/js/:hash?', (req, res, next) => {
  const js = JSGenerator();
  const filename = `${crypto.createHash('md5').update(js).digest('hex')}.js`;
  const jspath = path.join(__dirname, '../public/jstemplates', `${req.params.hash || filename}`);
  res.set('Content-Type', 'text/html');
  fs.stat(jspath, (err, stats) => {
    if (err) {  // if file does not exist
      log(`writing file: ${jspath}`);
      fs.writeFile(jspath, js, (err) => {
        if (err) throw err;

        res.send(js);
      });
    }
    else { // if file exists
      log(`sending existing file: ${jspath}`);
      fs.readFile(jspath, (err, data) => {
        if (err) throw err;
        log(data);
        res.send(data);
      });
    }
  });
});

app.listen(port, () => log(`Listening on port ${port}!`));
