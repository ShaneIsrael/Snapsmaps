/**
 * The cached content can be shared amongst all clients.
 * @param {number} timeInSeconds How long to cachethe response for.
 * @returns
 */
const publicCache = (timeInSeconds) => (req, res, next) => {
  res.header('Cache-Control', `public, max-age=${timeInSeconds}`)
  next()
}

/**
 * The cached content has client specific or private data
 * @param {number} timeInSeconds How long to cachethe response for.
 * @returns
 */
const privateCache = (timeInSeconds) => (req, res, next) => {
  res.header('Cache-Control', `private, max-age=${timeInSeconds}`)
  next()
}

export default {
  publicCache,
  privateCache,
}
