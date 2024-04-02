const express = require('express')
const fileUpload = require('express-fileupload')
const https = require('https')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()

const app = express()
const logger = require('./utils/logger')
const db = require('./database/models')

const { NODE_ENV } = process.env
const isProduction = NODE_ENV === 'production'

const PORT = isProduction ? 8080 : 3001

if (!isProduction) {
  const imagesDir = path.join(process.cwd(), '/images')
  app.use(express.static(imagesDir))
}

app.set('trust proxy', true)

app.use(
  morgan('combined', {
    skip(req, res) {
      return isProduction ? res.statusCode >= 200 : res.statusCode >= 500
    },
    stream: logger.stream,
  }),
)

// Body parser and helmet middleware
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

const whitelist = [process.env.DOMAIN, 'http://192.168.50.26:3001']
// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, true)
    },
    credentials: true,
  }),
)

app.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    responseOnLimit: 'Images must be under 10MB in size.',
    abortOnLimit: true,
    logger: logger,
  }),
)

// API Routes
require('./routes/auth')(app)
require('./routes/post')(app)
require('./routes/feed')(app)
require('./routes/like')(app)
require('./routes/profile')(app)
require('./routes/comment')(app)
require('./routes/test')(app)
require('./routes')(app)

// Error Handler
app.use((err, req, res, next) => {
  logger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.headers['x-real-ip']} - ${
      err.stack
    }`,
  )
  res.status(err.status || 500).send(err.message || 'Unexpected server error occurred.')
  next()
})

if (isProduction) {
  app.listen(PORT, () => logger.info(`Server listening on port ${PORT}`))
} else {
  logger.info(
    `HTTPS Dev server running. Make sure you manually navigate to https://localhost:3001 and 'accept the risk' so that the frontend can talk over https to the server`,
  )
  const httpsOptions = {
    key: fs.readFileSync(path.join(process.cwd(), '/config/localdev/cert.key')),
    cert: fs.readFileSync(path.join(process.cwd(), '/config/localdev/cert.crt')),
  }
  https.createServer(httpsOptions, app).listen(PORT)
}

module.exports = app
