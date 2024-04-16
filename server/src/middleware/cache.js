const cacheResponse = (timeInSeconds) => (req, res, next) => {
  // will be cached by the browser and the Digital Ocean CDN
  res.header('Cache-Control', `public, max-age=${timeInSeconds}`)
  next()
}

module.exports = {
  cacheResponse,
}
