import * as process from 'node:process';
export default () => ({
  app: {
    env: process.env.APP_ENV || 'development',
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    root: process.env.APPLICATION_ROOT,
  },
  swagger: {
    docsUrl: process.env.DOCS_URL || 'docs',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION,
  },
  mail: {
    host: process.env.MAIL_HOST,
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
    jwtVerificationSecret: process.env.JWT_VERIFICATION_TOKEN_SECRET,
    jwtVerificationExpiration:
      process.env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME,
  },
  videoSDK: {
    apiKey: process.env.VIDEOSDK_API_KEY,
    secretKey: process.env.VIDEOSDK_SECRET_KEY,
    apiEndpoint: process.env.VIDEOSDK_API_ENDPOINT,
  },
  firebaseConfig: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },

  cometChat: {
    appId: process.env.COMETCHAT_APP_ID,
    apiKey: process.env.COMETCHAT_API_KEY,
  },
});
