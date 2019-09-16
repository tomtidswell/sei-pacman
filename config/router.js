const router = require('express').Router()
const level = require('../controllers/levels')
const score = require('../controllers/scores')

router.route('/levels')
  .get(level.levelIndex)
  .post(level.levelCreate)

router.route('/levels/:id')
  .delete(level.levelDelete)

router.route('/scores')
  .get(score.scoreIndex)
  .post(score.scoreCreate)

router.route('/*')
  .all((req, res) => res.status(404).json({ message: 'Not Found' }))

module.exports = router
