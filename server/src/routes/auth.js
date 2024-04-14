const { register, login, logout, hasSession, verifyEmail } = require('../controllers/AuthController')
const { authorize } = require('../middleware/authorize')

module.exports = (app) => {
  app.post('/api/auth/register', register)
  app.post('/api/auth/login', login)
  app.post('/api/auth/logout', authorize, logout)
  app.get('/api/auth/session', hasSession)
  app.get('/api/auth/verify/:email/:token', verifyEmail)
}
