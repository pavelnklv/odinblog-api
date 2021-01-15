const User = require("../models/User")
const { verifyJWT } = require("../utils/jwt")

module.exports = async (req, res, next) => {
  const { authorization } = req.headers
  if (authorization) {
    const [tokenType, token] = authorization.split(' ')

    const JWTPayload =  verifyJWT(token)
    if (tokenType === 'Bearer' || JWTPayload) {

      res.locals.me = await User.findById(JWTPayload.id)

      await next()
    }
  } else {
    res.status(401).json({ error: { message: 'Authorization required.'}})
  }
}
