import Vue from 'vue';
import Buefy from 'buefy';
import moment from 'moment';
import 'buefy/dist/buefy.css';
import 'mdi/css/materialdesignicons.min.css';
import 'babel-polyfill';
import App from './App.vue';
import router from './router';
import VueCookies from 'vue-cookies';
import request from './common/utils/http';
import copyToClipboard from 'vue-clipboard2';

Vue.use(Buefy);
Vue.use(VueCookies);
Vue.use(copyToClipboard);

moment.locale('ko', {
  weekdays: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  weekdaysShort: ['일', '월', '화', '수', '목', '금', '토'],
});

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && to.path !== '/logout'){
    request.get('/api/auth/check').then(response=>{
      next();
    }, error => {
      console.log(error.response);
      next('/login');
    });
  }
  next();
});

const app = new Vue({
  router,
  data(){
    return {
      isLoggedIn : false,
  }
  },
  render: h => h(App),
  methods:{
    setCookie(token){
      const expires = '1d';
      const secure = true;
      const sameSite = 'none';
      this.$cookies.set('access_token', token, expires, null, null, secure, sameSite);
      this.$cookies.set('access_token', token, expires);
    },
    removeCookie(){
      this.$cookies.remove('access_token');
    },
    copy(text){
      this.$copyText(text).then(success =>{
        this.$buefy.toast.open({
          message: text + ' 를 복사하였습니다.',
          type: 'is-info',
        });
      }, error => {
        this.$buefy.toast.open({
          message: '복사에 실패하였습니다.',
          type: 'is-danger',
        });
      });
    },
    showToast(type, message){
      this.$buefy.toast.open({
        message: message,
        type: type,
      });
    },
    showSuccessToast(message){
      this.$buefy.toast.open({
        message: message,
        type: 'is-info',
      });
    },
    showErrorToast(message, error) {
      this.$buefy.toast.open({
        message: message,
        type: 'is-danger',
      });
      console.log(error.response);
    },
  }
});
app.$mount('#app');

export default app;
