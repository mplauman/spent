import process from 'process';

const env = process.env;

export default {
  port: env.PORT || 8080,
  host: env.HOST || '0.0.0.0',
  googleAppId: env.GOOGLE_APP_ID,
  linkedinAppId: env.LINKEDIN_APP_ID
};
