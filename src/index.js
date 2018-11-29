const express = require('express');
const exphbs = require('express-handlebars');
const port = 2047;

const watch = require('./watch.js');

const app = express();

app.enable('view cache');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// ROUTES

app.get('/', (req, res, next) => {
  res.render('pages/home');
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
