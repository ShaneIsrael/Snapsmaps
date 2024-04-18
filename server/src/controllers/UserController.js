const { Op } = require('sequelize')
const Models = require('../database/models')
const { User, Image } = Models

const controller = {}

const PAGE_SIZE = 10

controller.search = async (req, res, next) => {
  try {
    const { page, query } = req.query
    const users = await User.findAll({
      attributes: ['displayName', 'mention', 'bio'],
      where: {
        [Op.or]: {
          displayName: {
            [Op.iLike]: `%${query}%`,
          },
          mention: {
            [Op.iLike]: `%${query}%`,
          },
        },
      },
      include: [{ model: Image, attributes: ['reference'] }],
      raw: true,
      nest: true,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    })
    res.status(200).send(users)
  } catch (err) {
    next(err)
  }
}

module.exports = controller
