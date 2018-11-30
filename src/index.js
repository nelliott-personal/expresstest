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

// ROUTES

app.get('/js/:hash?', (req, res, next) => {
  const JSGenerator = require('./JSGenerator');
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

app.get('/Components/:component', (req, res, next) => {
  const Banner = require('./Banner');
  const ComponentFactory = require('./ComponentFactory');

  res.send(ComponentFactory(req.params.component, new Banner({ width: 300, height: 250}), { imgUrl: 'https://media.giphy.com/media/LLWP1seiT4fC/giphy.gif'}).render());
});

app.get('/Banners/:banner', (req, res, next) => {
  const ComponentFactory = require('./ComponentFactory');
  const Banner = require('./Banner');
  const B = new Banner({
    width: 768,
    height: 90
  });

  const Coverpage = require('./Components/Coverpage');
  const COMP = new Coverpage({ }, B);
  log(_.map(B.get('states'), 'components'));
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
