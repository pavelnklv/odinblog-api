const { Schema, model } = require('mongoose')

const articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  text: {
    type: String
  },
  votes: {
    type: Number,
    default: 0
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{
    type: String,
  }],
  published: {
    type: Boolean,
    default: false
  },
  comments: [{
    type: Schema.Types.String,
    ref: 'Comment',
  }]
}, { timestamps: true })

module.exports = model('Article', articleSchema)
