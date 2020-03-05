import Vue from 'vue';
import Buefy from 'buefy';
import moment from 'moment';
import 'buefy/dist/buefy.css';
import 'mdi/css/materialdesignicons.min.css';
import 'babel-polyfill';
import axios from 'axios';
import App from './App.vue';
import router from './router';

Vue.use(Buefy);

moment.locale('ko', {
  weekdays: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  weekdaysShort: ['일', '월', '화', '수', '목', '금', '토'],
});

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
