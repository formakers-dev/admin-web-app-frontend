<template>
<section class="login-container is-vcentered">
    <section style="text-align: center">
        <img
          src="../../assets/logo.png"
          alt=""
          width="150px"
        >
    </section>
    <section style="margin-top: 20px">
      <b-field label="이메일">
        <p>{{email}}</p>
      </b-field>
      <b-field label="닉네임">
        <b-input v-model="nickName"
                 ref="nickName"
                 required
        ></b-input>
      </b-field>
      <b-field label="현재 비밀번호">
        <b-input type="password"
                 v-model="currentPw"
                 ref="password"
                 required
                 password-reveal
        ></b-input>
      </b-field>
      <b-field v-if="modifyPassword" label="변경할 비밀번호">
        <b-input type="password"
                 v-model="password"
                 ref="password"
                 required
                 password-reveal
        ></b-input>
      </b-field>
      <b-field v-if="modifyPassword" label="변경할 비밀번호 재입력">
        <b-input type="password"
                 v-model="password2"
                 ref="password2"
                 required
                 password-reveal
        ></b-input>
      </b-field>
      <b-field>
        <b-checkbox v-model="modifyPassword">
          비밀번호 변경
        </b-checkbox>
      </b-field>
      <p class="has-text-danger">{{message}}</p>
    </section>
    <section class="login-button-container">
      <b-button type="is-primary"
                @click="submit"
                style="font-weight: bold"
                expanded
      >사용자 정보 수정하기</b-button>
    </section>
  </section>
</template>

<script>
import request from '../../common/utils/http';

export default {
  name: 'profile',
  data() {
    return {
      buildType: process.env.NODE_ENV,
      email: '',
      currentPw: '',
      password: '',
      password2: '',
      nickName: '',
      modifyPassword: false,
      message: null
    }
  },
  created() {
    this.getProfile();
  },
  watch:{
  },
  methods: {
    getProfile(){
      request.get('/api/admin/user/profile').then(res=>{
        this.email = res.data.email;
        this.nickName = res.data.nickName;
      }).catch(error=>{
        this.$root.showErrorToast('사용자 정보를 불러오는데 문제가 발생하였습니다.', error);
      });
    },
    submit(){
      this.message='';
      if(this.validate()){
        const body = {
          nickName : this.nickName,
          currentPw : this.currentPw
        };
        if(this.modifyPassword){
          body.password = this.password;
        }
        request.put('/api/admin/user/profile', body).then(res=>{
          this.$root.showSuccessToast('정상적으로 수정하였습니다.');
          if(this.modifyPassword){
            this.$root.showSuccessToast('다시 로그인해주세요.');
            this.$router.replace('/logout');
          }
        }).catch((error)=>{
          this.$root.showErrorToast('수정에 실패하였습니다.', error);
          if(error.response.status === 400){
            this.message= error.response.data.error;
          }
        });
      }else{
        this.message='입력 값을 확인해주세요.';
      }
    },
    validate(){
      if(this.password !== this.password2){
        this.message = "비밀번호가 같지 않습니다.";
        return false;
      }
      let isValid = true;
      for (let ref in this.$refs) {
        let checkValidity = this.$refs[ref].checkHtml5Validity();
        if(!checkValidity){
          isValid = false;
        }
      }
      return isValid;
    }
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
