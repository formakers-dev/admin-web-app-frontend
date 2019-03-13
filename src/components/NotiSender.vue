<template>
<div class="noti-sender">
  <h1>NotiSender</h1>
  <h2>개별 전송</h2>
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

</style>
