const User = require("../models/User")

const emailValid = (email) => {
  const emailRegex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
  return emailRegex.test(email)
}

exports.validateNewUserBody = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body

  const errors = []

  if (firstName === undefined || firstName.trim() === '') {
    errors.push({
      message: 'First name is required.'
    })
  }

  if (lastName === undefined || lastName.trim() === '') {
    errors.push({
      message: 'Last name is required.'
    })
  }

  if (email === undefined || !emailValid(email)) {
    errors.push({
      message: 'Valid email address is required.'
    })
  }

  const user = await User.findOne({ email })
  if (user) {
    errors.push({
      message: 'Email address already in use.'
    })
  }

  if (password === undefined || password.trim().length < 8) {
    errors.push({
      message: 'Password is required. Password length >= 8'
    })
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors })
  }

  await next()
}

exports.validateNewArticleBody = async (req, res, next) => {
  const { title, text } = req.body

  const errors = []
  
  if (title === undefined || title.trim() === '') {
    errors.push({
      message: 'Article title is required.'
    })
  }

  if (text === undefined || text.trim() === '') {
    errors.push({
      message: 'Article text is required.'
    })
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors })
  }

  await next()
}
