<template>
<section></section>
</template>

<script>
import request from '../../common/utils/http';

export default {
  name: 'logout',
  data() {
    return {
    }
  },
  created() {
    this.logout();
  },
  methods: {
    logout(){
      request.post('/api/auth/logout').then(res =>{
        this.$nextTick(function(){
          this.$root.isLoggedIn = false;
          this.$router.push('/login');
          location.reload();
        });
      }).catch(err => {
        this.$buefy.toast.open({
          message: '로그아웃에 실패하였습니다.',
          type: 'is-danger',
        });
        console.log(err.response);
      });
    },
  }
};
</script>

<style scoped>
  .login-container{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 420px !important;
    background-color: white;
    border: 1px solid lightgray;
    padding: 20px !important;
    border-radius: 6px;
    box-shadow: 0 2px 10px 0px rgba(0, 0, 0, 0.5);
  }
  .login-button-container{
    text-align: center;
    margin-top: 40px;
  }
</style>
