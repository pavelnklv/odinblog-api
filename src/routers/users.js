const { Router } = require('express')
const { json: jsonParser } = require('body-parser')
const bcryptjs = require('bcryptjs')
const { validateNewUserBody } = require('../middlewares/validators')
const User = require('../models/User')
const authenticate = require('../middlewares/authenticate')
const { generateJWT } = require('../utils/jwt')

const router = Router()

router
  .post(
    '/users',
    jsonParser(),
    validateNewUserBody,
    async (req, res) => {
      try {
        const { firstName, lastName, email, password, about } = req.body

        const passwordHash = await bcryptjs.hash(password, 12)

        const newUser = new User({ firstName, lastName, email, passwordHash, about })
        const user = await newUser.save()

        const token = generateJWT(user._id, user.firstName, user.lastName, user.about)

        res.status(201).json({
          data: {
            user,
            token
          }
        })
      } catch (err) {
        res.status(500).json(err)
      }
    }
  )
  .get(
    // TODO: add pagination: req.query.page and req.query.per-page
    '/users',
    async (req, res) => {
      try {
        // const { page, size } = req.query
        const users = await User.find().select('firstName lastName about').sort({ lastName: -1 })
        res.json({
          users
        })
      } catch (err) {
        res.status(500).json(err)
      }
    }
  )
  .get(
    '/me',
    authenticate,
    async (req, res) => {
      try {
        res.json({
          data: {
            me: res.locals.me
          }
        })
      } catch (err) {
        res.status(500).json(err)
      }
    }
  )

module.exports = router
