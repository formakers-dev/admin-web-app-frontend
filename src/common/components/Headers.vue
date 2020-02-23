<template>
  <div>
    <b-navbar type="is-black">
      <template slot="brand">
        <b-navbar-item tag="router-link" to="/">
          <img
            src="https://contents.sixshop.com/uploadedFiles/107454/default/image_1572923068659.png"
            alt=""
          >
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="router-link" to="/test/register">
          테스트 등록하기
        </b-navbar-item>
        <b-navbar-item tag="router-link" to="/test/list">
          테스트 목록
        </b-navbar-item>
        <b-navbar-item tag="router-link" to="/users">
          사용자 정보 조회
        </b-navbar-item>
        <b-navbar-item tag="router-link" to="/noti-sender">
          알림 보내기
        </b-navbar-item>
        <b-navbar-item tag="router-link" to="/reserved-noti">
          예약된 알림
        </b-navbar-item>
        <b-navbar-item tag="router-link" to="events">
          이벤트 배너
        </b-navbar-item>
      </template>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'Headers',
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
  nav{
    padding: 0 32px;
  }
</style>
