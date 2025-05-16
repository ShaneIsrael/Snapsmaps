import crypto from 'node:crypto'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import handlebars from 'handlebars'
import Models from '../database/models'
import utils from '../utils'
const { User, Post, Collection, PostComment, Image } = Models
const controller = {}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
      utils.readHTMLFile(`${__dirname}/../templates/shareMetadata.html`, async (err, html) => {
        if (err) {
          console.log('error reading file', err)
          return
        }
        const template = handlebars.compile(html)
        const nonce = crypto.randomBytes(16).toString('hex')
        const replacements = {
          redirect_link: `/user/${post.user.mention}/${post.id}`,
          image_url: `${process.env.DOMAIN}${post.image.reference}`,
          title: `${post.user.displayName} • @${post.user.mention}`,
          description: post.title,
          site_name: process.env.SITE_NAME,
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
      utils.readHTMLFile(`${__dirname}/../templates/shareMetadata.html`, async (err, html) => {
        if (err) {
          console.log('error reading file', err)
          return
        }
        const template = handlebars.compile(html)
        const nonce = crypto.randomBytes(16).toString('hex')
        const replacements = {
          redirect_link: `/user/${collection.user.mention}/collection/${collection.id}`,
          image_url: `${process.env.DOMAIN}${collection.image.reference}`,
          title: `${collection.title} • @${collection.user.mention}`,
          description: `A photo collection created by ${collection.user.displayName}`,
          site_name: process.env.SITE_NAME,
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

export default controller
