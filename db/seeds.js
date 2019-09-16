const mongoose = require('mongoose')
const { dbURI } = require('../config/environment')
const Level = require('../models/level')
const Score = require('../models/score')
const data = require('./seedsData')

console.log('events:',data.length)


mongoose.connect(dbURI, { useNewUrlParser: true }, (err,db)=>{
  // connection error handling, or confirm connection
  if (err) return console.log(`There is an error in connecting: ${err}`)
  else console.log(`Connected to ${db.name} for seeding`)

  //clear the database, then do all the follow on actions sequentially
  db.dropDatabase()

    .then(() => console.log('Database clear complete'))


    //add the levels
    .then(() => Level.create(data.levels))
    .then(data => console.log(`Added ${data.length} levels into the database`))

    //add the scores
    .then(() => Score.create(data.scores))
    .then(data => console.log(`Added ${data.length} scores into the database`))

    //finally close the database connection
    .finally(() => {
      console.log('Connection closed')
      mongoose.connection.close()
    })
    .catch(err => console.log(err.message))
})
