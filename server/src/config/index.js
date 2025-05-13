module.exports = {
  environment: process.env.NODE_ENV || 'development',
  app: {
    maxPostTitleLength: 500,
    maxPostCommentLength: 750,
    maxProfileBioLength: 1000,
    maxDisplayNameLength: 32,
    maxMentionLength: 20,
    maxPasswordLength: 64,
    maxCollectionTitleLength: 35,
  },
  admins: process.env.ADMINS?.split(','),
  contentRoot: process.env.NODE_ENV !== 'development' ? '/content' : process.cwd(),
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpEmail: process.env.SMTP_EMAIL,
  smtpPassword: process.env.SMTP_PASSWORD,
  isProduction: process.env.NODE_ENV !== 'development',
}
