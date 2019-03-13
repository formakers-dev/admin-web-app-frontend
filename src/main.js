import Vue from 'vue';
import 'babel-polyfill';
import axios from 'axios';
import App from './App.vue';
import router from './router';

// Vue.prototype.$http = axios.create({
//   baseURL: process.env.BASE_URL,
//   withCredentials: true,
// });
Vue.prototype.$http = axios;
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
