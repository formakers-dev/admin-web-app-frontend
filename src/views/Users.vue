<template>
  <div class="users-container">
    <h1 class="title">포메스 유저 정보 관련 기능들</h1>
    <h2 class="subtitle">
      포메스 유저 정보를 좀 더 편하게 확인하고 싶은 모두의 염원이 만들어낸 페이지 🤗
    </h2>
    <br/>

    <div class="box">
      <h2 class="title">👀 닉네임 확인하기</h2>
      일단은 급한대로 1명의 닉네임만 검색하는 기능 먼저 만들어봤어요! 조만간 여러명도 만들게요!
      <div class="columns">
        <b-field class="column" label="이메일을 입력해주세요">
          <b-input v-model="email"></b-input>
        </b-field>
        <div class="buttons are-medium">
          <button class="button is-primary is-fullheightl"
                  v-on:click="getNickName"><b>>></b></button>
        </div>
        <b-field class="column" label="닉네임">
          <b-input v-model="nickName"></b-input>
        </b-field>
      </div>
    </div>

    <br/>
    <b-field v-if="result" label="Log">
      <b-message class="white-space-pre">{{ JSON.stringify(result, null, ' ') }}</b-message>
    </b-field>
  </div>
</template>

<script>
import request from '../common/http';

export default {
  name: 'Users',
  components: { },
  data() {
    return {
      email: '',
      nickName: '',
      result: '',
    };
  },
  created() {
    this.getAllPosts();
  },
  methods: {
    getNickName() {
      request.get(`/users/${this.email}/nick-name`)
        .then((res) => {
          console.log(res.data);
          this.nickName = res.data;
        })
        .catch((err) => {
          this.result = err;
          this.showErrorToast();
        });
    },
    showSuccessToast(toastMessage) {
      this.$toast.open({
        duration: 4000,
        message: toastMessage,
        type: 'is-success',
      });
    },
    showErrorToast() {
      this.$toast.open({
        duration: 4000,
        message: '실패! 로그를 확인하시오!',
        type: 'is-danger',
      });
    },
  },
};
</script>

<style scoped>
  .users-container {
    text-align: start;
    padding: 30px;
  }

  .white-space-pre {
    white-space: pre-wrap;
  }
</style>
