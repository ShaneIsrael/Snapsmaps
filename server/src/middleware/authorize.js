const jwt = require('jsonwebtoken')

const authorize = (req, res, next) => {
  const token = req.cookies.session

  if (!token) {
    res.clearCookie('session')
    res.clearCookie('user')
    return res.sendStatus(403)
  }

  try {
    const data = jwt.verify(token, process.env.SECRET_KEY)
    req.user = data
    return next()
  } catch (err) {
    res.clearCookie('session')
    res.clearCookie('user')
    return res.sendStatus(403)
  }
}
const verifyAdmin = (req, res, next) => {
  const admin = req.user.admin

  if (!admin) return res.sendStatus(401)

  return next()
}

const isAuthenticated = (sessionCookie) => {
  if (!sessionCookie) return false

  try {
    const data = jwt.verify(sessionCookie, process.env.SECRET_KEY)
    return data
  } catch (err) {
    return false
  }
}

module.exports = {
  authorize,
  isAuthenticated,
  verifyAdmin,
}
