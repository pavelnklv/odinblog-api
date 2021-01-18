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
          await newComment.save()
          const comment = await Comment.findById(newComment._id)
            .populate({ path: 'author', select: { _id: 1, firstName: 1, lastName: 1 } })

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
  .delete(
    '/comments/:commentId',
    authenticate,
    async (req, res) => {
      try {
        const me = res.locals.me
        const comment = await Comment.findById(req.params.commentId)
        if (!comment) {
          return res.end()
        } else if (comment.author.toString() !== me._id.toString()) {
          return res.status(403).json({ message: 'Forbidden' })
        }
        await Comment.deleteOne({ _id: req.params.commentId})
        return res.end()
      } catch (err) {
        console.log(err);
        res.status(500).json(err)
      }
    }
  )

module.exports = router
