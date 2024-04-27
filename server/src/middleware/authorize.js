const authorize = (req, res, next) => {
  if (!req.session.user) {
    res.clearCookie('user')
    return res.sendStatus(403)
  }

  try {
    res.cookie(
      'user',
      JSON.stringify({
        email: req.session.user.email,
        mention: req.session.user.mention,
        displayName: req.session.user.displayName,
        bio: req.session.user.bio,
        image: req.session.user.image,
        followersCount: req.session.user.followersCount,
        followingCount: req.session.user.followingCount,
      }),
      { sameSite: 'strict' },
    )
    return next()
  } catch (err) {
    res.clearCookie('user')
    return res.sendStatus(403)
  }
}

/**
 * When we don't want a 403 to be sent which would cause the un-authenticated
 * user to be redirected. But we also can't process the requrest because we
 * require an authenticated session.
 */
const requireSession = (req, res, next) => {
  if (!req.session.user) {
    return res.sendStatus(204)
  }
  next()
}

const verifyAdmin = (req, res, next) => {
  const admin = req.session.user.admin

  if (!admin) return res.sendStatus(401)

  return next()
}

module.exports = {
  authorize,
  requireSession,
  verifyAdmin,
}
