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
  views: {
    type: Number,
    default: 0
  },
  votes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
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
