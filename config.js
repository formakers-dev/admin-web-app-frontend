const config = {};

config.development = {
  serverBaseUrl: process.env.VUE_APP_SERVER_BASE_URL || 'http://localhost:3000',
  port: process.env.VUE_APP_PORT || 8989,
  defaultURLs: {
    bugReportURL: '',
    playValidationSurvey: 'https://docs.google.com/forms/d/e/1FAIpQLScCqS2RkQJSb2vrbPA4hfcVWU-N2o6nisor8_FT7M-YudZH4A/viewform?usp=pp_url&entry.1817112629={email}&entry.1949077225={b-m-ids}',
    feedbackSurvey: 'https://docs.google.com/forms/d/e/1FAIpQLSd1oWwrrKNEPxdlsenNHuLUd6YeqQETHWb0pVXNFV0fDOn3MA/viewform?usp=pp_url&entry.1792507658={b-m-ids}&entry.1434060134={email}'
  },
};

config.staging = config.development;

config.production = {
  serverBaseUrl : config.development.serverBaseUrl,
  port: config.development.port,
  defaultURLs: {
    bugReportURL: 'https://docs.google.com/forms/d/e/1FAIpQLSfscoI2irgf1aWweAO6jt75OvQ3do-HNrHxtQcoKQzQ519T8Q/viewform?usp=pp_url&entry.1223559684={email}&entry.430293599=',
    playValidationSurvey: 'https://docs.google.com/forms/d/e/1FAIpQLSd_npIUx3P5vhWbZG1G9AsplInK33tBX97jXaxorM7_iyjKlw/viewform?usp=pp_url&entry.1593393622={b-m-ids}&entry.2062399367={email}',
    feedbackSurvey: '',
  },
};

module.exports = config[process.env.NODE_ENV];
