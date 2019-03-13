const config = {};

config.development = {
  serverBaseUrl: process.env.SERVER_BASE_URL || 'http://localhost:8080',
  port: process.env.PORT || 8989,
  env: process.env.NODE_ENV,
};

config.staging = config.development;
config.production = config.development;

module.exports = config[process.env.NODE_ENV];
