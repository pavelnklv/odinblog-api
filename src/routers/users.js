const { Router } = require('express')
const { json: jsonParser } = require('body-parser')
const bcryptjs = require('bcryptjs')
const { validateNewUserBody } = require('../middlewares/validators')
const User = require('../models/User')

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

        res.status(201).json({
          data: {
            user
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

module.exports = router
