const handlebars = require('handlebars')
const crypto = require('crypto')
const Models = require('../database/models')
const { readHTMLFile } = require('../utils')
const { User, Post, Collection, PostComment, Image } = Models
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
      return res.redirect('/404/post')
    }

    try {
      readHTMLFile(__dirname + '/../templates/shareMetadata.html', async (err, html) => {
        if (err) {
          console.log('error reading file', err)
          return
        }
        const template = handlebars.compile(html)
        const nonce = crypto.randomBytes(16).toString('hex')
        const replacements = {
          redirect_link: `/user/${post.user.mention}/${post.id}`,
          image_url: `https://cdn.snapsmaps.com${post.image.reference}`,
          title: `${post.user.displayName} • @${post.user.mention}`,
          description: post.title,
          nonce,
        }
        const htmlToSend = template(replacements)
        res.setHeader('Content-Type', 'text/html')
        res.setHeader('Content-Security-Policy', `script-src 'nonce-${nonce}'`)
        res.send(Buffer.from(htmlToSend))
      })
    } catch (err) {
      next(err)
    }
  } catch (err) {
    next(err)
  }
}

controller.collection = async (req, res, next) => {
  const { id } = req.params

  try {
    const collection = await Collection.findOne({
      where: { id },
      include: [{ model: User, attributes: ['displayName', 'mention', 'id'], include: [Image] }, Image],
    })

    if (!collection) {
      return res.redirect('/404/collection')
    }

    try {
      readHTMLFile(__dirname + '/../templates/shareMetadata.html', async (err, html) => {
        if (err) {
          console.log('error reading file', err)
          return
        }
        const template = handlebars.compile(html)
        const nonce = crypto.randomBytes(16).toString('hex')
        const replacements = {
          redirect_link: `/user/${collection.user.mention}/collection/${collection.id}`,
          image_url: `https://cdn.snapsmaps.com${collection.image.reference}`,
          title: `${collection.title} • @${collection.user.mention}`,
          description: `A photo collection created by ${collection.user.displayName}`,
          nonce,
        }
        const htmlToSend = template(replacements)
        res.setHeader('Content-Type', 'text/html')
        res.setHeader('Content-Security-Policy', `script-src 'nonce-${nonce}'`)
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
