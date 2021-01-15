const { Router } = require('express')
const { json: jsonParser } = require('body-parser')
const authenticate = require('../middlewares/authenticate')
const { validateNewArticleBody } = require('../middlewares/validators')
const slugify = require('../utils/slugify')
const Article = require('../models/Article')

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
        let { page, limit } = req.query
        const skip = (page - 1) * limit
        limit = Number.parseInt(limit)

        const articles = await Article.find()
          .populate('author')
          .sort('-createdAt')
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
          }
        })
      } catch (err) {
        res.status(500).json(err)
      }
    }
  )
  .get(
    '/articles/:slug',
    async (req, res) => {
      try {
        const article = await Article.findOne({ slug: req.params.slug }).populate('author')

        res.json({
          data: {
            article
          }
        })
      } catch (err) {
        res.status(500).end(err)
      }
    }
  )

module.exports = router
