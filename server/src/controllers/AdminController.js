const { UserState } = require('../constants/UserState')
const Models = require('../database/models')
const { User } = Models
const controller = {}

controller.test = async (req, res, next) => {
  try {
    // const user = await User.findByPk(req.session.user.id)
    // user.state = UserState.Banned
    // user.save()
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
