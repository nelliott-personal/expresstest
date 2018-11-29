const express = require('express');
const port = 2047;
const app = express();
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

app.enable('view cache');

fs.watch('./index.js')

// ROUTES

app.get('/', (req, res, next) => {

  let js = 'x = 13;';

  let md5sum = crypto.createHash('md5').update(js).digest('hex');

  let jspath = path.join(__dirname, '../public/jstemplates', md5sum + '.js');


  fs.stat(jspath, (err, stats) => {
    if (err) {
      console.log('writing file: ' + jspath);
      fs.writeFile(jspath, js, (err) => {
          if (err) throw err;
          res.set({"Content-Disposition":"attachment; filename=\"" + md5sum + "\""});
          res.send(js);
      });
    }
    else {
      console.log('sending existing file: ' + jspath);
      res.set({"Content-Disposition":"attachment; filename=\"" + md5sum + "\""});
      res.sendFile(jspath);
    }
  });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
