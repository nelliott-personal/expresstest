const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const router = express.Router()
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const bodyParser= require('body-parser')

const v = require('./validation.js')
const validation = new v.Validation()

const _c = require('./Confession.js')
let confession = new _c.Confession()

const port = 2047

const _p = require('./Priest.js')
let priest = new _p.Priest()
app.use(bodyParser.urlencoded({ extended:true }))

var hbs = exphbs.create({
  defaultLayout: 'main',
  partialsDir: [
    'views/partials/'
  ]
})
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')
app.use('/', router)



const nav = [
  {label: 'confess', link: '/'},
  {label: 'wordcounts', link: '/wordcounts'}
]


function exposeTemplates(req, res, next) {
  // Uses the `ExpressHandlebars` instance to get the get the **precompiled**
  // templates which will be shared with the client-side of the app.
  hbs.getTemplates('views/partials', {
    cache: app.enabled('view cache'),
    precompiled: true
  }).then(function(templates) {
    // RegExp to remove the ".handlebars" extension from the template names.
    var extRegex = new RegExp(hbs.extname + '$');

    // Creates an array of templates which are exposed via
    // `res.locals.templates`.
    templates = Object.keys(templates).map(function(name) {
      return {
        name: name.replace(extRegex, ''),
        template: templates[name]
      };
    });

    // Exposes the templates during view rendering.
    if (templates.length) {
      res.locals.templates = templates;
    }
    setImmediate(next);
  }).catch(next);
}


MongoClient.connect('mongodb://test:t3stt3st@ds113942.mlab.com:13942/axondb', { useNewUrlParser: true}, (err, client) => {
  if (err) return console.log(err)
  db = client.db('axondb')
  app.listen(port, () => {
    priest.talk('the Priest is listening and will hear your confession on: ' + port)
  })
})

router.use((req, res, next) => {
  var date = new Date()
  console.log('---------------------------------')
  console.log(date)
  console.log(req.method + ' ' + req.originalUrl)

  switch(req.originalUrl){
    case '/':
      priest.talk('Home.')
    case '/wordcounts':
      priest.talk('The Priest reveals the words he has recorded')
      break
    case '/namecounts':
      priest.talk('The Priest reveals the names of the sinners')
      break
    case '/newconfession':
      priest.talk('Tell me your sins')
      break
    case '/confessions':
      priest.talk('The Priest now owns all of your sins')
      break
  }
  next()
})


router.get('/', (req, res) => {
  res.render('pages/newconfession')
})
router.get('/newconfession', (req, res) => {
  res.render('pages/newconfession')
})

router.get('/confessions', (req, res) => {
  db.collection('confessions').find().sort({ created:-1 }).toArray(function(err, results) {
    res.render('pages/confessions', {
      confessions: results
    })
  })
})

router.post('/confessions', (req, res) =>{
  req.body.created = new Date()
  db.collection('confessions').save(req.body, (err, result) => {
    let newC = new c.Confession()
    newC.analyzeWords(req.body.confession)
    newC.analyzeNames(req.body.name)
    db.collection('confessions').find().toArray(function(err, results) {
      res.send(results);
    })
  })
})

router.get('/wordcounts', (req, res) => {
  db.collection('wordcounts').find().sort({ count:-1 }).toArray(function(err, results) {
    res.render('pages/wordcounts', {
      words: results
    })
  })
})

router.get('/namecounts', (req, res) => {
  db.collection('namecounts').find().sort({ count:-1 }).toArray(function(err, results) {
    res.render('pages/wordcounts', {
      words: results
    })
  })
})
