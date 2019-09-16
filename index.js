const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
const { dbURI, port } = require('./config/environment')
const logger = require('./lib/logger')
const router = require('./config/router')
const errorHandler = require('./lib/errorHandler')

require('dotenv').config()

mongoose.connect(dbURI, { useNewUrlParser: true, useCreateIndex: true })

app.use(express.static(`${__dirname}/dist`))

app.use(bodyParser.json())

// enhanced error messaging
app.use(logger)

// implement the routing
app.use('/api', router)

// make sure the error handler catches any errors
app.use(errorHandler)

// serve the file on reload
app.get('/*', (req,res) => res.sendFile(`${__dirname}/dist/index.html`))

app.listen(port, () => console.log(`App is listening on port ${port}`))

module.exports = app
