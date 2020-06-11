import axios from 'axios';
import config from '../../../config';
import app from '../../main';

const instance = axios.create({
  baseURL: config.serverBaseUrl,
  withCredentials: true,
});

function create(axiosInstance) {
  const requestInterceptor = axiosInstance.interceptors.request.use(function(config){
    app.isLoading = true;
    return config;
  }, function(error){
    app.isLoading = false;
    return Promise.reject(error);
  });
  const responseInterceptor = axiosInstance.interceptors.response.use(function(response){
    app.isLoading = false;
    if(response.request.responseURL.indexOf('/api/auth/sign-up') > -1){
      return response;
    }
    if(response.request.responseURL.indexOf('/api/auth/logout') > -1){
      app.removeCookie('access_token');
      delete axiosInstance.defaults.headers.common['Authorization'];
      return response;
    }
    axiosInstance.defaults.headers.common['Authorization'] = response.headers.authorization;
    app.setCookie(response.headers.authorization);
    app.isLoggedIn = true;
    return response;
  }, function(error){
    app.isLoading = false;
    if(error.response.status === 403){
      app.removeCookie('access_token');
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
    return Promise.reject(error);
  });
}

create(instance);

export default instance;


