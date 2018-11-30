const _ = require('lodash'),
      beeper = require('beeper'),
      chalk = require('chalk'),
      co = require('co'),
      crypto = require('crypto'),
      dotenv = require('dotenv').config(),
      express = require('express'),
      fs = require('mz/fs'),
      log = require('./utils/Log'),
      mcache = require('memory-cache'),
      path = require('path'),
      uglify = require('uglify-js');

const app = express();

// ROUTES

var cache = (duration) => {
  return (req, res, next) => {
    let start = new Date()
    let hrstart = process.hrtime();
    let key = '__express__' + req.originalUrl || req.url;
    let cachedBody = mcache.get(key);
    if(cachedBody){
      res.send(cachedBody);
      var end = new Date() - start,
      hrend = process.hrtime(hrstart);
      log(`Executed ${ req.originalUrl || req.url } (cached) in ${ end }ms `);
      return;
    }
    else{
      res.sendResponse = res.send;
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      }
    }
    next();
    var end = new Date() - start,
    hrend = process.hrtime(hrstart);
    log(`Executed ${ req.originalUrl || req.url } (uncached) in ${ end }ms `);
  }
}



app.get('/js/:hash?', cache(process.env.CACHE_LENGTH), (req, res) => {
  const JSGenerator = require('./JSGenerator');
  const JS = uglify.minify(JSGenerator()).code;
  const JSPATH = `${ process.env.JSTEMPLATE_PATH }/${ req.params.hash || `${ crypto.createHash('md5').update(JS).digest('hex') }` }.js`;

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

app.get('/Components/:component', cache(process.env.CACHE_LENGTH), (req, res) => {
  const Banner = require('./Banner');
  const ComponentFactory = require('./ComponentFactory');

  res.send(ComponentFactory(req.params.component, null, { imgUrl: 'https://media.giphy.com/media/LLWP1seiT4fC/giphy.gif'}).render());
});

app.get('/Banners/:banner', cache(process.env.CACHE_LENGTH), (req, res) => {
  const ComponentFactory = require('./ComponentFactory');
  const Banner = require('./Banner');
  const B = new Banner({
    width: 768,
    height: 90
  });

  res.send(_.template(`
    <%= B.get('name') %><br />
    <pre><code>${ JSON.stringify(B.options, null, 2) }</code></pre>
    <% _.each(_.map(B.get('states'), 'components'), (cs) => {  %>
      <% _.each(cs, (c) => { %>
        <%= c.name %><br />
        <%= ComponentFactory(c.name, B, c.options).render() %>
      <% }); %>
    <% }) %>
  `)({ B: B, ComponentFactory: ComponentFactory }));
});

function onError(err) {
  beeper();
  log(err);
}

app.listen(process.env.PORT, () => log(`Listening on port ${ process.env.PORT }!`));
