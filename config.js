const config = {};

config.development = {
  serverBaseUrl: process.env.VUE_APP_SERVER_BASE_URL || 'http://localhost:3000',
  port: process.env.VUE_APP_PORT || 8989,
};

config.staging = config.development;
config.production = config.development;

module.exports = config[process.env.NODE_ENV];
