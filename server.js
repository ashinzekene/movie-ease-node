var express = require('express')
var path = require("path")
var http = require("http")
var bodyParser = require("body-parser")
require('dotenv').config()
var app = express()

const server = http.createServer(app)
require("./routes/bot")

var moviesRoute = require('./routes/new-movies')
var actorsRoute = require('./routes/new-actors')
var seriesRoute = require('./routes/new-series')
var imagesRoute = require('./routes/images-route')
var botRoute = require('./routes/bot-route')
var appendResponseRoute = require('./routes/append-response-route')
var port = process.env.PORT || 4400

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", [ "https://ashinzekene.github.io"])
  next()
})

app.use('/movies', moviesRoute)
app.use('/actors', actorsRoute)
app.use('/series', seriesRoute)
app.use('/bot', botRoute)
app.use('/a2r', appendResponseRoute)
app.use('/images', imagesRoute)

app.get('*', function(req, res) {
  res.status(400).json({result: 'Bad url '+ req.url})
})

app.listen(port, function(err) {
  if(err) console.log(err)
  console.log('It is happening at port ', port)
})

// server.listen(80)

