const { Router } = require('express')
const { json: jsonParser } = require('body-parser')
const bcryptjs = require('bcryptjs')
const User = require('../models/User')
const { generateJWT } = require('../utils/jwt')

const router = Router()

router
  .post(
    '/auth/access-token',
    jsonParser(),
    async (req, res) => {
      try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
          return res.status(400).json({ errors: [{ message: 'Email or password is invalid.' }] })
        }
        const confirmPassword = await bcryptjs.compare(password, user.passwordHash)
        if (!confirmPassword) {
          return res.status(400).json({ errors: [{ message: 'Email or password is invalid.'}] })
        }

        const token = generateJWT(user._id, user.firstName, user.lastName, user.about)

        res.json({
          data: {
            token
          }
        })
      } catch (err) {
        res.status(500).json(err)
      }
    }
  )

module.exports = router
