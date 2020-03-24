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

Vue.use(Buefy);
Vue.use(VueCookies);

moment.locale('ko', {
  weekdays: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  weekdaysShort: ['일', '월', '화', '수', '목', '금', '토'],
});

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && to.path !== '/logout'){
    request.get('/auth/check').then(response=>{
      console.log(response);
      //cookie 셋팅 및 header 셋팅
      next();
    }, error => {
      //cookie 제거 및 header 초기화
      console.log(error);
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
      const expires = (process.env.NODE_ENV === 'development' ? '1h' : '1d');
      const secure = true;
      const sameSite = 'none';
      this.$cookies.set('access_token', token, expires, null,null, secure, sameSite);
    },
    removeCookie(){
      this.$cookies.remove('access_token');
    },
  }
});
app.$mount('#app');

export default app;
