<template>
  <div class="users-container">
    <h1 class="title">포메스 유저 정보 관련 기능들</h1>
    <h2 class="subtitle">
      포메스 유저 정보를 좀 더 편하게 확인하고 싶은 모두의 염원이 만들어낸 페이지 🤗
    </h2>
    <br/>

    <div class="box">
      <h2 class="title">👀 닉네임 확인하기</h2>
      <div class="box">
        <div class="subtitle"><strong>☝🏻️1명만 검색하기</strong></div>
        <div class="columns">
          <b-field class="column" label="이메일을 입력해주세요">
            <b-input v-model="email"></b-input>
          </b-field>
          <div class="buttons are-medium">
            <button class="button is-primary is-fullheightl"
                    v-on:click="getNickName"><b>>></b></button>
          </div>
          <b-field class="column" label="닉네임">
            {{nickName}}
            <!--          <button v-if="nickName" class="button is-warning is-small">복사</button>-->
          </b-field>
        </div>
      </div>
      <br/>
      <div class="box">
        <div class="subtitle"><strong>✌🏻여러명 검색하기</strong></div>
        mongoDB 특성상 결과값 순서가 랜덤으로 나오게 됩니다ㅎㅎㅎㅎㅎㅎㅎ.......
        <div class="columns">
          <b-field class="column" label="이메일을 1개 이상 입력해주세요">
            각 이메일들은 쉼표(,)나 엔터로 구분해주세요!
            <b-input v-model="emails" type="textarea"></b-input>
          </b-field>
          <div class="buttons are-medium">
            <button class="button is-primary is-fullheightl"
                    v-on:click="getNickNames"><b>>></b></button>
          </div>
          <b-field class="column" label="결과 리스트">
            <b-table
              :data="nickNames"
              :loading="isLoading">

              <template slot-scope="props">
                <b-table-column field="email" label="이메일" centered>
                  <strong>{{ props.row.email }}</strong>
                </b-table-column>

                <b-table-column field="nickName" label="닉네임" centered>
                  <strong>{{ props.row.nickName }}</strong>
                </b-table-column>
              </template>
            </b-table>
          </b-field>
        </div>
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
      emails: '',
      nickNames: [],
      email: '',
      nickName: '',
      result: '',
      isLoading: false,
    };
  },
  watch: {
    email() {
      this.nickName = '';
    },
  },
  methods: {
    getNickNames() {
      this.isLoading = true;
      this.nickNames = [];
      const emailList = this.emails ? this.emails.split(/[,\s\n]+/) : [];
      emailList.forEach((email) => {
        // 일단 한명씩 쏘도록하고 여러명 가져오는건 천천히 만들자
        request.get(`/users/${email}/nick-name`)
          .then((res) => {
            this.isLoading = false;
            if (res.status === 204) {
              this.nickNames.push({
                email: res.data.email,
                nickName: '존재하지 않는 유저',
              });
            } else {
              this.nickNames.push({
                email: res.data.email,
                nickName: res.data.nickName,
              });
            }
          }).catch((err) => {
            this.isLoading = false;
            this.result = err;
            this.showErrorToast('실패! 로그를 확인하시오!');
          });
      });
    },
    getNickName() {
      this.isLoading = true;
      request.get(`/users/${this.email}/nick-name`)
        .then((res) => {
          this.isLoading = false;
          if (res.status === 204) {
            this.showErrorToast('존재하지 않는 유저입니다! 이메일 주소를 다시 확인해보세요!');
          } else {
            this.nickName = res.data.nickName;
          }
        })
        .catch((err) => {
          this.isLoading = false;
          this.result = err;
          this.showErrorToast('실패! 로그를 확인하시오!');
        });
    },
    showSuccessToast(toastMessage) {
      this.$toast.open({
        duration: 4000,
        message: toastMessage,
        type: 'is-success',
      });
    },
    showErrorToast(errorMessage) {
      this.$toast.open({
        duration: 4000,
        message: errorMessage,
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
