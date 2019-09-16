const port = process.env.PORT || 4000
const env = process.env.NODE_ENV || 'dev'
const dbURI = process.env.MONGODB_URI || `mongodb://localhost/pacman-${process.env.NODE_ENV || 'dev'}`
//console.log(dbURI, env)
module.exports = { port, dbURI, env }
