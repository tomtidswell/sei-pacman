const mongoose = require('mongoose')

const scoreSchema = new mongoose.Schema({
  name: { type: String, required: true  },
  value: { type: Number, required: true  }
})

scoreSchema.plugin(require('mongoose-unique-validator'))

module.exports = mongoose.model('score', scoreSchema)
