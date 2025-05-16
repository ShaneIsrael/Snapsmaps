import fs from 'node:fs'
import https from 'node:https'
import path from 'node:path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import fileUpload from 'express-fileupload'
import session from 'express-session'
import helmet from 'helmet'
import morgan from 'morgan'

import SequelizeStoreInit from 'connect-session-sequelize'
const SequelizeStore = SequelizeStoreInit(session.Store)

import dotenv from 'dotenv'
import db from './database/models/index'
import logger from './utils/logger.js'

import Routes from './routes/index.js'

dotenv.config()

const app = express()
const { NODE_ENV } = process.env
const isProduction = NODE_ENV !== 'development'

const PORT = isProduction ? 8080 : 3001

if (!isProduction) {
  const imagesDir = path.join(process.cwd(), '/images')
  fs.mkdirSync(path.join(imagesDir, '/post'), { recursive: true })
  fs.mkdirSync(path.join(imagesDir, '/profile'), { recursive: true })
  fs.mkdirSync(path.join(imagesDir, '/collection'), { recursive: true })
  fs.mkdirSync(path.join(imagesDir, '/thumb/120x120'), { recursive: true })
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

app.use(helmet())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

const sessionStore = new SequelizeStore({
  db: db.sequelize,
  table: 'Sessions',
  extendDefaultFields: (defaults, session) => ({
    data: defaults.data,
    expires: defaults.expires,
    userId: session.user?.id,
    fcmToken: session.fcmToken,
  }),
})
app.use(
  session({
    secret: process.env.SECRET_KEY,
    store: sessionStore,
    resave: false,
    cookie: {
      httpOnly: true,
      sameSite: true,
      secure: process.env.SECURE_COOKIES === 'true',
      maxAge: 60 * 60 * 100,
    },
  }),
)

// CORS middleware
const allowedDomains = isProduction
  ? [process.env.DOMAIN, ...process.env.ALLOWED_DOMAINS.split(',')]
  : ['http://localhost:3000', 'https://localhost:3000']

logger.info(`Allowed domains: ${allowedDomains}`)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedDomains.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  }),
)

app.use(
  fileUpload({
    limits: { fileSize: process.env.MAX_UPLOAD_SIZE_IN_MB * 1024 * 1024 },
    responseOnLimit: `Images must be under ${process.env.MAX_UPLOAD_SIZE_IN_MB}MB in size.`,
    abortOnLimit: true,
    logger: logger,
  }),
)

app.use((req, res, next) => {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY
  if (googleMapsApiKey) {
    res.cookie('GoogleMapsApiKey', googleMapsApiKey, {
      httpOnly: false,
      secure: isProduction,
      sameSite: 'Lax',
    })
  }
  next()
})

new Routes(app)

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
    key: fs.readFileSync(path.join(process.cwd(), '/config/localdev/localhost.key')),
    cert: fs.readFileSync(path.join(process.cwd(), '/config/localdev/localhost.crt')),
  }
  https.createServer(httpsOptions, app).listen(PORT)
}

export default app
