<template>
  <b-navbar type="is-black">
    <template slot="brand">
      <b-navbar-item tag="router-link" to="/">
        <div>
          <img
            src="https://contents.sixshop.com/uploadedFiles/107454/default/image_1572923068659.png"
            alt=""
          >
          <div class="build-type">{{buildType}}</div>
        </div>
      </b-navbar-item>
    </template>
    <template slot="start" v-if="$root.isLoggedIn">
      <b-navbar-item tag="router-link" to="/test/register">
        테스트 등록하기
      </b-navbar-item>
      <b-navbar-item tag="router-link" to="/test/list">
        테스트 목록
      </b-navbar-item>
      <b-navbar-item tag="router-link" to="/requests">
        의뢰 관리
      </b-navbar-item>
      <b-navbar-item tag="router-link" to="/users">
        사용자 정보 조회
      </b-navbar-item>
      <b-navbar-item tag="router-link" to="/notification">
        알림 관리
      </b-navbar-item>
      <b-navbar-item tag="router-link" to="events">
        이벤트 배너
      </b-navbar-item>
    </template>
    <template slot="end" v-if="$root.isLoggedIn">
      <b-navbar-item tag="router-link" to="/profile">
        <b-icon icon="account"></b-icon>
      </b-navbar-item>
      <b-navbar-item tag="router-link" to="/logout">
        <b-icon icon="logout"></b-icon>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
export default {
  name: 'Headers',
  data() {
    return {
      buildType: process.env.NODE_ENV,
    };
  },
};
</script>

<style scoped>
  a.navbar-item.router-link-exact-active.router-link-active{
    color: #00BFBA !important;
  }
  .navbar.is-black .navbar-start > a.navbar-item:hover{
    color: #00BFBA;
    font-weight: bold;
  }
  .navbar.is-black{
    background-color: #12121c;
  }
  nav{
    padding: 0 32px;
    margin-bottom: 30px;
  }
  .build-type{
    font-size:10px;
    text-align: center;
    margin-top: -10px;
    color: white;
    font-weight: bold;
  }
</style>
