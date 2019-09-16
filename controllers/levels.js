const Level = require('../models/level')


function levelIndex(req, res, next) {
  console.log('Starting INDEX logic')
  console.log('Query string', req.query)
  Level
    .find(req.query)
    .populate('level')
    .then(level => res.status(200).json(level))
    .catch(next)
}


function levelCreate(req, res, next) {
  console.log('Starting CREATE logic')
  req.body.level = req.currentUser
  Level
    .create(req.body)
    .then(eventItem => res.status(201).json(eventItem))
    .catch(next)
}

function levelDelete(req, res, next) {
  Level
    .findById(req.params.id)
    .then(event => {
      if (!event.level.equals(req.currentUser._id))
        throw new Error('Unauthorized')
      // return event.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
}


module.exports = {
  levelIndex,
  levelCreate,
  levelDelete
}
