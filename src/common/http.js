import axios from 'axios';
import config from '../../config';

module.exports = axios.create({
  baseURL: config.serverBaseUrl,
  withCredentials: true,
});
