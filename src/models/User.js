const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  about: {
    type: String,
  },
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }]
}, { timestamps: true })

module.exports = model('User', userSchema)
