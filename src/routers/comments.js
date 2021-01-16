const { Router } = require('express')
const { json: jsonParser } = require('body-parser')
const authenticate = require('../middlewares/authenticate')
const Article = require('../models/Article')
const Comment = require('../models/Comment')

const router = Router()

router
  .post(
    '/comments',
    authenticate,
    jsonParser(),
    async (req, res) => {
      try {
        let { articleSlug, text } = req.body
        const author = res.locals.me

        const article = await Article.findOne({ slug: articleSlug })
        if (article && text && text.trim() !== '') {
          const newComment = new Comment({ article: article.slug, author: author._id, text })
          const comment = await newComment.save()

          res.status(201).json({
            data: {
              comment
            }
          })
        } else {
          res.status(400).json({ errors: [{ message: 'Bad request.' }] })
        }
      } catch (err) {
        res.status(500).json(err)
      }
    }
  )
  .get(
    '/comments/:articleSlug',
    async (req, res) => {
      try {
        const { articleSlug } = req.params

        const comments = await Comment.find({ article: articleSlug }).sort('-createdAt')

        res.json({
          data: {
            comments
          }
        })
      } catch (err) {
        res.status(500).json({ err })
      }
    }
  )

module.exports = router
