const handlebars = require('handlebars')
const Models = require('../database/models')
const { readHTMLFile } = require('../utils')
const { User, Post, PostComment, Image } = Models
const controller = {}

controller.post = async (req, res, next) => {
  const { id } = req.params

  try {
    const post = await Post.findOne({
      where: { id },
      order: [[PostComment, 'createdAt', 'asc']],
      include: [
        { model: User, attributes: ['displayName', 'mention', 'id'], include: [Image] },
        Image,
        {
          model: PostComment,
          include: [{ model: User, include: [Image] }],
        },
      ],
    })

    if (!post) {
      return res.sendStatus(404)
    }

    try {
      readHTMLFile(__dirname + '/../templates/sharePostMetadata.html', async (err, html) => {
        if (err) {
          console.log('error reading file', err)
          return
        }
        const template = handlebars.compile(html)
        const replacements = {
          redirect_link: `https://snapsmaps.com/user/${post.user.mention}/${post.id}`,
          image_url: `https://cdn.snapsmaps.com${post.image.reference}`,
          description: post.title,
        }
        const htmlToSend = template(replacements)
        res.setHeader('Content-Type', 'text/html')
        res.send(Buffer.from(htmlToSend))
      })
    } catch (err) {
      next(err)
    }
  } catch (err) {
    next(err)
  }
}

module.exports = controller
