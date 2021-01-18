const User = require("../models/User")
const { verifyJWT } = require("../utils/jwt")

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers
    if (authorization) {
      const [tokenType, token] = authorization.split(' ')

      const JWTPayload =  verifyJWT(token)
      if (tokenType === 'Bearer' || JWTPayload) {

        res.locals.me = await User.findById(JWTPayload.id)
          .select({ following: 0, passwordHash: 0, updatedAt: 0, __v: 0 })

        await next()
      }
    } else {
      res.status(401).json({ error: { message: 'Authorization required.'}})
    }
  } catch (err) {
    res.status(401).json({ error: { message: 'Authorization required.'}})
  }
}
