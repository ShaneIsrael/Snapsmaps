import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import handlebars from 'handlebars'
import nodemailer from 'nodemailer'
import utils from '../utils'
import logger from '../utils/logger'

const { readHTMLFile } = utils

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const isProduction = process.env.NODE_ENV !== 'development'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURITY === 'ssl',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: process.env.SMTP_SECURITY === 'starttls' ? { rejectUnauthorized: false } : undefined,
})

const service = {}

service.sendVerificationEmail = async (email, token, name) => {
  if (isProduction) {
    readHTMLFile(`${__dirname}/../templates/EmailVerification.html`, async (err, html) => {
      if (err) {
        console.log('error reading file', err)
        return
      }
      const template = handlebars.compile(html)
      const replacements = {
        verification_link: `${process.env.DOMAIN}/verify/${email}/${token}`,
        domain: process.env.DOMAIN,
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

export default service
