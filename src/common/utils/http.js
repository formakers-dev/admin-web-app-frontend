import axios from 'axios';
import config from '../../../config';
import app from '../../main';

const instance = axios.create({
  baseURL: config.serverBaseUrl,
  withCredentials: true,
});

function create(axiosInstance) {
  const interceptor = axiosInstance.interceptors.response.use(function(response){
    app.isLoggedIn = true;
    return response;
  }, function(error){
    if(error.response.status === 440){
      app.$router.push('login');
    }
    return Promise.reject(error);
  });
}

create(instance);

export default instance;


