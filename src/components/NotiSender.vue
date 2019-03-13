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

  <div class="noti-individual" v-if="notiType === 'individual'">
    <table align="center">
      <tr>
        <td>
          <label for="noti-channel">Channel : </label>
        </td>
        <td>
          <input id="noti-channel" type="text" v-model="channel"/><br/>
        </td>
      </tr>
      <tr>
        <td>
          <label for="noti-title">Title : </label>
        </td>
        <td>
          <input id="noti-title" type="text" v-model="title"/><br/>
        </td>
      </tr>
      <tr>
        <td>
          <label for="noti-subtitle">Subtitle : </label>
        </td>
        <td>
          <textarea id="noti-subtitle" v-model="subTitle"></textarea><br/>
        </td>
      </tr>
      <tr>
        <td>
          <label for="noti-emails">Emails : </label>
        </td>
        <td>
          <textarea id="noti-emails" v-model="emails"></textarea><br/>
        </td>
      </tr>
    </table>
  </div>

  <div class="noti-topic" v-else-if="notiType === 'topic'">
  단체 전송 가즈아!
  </div>

  <button v-on:click.prevent="sendNoti">Send</button>
  <p>{{ result }}</p>
</div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'NotiSender',
  data() {
    return {
      // 채널은 나중에 디비에서 리스트를 가져올 수 있지 않을까?
      channel: '',
      title: '',
      subTitle: '',
      emails: '',
      result: '',
      notiType: 'individual',
    };
  },
  methods: {
    sendNoti() {
      // TODO: 빈 값에 대한 처리 필요
      const splitedEmails = this.emails ? this.emails.split(/[, \n]+/) : [];
      const body = {
        data: {
          channel: this.channel,
          title: this.title,
          subTitle: this.subTitle,
        },
        emails: splitedEmails,
      };

      axios.create().post('http://localhost:3000/noti', body)
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
