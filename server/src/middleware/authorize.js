const authorize = (req, res, next) => {
  console.log(req.session)
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
    )
    return next()
  } catch (err) {
    res.clearCookie('user')
    return res.sendStatus(403)
  }
}
const verifyAdmin = (req, res, next) => {
  const admin = req.session.user.admin

  if (!admin) return res.sendStatus(401)

  return next()
}

module.exports = {
  authorize,
  verifyAdmin,
}
