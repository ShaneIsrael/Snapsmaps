const { transports, createLogger, format } = require('winston')
const { combine, splat, timestamp, printf } = format
const environment = process.env.NODE_ENV || 'production'
// define the custom settings for each transport (file, console)
const options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    timestamp: true,
  },
}

const devTransports = [new transports.Console(options.console)]

const prodTransports = [new transports.Console(options.console)]

const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message} `
  if (Object.keys(metadata).length > 0) {
    msg += JSON.stringify(metadata)
  }
  return msg
})

const enumerateErrorFormat = format((info) => {
  if (info.message instanceof Error) {
    info.message = {
      message: info.message.message,
      stack: info.message.stack,
      ...info.message,
    }
  }

  if (info instanceof Error) {
    return {
      message: info.message,
      stack: info.stack,
      ...info,
    }
  }
  return info
})

// instantiate a new Winston Logger with the settings defined above
const logger = createLogger({
  format: combine(
    format.colorize(),
    splat(),
    timestamp(),
    enumerateErrorFormat(),
    myFormat,
    // format.json(),
  ),
  transports: environment !== 'development' ? prodTransports : devTransports,
  exitOnError: false, // do not exit on handled exceptions
})

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write(message, encoding) {
    logger.info(message)
  },
  log(message) {
    logger.info(message)
  },
}

module.exports = logger
