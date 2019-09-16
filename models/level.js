const mongoose = require('mongoose')


const levelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true, maxlength: 1000 },
  prison: [ Number ],
  bigPills: [ Number ],
  walls: [ Number ]
}, {
  timestamps: true
})

// eventSchema.plugin(require('mongoose-unique-validator'))


module.exports = mongoose.model('Level', levelSchema)
