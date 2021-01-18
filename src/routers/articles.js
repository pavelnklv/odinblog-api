const { Router } = require('express')
const { json: jsonParser } = require('body-parser')
const authenticate = require('../middlewares/authenticate')
const { validateNewArticleBody } = require('../middlewares/validators')
const slugify = require('../utils/slugify')
const Article = require('../models/Article')
const Comment = require('../models/Comment')

const router = Router()

router
  .post(
    '/articles',
    authenticate,
    jsonParser(),
    validateNewArticleBody,
    async (req, res) => {
      try {
        const { title, text, tags, published } = req.body
        const slug = `${slugify(title)}-${Date.now()}`
        const author = res.locals.me._id

        const newArticle = new Article({ title, slug, text, author, tags, published })
        const article = await newArticle.save()

        res.status(201).json({
          data: {
            article
          }
        })
      } catch (err) {
        res.status(500).json(err)
      }
    }
  )
  .get(
    '/articles',
    async (req, res) => {
      try {
        let { page, limit, sort} = req.query
        const skip = (page - 1) * limit
        limit = Number.parseInt(limit)

        const articles = await Article.find({ published: true })
          .populate({
            path: 'author',
            select: {
              _id: 1,
              firstName: 1,
              lastName: 1
            }
          })
          .select({ comments: 0 })
          .sort(sort || '-createdAt')
          .skip(skip)
          .limit(limit)
          
        const pagesCount = await Article.countDocuments() / limit

        res.json({
          data: {
            articles
          },
          meta: {
            pagesCount,
            skip,
            limit
          },
        })
      } catch (err) {
        res.status(500).json(err)
      }
    }
  )
  .get(
    '/articles/me/drafts',
    authenticate,
    async (req, res) => {
      try {
        console.log(res.locals.me._id)
        const articles = await Article.find({
            published: false,
            author: res.locals.me._id
          })
          .select({ comments: 0 })
          .sort('-createdAt')

        res.json({
          data: {
            articles
          }
        })
      } catch (err) {
        res.status(500).json({ error: { message: 'Internal Server Error' } })
      }
    }
  )

  .get(
    '/articles/:slug',
    async (req, res) => {
      try {
        const article = await Article.findOne({ slug: req.params.slug }).populate('author')
        if (article) {
          article.views++;
          await article.save

          res.json({
            data: {
              article
            }
          })
        } else {
          res.status(404).json({ error: { message: 'Not Found' }})
        }
      } catch (err) {
        res.status(500).end(err)
      }
    }
  )
  .get(
    '/articles/:articleSlug/comments',
    async (req, res) => {
      try {
        const { articleSlug } = req.params

        const comments = await Comment.find({ article: articleSlug })
          .populate({ path: 'author', select: { _id: 1, firstName: 1, lastName: 1 }})
          .sort('-createdAt')

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
