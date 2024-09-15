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
    firebase: {},
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
    firebase: {
      type: 'service_account',
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-95srz%40snapsmaps-bdb45.iam.gserviceaccount.com',
      universe_domain: 'googleapis.com',
    },
  },
}
