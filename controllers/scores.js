const Score = require('../models/score')


function scoreIndex(req, res, next) {
  console.log('Starting INDEX logic')
  console.log('Query string', req.query)
  Score
    .find(req.query).sort('-value').select('-_id -__v')
    .then(scores => res.status(200).json(scores))
    .catch(next)
}


function scoreCreate(req, res, next) {
  console.log('Starting CREATE logic')
  req.body.score = req.currentUser
  Score
    .create(req.body)
    .then(() => Score.find().sort('-value').select('-_id -__v'))
    .then(scores => res.status(201).json(scores))
    .catch(next)
}

module.exports = {
  scoreIndex,
  scoreCreate
}
