const express = require('express')
const app = express()
const router = express.Router()
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const bodyParser= require('body-parser')
const v = require('./validation.js')
const validation = new v.Validation()

const port = 2047

app.use(bodyParser.urlencoded({ extended:true }))
app.use('/', router)

MongoClient.connect('mongodb://test:t3stt3st@ds113942.mlab.com:13942/axondb', { useNewUrlParser: true}, (err, client) => {
  if (err) return console.log(err)
  db = client.db('axondb')
  app.listen(port, () => {
    console.log('listening on ' + port)
  })
})

router.use((req, res, next) => {
  var date = new Date()
  console.log('---------------------------------')
  console.log(date)
  console.log(req.method + ' ' + req.originalUrl)
  console.log()
  next()
})

router.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

router.get('/users', (req, res) => {
    db.collection('users').find().toArray(function(err, results) {
      res.send(results)
    })
  })

router.post('/users', (req, res) =>{
  var rules = {
    required: [
      'username',
      'pw'
    ]
  }
  var errors = validation.validate(req.body, rules)

  if(errors.length == 0){
    db.collection('users').save(req.body, (err, result) => {
        if(err) return console.log(err)
    })
    res.redirect('/users')
  }
  else{
    res.send(errors)
  }
})

router.get('/users/:id', (req, res) => {
  db.collection('users').find(
    {
      '_id': ObjectID(req.params.id)
    }
  ).toArray(function(err, results) {
    if (err) return console.log(err)
    res.send(results)
  })
})
