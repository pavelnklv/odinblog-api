const { sign, verify } = require('jsonwebtoken')

exports.generateJWT = (id, firstName, lastName, about) =>
  sign({ id, firstName, lastName, about }, process.env.SECRET, { expiresIn: '7d' })

exports.verifyJWT = (token) => verify(token, process.env.SECRET)
