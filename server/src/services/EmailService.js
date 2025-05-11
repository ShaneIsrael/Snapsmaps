const nodemailer = require('nodemailer')
const handlebars = require('handlebars')
const logger = require('../utils/logger')
const { readHTMLFile } = require('../utils')

const isProduction = process.env.NODE_ENV !== 'development'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
})

const service = {}

service.sendVerificationEmail = async (email, token, name) => {
  if (isProduction) {
    readHTMLFile(__dirname + '/../templates/EmailVerification.html', async (err, html) => {
      if (err) {
        console.log('error reading file', err)
        return
      }
      const template = handlebars.compile(html)
      const replacements = {
        verification_link: `${process.env.DOMAIN}/verify/${email}/${token}`,
      }
      const htmlToSend = template(replacements)
      try {
        await transporter.sendMail({
          from: `Snapsmaps <${process.env.SMTP_EMAIL}>`,
          to: `${name} <${email}>`,
          subject: 'Account Verification',
          html: htmlToSend,
        })
        logger.info(`sent verification email to: ${email}`)
      } catch (err) {
        logger.error(`failed to send verification email to: ${email}`)
        throw err
      }
    })
  }
}

module.exports = service
