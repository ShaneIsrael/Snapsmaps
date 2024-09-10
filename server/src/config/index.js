module.exports = {
  environment: process.env.NODE_ENV || 'development',
  app: {
    maxPostTitleLength: 500,
    maxPostCommentLength: 750,
    maxProfileBioLength: 1000,
    maxDisplayNameLength: 32,
    maxMentionLength: 20,
    maxPasswordLength: 64,
    maxCollectionTitleLength: 20,
  },
  admins: ['shanemisrael@gmail.com', 'sethwelch85@gmail.com'],
  development: {
    spaces: {
      edge: null,
      origin: null,
    },
    aws: {
      endpoint: null,
      access_key_id: null,
      access_key_secret: null,
    },
  },
  production: {
    spaces: {
      edge: 'https://cdn.snapsmaps.com',
      origin: 'https://snapsmaps.sfo2.digitaloceanspaces.com',
    },
    aws: {
      endpoint: 'sfo2.digitaloceanspaces.com',
      access_key_id: process.env.S3_ACCESS_KEY,
      access_key_secret: process.env.S3_SECRET_KEY,
    },
  },
}
