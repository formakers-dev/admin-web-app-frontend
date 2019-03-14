<template>
<div class="noti-sender">
  <h1>🚨 알림 보내기 🚨</h1>
  알림을 좀 더 편하게 보내고 싶은 모두의 염원이 만들어낸 페이지 🤗
  <br><br>

  <input type="radio" id="individual" value="individual" v-model="notiType">
  <label for="individual">개별</label>
  <input type="radio" id="topic" value="topic" v-model="notiType">
  <label for="topic">단체(토픽)</label>
  <br>

  <div class="noti-individual">
    <table align="center">
      <tr>
        <td>
          <label for="noti-channel">Channel : </label>
        </td>
        <td>
          <input id="noti-channel" type="text" v-model="noti.channel"/><br/>
        </td>
      </tr>
      <tr>
        <td>
          <label for="noti-title">Title : </label>
        </td>
        <td>
          <input id="noti-title" type="text" v-model="noti.title"/><br/>
        </td>
      </tr>
      <tr>
        <td>
          <label for="noti-subtitle">Subtitle : </label>
        </td>
        <td>
          <textarea id="noti-subtitle" v-model="noti.subTitle"></textarea><br/>
        </td>
      </tr>
      <tr>
        <div  v-if="notiType === 'individual'">
         <td>
            <label for="noti-emails">Emails : </label>
          </td>
         <td>
            <textarea id="noti-emails" v-model="emails"></textarea><br/>
          </td>
        </div>
        <div class="noti-topic" v-else-if="notiType === 'topic'">
          <td>
            <label for="noti-topic">Topic : </label>
          </td>
          <td>
            <input id="noti-topic" type="text" v-model="topic"/><br/>
          </td>
        </div>
      </tr>
    </table>
  </div>

  <button v-if="notiType === 'individual'"
          v-on:click="sendNoti">개별 전송</button>

  <button v-if="notiType === 'topic'"
          v-on:click="sendNotiByTopic"
          v-bind:disabled="disabled">단체(토픽) 전송</button>
  <p>{{ result }}</p>
</div>
</template>

<script>
import request from '../common/http';

export default {
  name: 'NotiSender',
  data() {
    return {
      // 채널은 나중에 디비에서 리스트를 가져올 수 있지 않을까?
      noti: {
        channel: '',
        title: '',
        subTitle: '',
      },
      emails: 'yenarue@gmail.com, copyx00@gmail.com',
      topic: 'notice-all',
      result: '',
      notiType: 'individual',
    };
  },
  computed: {
    disabled() {
      return !this.topic || this.topic.length <= 0;
    },
  },
  methods: {
    sendNoti() {
      const splitedEmails = this.emails ? this.emails.split(/[,\s\n]+/) : [];
      const body = {
        data: this.noti,
        emails: splitedEmails,
      };

      request.post('/noti', body)
        .then((result) => {
          this.result = result;
        });
    },
    sendNotiByTopic() {
      const body = {
        data: this.noti,
      };

      request.post(`/noti/topics/${this.topic}`, body)
        .then((result) => {
          this.result = result;
        });
    },
  },
};
</script>

<style scoped>
.noti-sender {
  text-align: start;
  padding: 30px;
}

</style>
