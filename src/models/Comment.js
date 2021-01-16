const { Schema, model } = require('mongoose')

const commentSchema = new Schema({
  article: {
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
}, { timestamps: true })

module.exports = model('Comment', commentSchema)
