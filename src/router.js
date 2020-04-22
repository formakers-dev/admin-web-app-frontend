import Vue from 'vue';
import Router from 'vue-router';
import Home from './home/views/Home.vue';
import NotificationManagement from './notification/views/NotificationManagement.vue';
import Events from './event/views/EventBannerManagement.vue';
import TestRegister from './views/TestRegister.vue';
import TestList from './views/TestList.vue';
import Users from './users/views/Users.vue';
import Login from './auth/views/Login.vue';
import Logout from './auth/views/Logout.vue';
import Requests from './requests/views/Requests';
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
      path: '/test/register',
      name: 'test-register',
      component: TestRegister,
    },
    {
      path: '/test/list',
      name: 'test-list',
      component: TestList,
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
    },
    {
      path: '/notification',
      name: 'notification-management',
      component: NotificationManagement,
    },
    {
      path: '/events',
      name: 'events',
      component: Events,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout,
    },
    {
      path: '/requests',
      name: 'requests',
      component: Requests,
    },
    {
      path: '*',
      name: 'Error404',
      component: Logout,
    },
  ],
});
