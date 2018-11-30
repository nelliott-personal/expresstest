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

// ROUTES

app.get('/js/:hash?', (req, res, next) => {
  const js = uglify.minify(JSGenerator(), { mangle:{ toplevel: true } }).code;
  const filename = `${crypto.createHash('md5').update(js).digest('hex')}.js`;
  const jspath = path.join(__dirname, '../public/jstemplates', `${req.params.hash || filename}`);

  var dir = __dirname + '/upload';
  if (!path.existsSync('./public')) {
      fs.mkdirSync('./public');
  }
  res.set('Content-Type', 'text/javascript');

  fs.stat(jspath, (err, stats) => {
    if (err) {
      log(`writing file: ${jspath}`);
      fs.writeFile(jspath, js, (err) => {
        if (err) throw err;

        res.send(js);
      });
    }
    else {
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
