function logger(req, res, next) {
  console.log(`${req.method} Request to ${req.url}`)
  next()
}

module.exports = logger
