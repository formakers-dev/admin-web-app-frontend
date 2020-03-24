import axios from 'axios';
import config from '../../../config';
import app from '../../main';
import cookie from 'vue-cookies';

const instance = axios.create({
  baseURL: config.serverBaseUrl,
  withCredentials: true,
});

function create(axiosInstance) {
  const interceptor = axiosInstance.interceptors.response.use(function(response){
    if(response.request.responseURL.indexOf('/auth/sign-up') > -1){
      return response;
    }
    axiosInstance.defaults.headers.common['Authorization'] = response.headers.authorization;
    app.setCookie(response.headers.authorization);
    app.isLoggedIn = true;
    return response;
  }, function(error){
    if(error.response.status === 403){
      app.removeCookie('access_token');
      delete axiosInstance.defaults.headers.common['Authorization'];
      app.$router.push('login');
    }
    return Promise.reject(error);
  });
}

create(instance);

export default instance;


