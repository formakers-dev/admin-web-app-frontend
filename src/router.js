import Vue from 'vue';
import Router from 'vue-router';
const Home = () => import('./Home.vue');
const NotificationManagement = () => import('./notifications/views/NotificationManagement.vue');
const Events = () => import('./event-banners/views/EventBannerManagement.vue');
const TestRegister = () => import('./beta-tests/views/TestRegister.vue');
const TestDetail = () => import('./beta-tests/views/TestDetail.vue');
const TestList = () => import('./beta-tests/views/TestList.vue');
const Users = () => import('./users/views/Users.vue');
const Login = () => import('./auth/views/Login.vue');
const Logout = () => import('./auth/views/Logout.vue');
const Profile = () => import('./auth/views/Profile.vue');
const Requests = () => import('./requests/views/Requests.vue');
const pointExchangeRequestList = () => import('./points/views/PointExchangeRequestList.vue');
const AwardRecords = () => import('./award-records/views/AwardRecords.vue');
const BetaTestsStatistics = () => import('./statistics/views/BetaTestsStatistics.vue');
const AppUsages = () => import('./app-usages/views/AppUsages.vue');

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
      path: '/test/detail',
      name: 'test-detail',
      component: TestDetail,
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
      path: '/app-usages',
      name: 'app-usages',
      component: AppUsages,
      props: (route) => ({
        appKey: route.query.app_key,
        value: route.query.value,
      }),
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
      path: '/point-exchange',
      name: 'pointExchange',
      component: pointExchangeRequestList,
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
      path: '/statistics/beta-tests',
      name: 'betaTestsStatistics',
      component: BetaTestsStatistics
    },
    {
      path: '*',
      name: 'Error404',
      component: Logout,
    },
  ],
});
