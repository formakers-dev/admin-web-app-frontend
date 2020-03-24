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
      <b-field label="Email">
        <b-input v-model="email"
                 ref="email"
                 type="email"
                 required
        ></b-input>
      </b-field>
      <b-field label="Password">
        <b-input type="password"
                 v-model="password"
                 ref="password"
                 required
                 password-reveal
                 @keyup.native.enter="submit"
        ></b-input>
      </b-field>
      <b-field v-if="showSignUp" label="Re-Password">
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
        request({
          url: this.showSignUp ? '/api/auth/sign-up' : '/api/auth/login',
          method: 'post',
          data: body,
        }).then(res => {
          if(this.showSignUp){
            this.$buefy.toast.open({
              message: '정상적으로 가입 신청하였습니다. 가입 심사가 마무리 될 때까지 기다려주세요.',
              type: 'is-primary',
            });
            this.showSignUp = false;
          }else{
            this.$root.isLoggedIn = true;
            this.$router.push('/');
          }
        }).catch(err => {
          console.log(err);
          if(err.response.data){
            this.message = err.response.data.error;
          }else{
            this.$buefy.toast.open({
              message: '문제가 발생하였습니다.',
              type: 'is-danger',
            });
          }

        });
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
        this.message = '';
        return this.$refs.email.checkHtml5Validity() && this.$refs.password.checkHtml5Validity() && this.$refs.password2.checkHtml5Validity();
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
