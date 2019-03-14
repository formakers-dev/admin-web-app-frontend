<template>
<div class="noti-sender">
  <h1 class="title">🚨 알림 보내기 🚨</h1>
  <h2 class="subtitle">
    알림을 좀 더 편하게 보내고 싶은 모두의 염원이 만들어낸 페이지 🤗
  </h2>
  <br/>

  <b-field>
    <b-radio-button v-model="notiType"
                    native-value="individual">
      <span>개별</span>
    </b-radio-button>
    <b-radio-button v-model="notiType"
                    native-value="topic">
      <span>단체(토픽)</span>
    </b-radio-button>
  </b-field>

  <br/>
  <b-field label="채널 (channel) *">
    <b-autocomplete v-model="noti.channel"
                    placeholder="ex) channel_betatest"
                    v-bind:data="channelList"></b-autocomplete>
  </b-field>

  <br/>
  <b-field label="제목 (title) *">
    <b-input v-model="noti.title"></b-input>
  </b-field>

  <br/>
  <div class="columns box">
  <b-field class="column" label="내용 (subTitle) *">
    알림에 기본적으로 보여지는 문구입니다.
    <b-input v-model="noti.subTitle" type="textarea"></b-input>
  </b-field>

  <b-field class="column" label="알림이 펼쳐져있을 때 보여질 내용 (message)">
    알림을 펼쳤을 때 보여질 문구입니다. 적지 않으면 `내용`에 적은 문구가 보여집니다.
    <b-input v-model="noti.message" type="textarea"></b-input>
  </b-field>
  </div>

  <br/>
  <div class="columns box">
    <b-field class="column" label="알림 그룹 만들건가요? (isSummary)">
      <p>
        <b-switch v-model="noti.isSummary">
          {{ booleanToSwitchString(noti.isSummary) }}
        </b-switch>
        <br/>알림이 여러개 보내져있을 때, 알림을 합칠 수 있는 옵션입니다. (그룹화)
      </p>
    </b-field>

    <b-field class="column" v-if="noti.isSummary" label="그룹화 시킬 때의 알림 내용 (summarySubText)">
      <b-input v-model="noti.summarySubText" type="textarea"></b-input>
    </b-field>
  </div>

  <br/>
  <b-field label="딥링크 (deeplink)">
    알림 클릭시 이동할 HTTP 링크나 포메스 딥링크를 설정합니다.
    <b-input v-model="noti.deeplink" placeholder="ex) http://www.naver.com 혹은 fomes://launch?action=main"></b-input>
  </b-field>

  <br/>
  <b-field v-if="notiType === 'individual'" label="대상자들의 이메일 (emails) *">
    여러개의 이메일 입력 가능하며 엔터(\n)와 쉼표(,)로 구분합니다.
    <b-input v-model="emails" type="textarea"></b-input>
  </b-field>
  <b-field v-if="notiType === 'topic'" label="토픽 (topic) *">
    <b-autocomplete v-model="topic"
                    placeholder="ex) notice-all"
                    v-bind:data="topicList" ></b-autocomplete>
  </b-field>

  <br/>
  <div class="buttons are-large">
    <button class="button is-primary is-fullwidth" v-if="notiType === 'individual'"
            v-on:click="sendNoti"><b>개별 전송</b></button>

    <button class="button is-primary is-fullwidth" v-if="notiType === 'topic'"
            v-on:click="sendNotiByTopic"
            v-bind:disabled="disabled"><b>단체(토픽) 전송</b></button>
  </div>
  <p>{{ result }}</p>
</div>
</template>

<script>
import request from '../common/http';
import BAutocomplete from 'buefy/src/components/autocomplete/Autocomplete';

export default {
  name: 'NotiSender',
  components: { BAutocomplete },
  data() {
    return {
      // 채널은 나중에 디비에서 리스트를 가져올 수 있지 않을까?
      channelList: ['channel_default', 'channel_announce', 'channel_betatest'],
      topicList: ['notice-all'],
      noti: {
        channel: '',
        title: '',
        subTitle: '',
        message: '',
        isSummary: false,
        summarySubText: '',
        deeplink: '',
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
    booleanToSwitchString(bool) {
      return bool ? 'ON' : 'OFF';
    },
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
