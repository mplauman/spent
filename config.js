import process from 'process';

const env = process.env;

export default {
  port: env.PORT || 8080,
  host: env.HOST || '0.0.0.0',
  googleAppId: env.GOOGLE_APP_ID,
  linkedinAppId: env.LINKEDIN_APP_ID,
  userIdHashFudge: env.USER_ID_HASH_FUDGE,
  userKeyHashFudge: env.USER_KEY_HASH_FUDGE
};
