import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import NotiSender from './components/NotiSender.vue';
import ReservedNoti from './components/ReservedNoti.vue';
import Events from './components/Events.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/noti-sender',
      name: 'noti-sender',
      component: NotiSender,
    },
    {
      path: '/reserved-noti',
      name: 'reserved-noti',
      component: ReservedNoti,
    },
    {
      path: '/events',
      name: 'events',
      component: Events,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});
