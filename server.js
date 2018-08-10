const express = require('express')
const app = express()
const router = express.Router()
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const bodyParser= require('body-parser')
const v = require('./validation.js')
const validation = new v.Validation()

const c = require('./Confession.js')
const confession = new c.Confession()

const port = 2047

const _p = require('./Priest.js')
let priest = new _p.Priest()

app.use(bodyParser.urlencoded({ extended:true }))
app.use('/', router)



MongoClient.connect('mongodb://test:t3stt3st@ds113942.mlab.com:13942/axondb', { useNewUrlParser: true}, (err, client) => {
  if (err) return console.log(err)
  db = client.db('axondb')
  app.listen(port, () => {
    priest.talk('the priest is listening and will hear your confession on: ' + port)
  })
})

router.use((req, res, next) => {
  var date = new Date()
  console.log('---------------------------------')
  console.log(date)
  console.log(req.method + ' ' + req.originalUrl)

  switch(req.originalUrl){
    case '/wordcounts':
      priest.talk('The Priest reveals the words he has recorded')
      break
    case '/namecounts':
      priest.talk('The Priest reveals the names of the sinners')
      break
    case '/confessions':
      priest.talk('Tell me your sins')
      break
  }
  next()
})

router.get('/', (req, res) => {
  res.sendFile(__dirname + '/confessionform.html')
})

router.get('/confessions', (req, res) => {
  db.collection('confessions').find().toArray(function(err, results) {
    res.send(results)
  })
})

router.post('/confessions', (req, res) =>{
  req.body.created = new Date()
  db.collection('confessions').save(req.body, (err, result) => {
      if(err) {
        return console.log(err)
      }
      else{
        let newC = new c.Confession()
        newC.analyzeWords(req.body.confession)
        newC.analyzeNames(req.body.name)
        db.collection('confessions').find().toArray(function(err, results) {
          res.send(results)
        })
      }
  })
})

router.get('/wordcounts', (req, res) => {
  db.collection('wordcounts').find().toArray(function(err, results) {
    res.send(results)
  })
})

router.get('/namecounts', (req, res) => {
  db.collection('wordcounts').find().toArray(function(err, results) {
    res.send(results)
  })
})
