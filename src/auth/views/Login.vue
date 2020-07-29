<template>
<section class="login-container is-vcentered">
    <section style="text-align: center">
        <img
          src="../../assets/logo.png"
          alt=""
          width="150px"
        />
    </section>
    <section style="margin-top: 20px">
      <b-field label="이메일">
        <b-input v-model="email"
                 ref="email"
                 type="email"
                 required
        ></b-input>
      </b-field>
      <b-field v-if="showSignUp" label="닉네임">
        <b-input v-model="nickName"
                 ref="nickName"
                 required
        ></b-input>
      </b-field>
    </section>
    <section style="margin-top: 20px">
      <b-field label="비밀번호">
        <b-input type="password"
                 v-model="password"
                 ref="password"
                 required
                 password-reveal
                 @keyup.native.enter="submit"
        ></b-input>
      </b-field>
      <b-field v-if="showSignUp" label="비밀번호 재입력">
        <b-input type="password"
                 v-model="password2"
                 ref="password2"
                 required
                 password-reveal
        ></b-input>
      </b-field>
      <p class="has-text-danger">{{message}}</p>
    </section>
    <section class="login-button-container">
      <b-button type="is-primary"
                @click="submit"
                style="font-weight: bold"
                expanded
      >{{ showSignUp ? '가입 요청' : '로그인'}}</b-button>
      <b-button type="is-primary"
                @click="showForm"
                style="font-weight: bold; margin-top:10px"
                expanded
      >{{ showSignUp ? '로그인하기' : '가입하기'}}</b-button>
    </section>
  </section>
</template>

<script>
import request from '../../common/utils/http';

export default {
  name: 'login',
  data() {
    return {
      buildType: process.env.NODE_ENV,
      email: '',
      password: '',
      password2: '',
      nickName: '',
      showSignUp: false,
      message: null
    }
  },
  created() {
    this.$root.isLoggedIn = false;
  },
  watch:{
    'showSignUp':{
      handler(value){
        this.email = '';
        this.nickName = '';
        this.password = '';
        this.password2 = '';
        this.message = '';
      },
      deep: true
    },
  },
  methods: {
    submit(){
      this.message='';
      if(this.validate()){
        const body = {
          email : this.email,
          password: this.password
        };

        if (this.showSignUp) {
          body.nickName = this.nickName;
        }

        request({
          url: this.showSignUp ? '/api/auth/sign-up' : '/api/auth/login',
          method: 'post',
          data: body,
        }).then(res => {
          if(this.showSignUp){
            this.$root.showSuccessToast('정상적으로 가입 신청하였습니다. 가입 심사가 마무리 될 때까지 기다려주세요.');
            this.showSignUp = false;
          }else{
            this.$root.isLoggedIn = true;
            this.$router.push('/');
          }
        }).catch(error => {
          if(error.response.data){
            this.message = error.response.data.error;
          }else{
            this.$root.showErrorToast('문제가 발생하였습니다.', error);
          }
        });
      }else{
        this.message='입력 값을 확인해주세요.';
      }
    },
    showForm(){
      this.message='';
      this.showSignUp = !this.showSignUp;
    },
    validate(){
      if(this.showSignUp){
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
      }else{
        return this.$refs.email.checkHtml5Validity() && this.$refs.password.checkHtml5Validity();
      }
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
