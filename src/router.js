import Vue from 'vue';
import Router from 'vue-router';
const Home = () => import('./home/views/Home.vue');
const NotificationManagement = () => import('./notification/views/NotificationManagement.vue');
const Events = () => import('./event/views/EventBannerManagement.vue');
const TestRegister = () => import('./test/views/TestRegister.vue');
const TestList = () => import('./test/views/TestList.vue');
const Users = () => import('./users/views/Users.vue');
const Login = () => import('./auth/views/Login.vue');
const Logout = () => import('./auth/views/Logout.vue');
const Profile = () => import('./auth/views/Profile.vue');
const Requests = () => import('./requests/views/Requests.vue');
const AwardRecords = () => import('./award-records/views/AwardRecords.vue');

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
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/award-records',
      name: 'awardRecords',
      component: AwardRecords
    },
    {
      path: '*',
      name: 'Error404',
      component: Logout,
    },
  ],
});
