<template>
<div class="noti-sender">
  <h1 class="title">🚨 알림 보내기 🚨</h1>
  <h2 class="subtitle">
    알림을 좀 더 편하게 보내고 싶은 모두의 염원이 만들어낸 페이지 🤗
  </h2>
  <br/>

  <b-field style="padding-bottom: 20px">
    <b-radio-button v-model="notiType"
                    native-value="individual">
      <span>개별</span>
    </b-radio-button>
    <b-radio-button v-model="notiType"
                    native-value="topic">
      <span>단체(토픽)</span>
    </b-radio-button>
  </b-field>

  <b-field style="align-items: center" class="box">
    <b-switch v-model="isReserved"
              v-on:input="$event === false ? when = null : when">
      예약 <b>{{ booleanToSwitchString(isReserved) }}</b>
    </b-switch>
    <b-field v-if="isReserved" style="padding-left: 10px; align-items: center">
      <b-datepicker v-model="when"
                    style="padding-right: 10px"
                    placeholder="예약할 날자를 선택하세요"
                    icon="calendar-today"
                    mobile-native="true"
                    editable>
      </b-datepicker>
      <b-timepicker v-model="when"
                    style="padding-right: 10px"
                    placeholder="예약할 시간을 선택하세요"
                    icon="clock"
                    mobile-native="true"
                    editable>
      </b-timepicker>
      에 전송됩니다.
    </b-field>
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
    접힌 알림을 펼쳤을 때 보여질 문구입니다. 입력하지 않으면 `내용(subTitle)`에 적은 문구가 보여집니다.
    <b-input v-bind:value="noti.message || ''"
             v-on:input="noti.message = ($event === '' ? null : $event)"
             placeholder="30자 이상 적어주세요!"
             minlength="30"
             type="textarea"></b-input>
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
      <b-input v-bind:value="noti.summarySubText || ''"
               v-on:input="noti.summarySubText = ($event === '' ? null : $event)"
               type="textarea"></b-input>
    </b-field>
  </div>

  <br/>
  <b-field label="딥링크 (deeplink)">
    알림 클릭시 이동할 HTTP 링크나 포메스 딥링크를 설정합니다.
    <b-input v-bind:value="noti.deeplink || ''"
             v-on:input="noti.deeplink = ($event === '' ? null : $event)"
             placeholder="ex) http://www.naver.com 혹은 fomes://launch?action=main"></b-input>
  </b-field>

  <br/>

  <div class="box">

    <div v-if="notiType === 'individual'">
      <b-field style="padding-bottom: 20px">
        <b-radio-button v-model="receiversType"
                        native-value="email"
                        type="is-black">
          <span>Email</span>
        </b-radio-button>
        <b-radio-button v-model="receiversType"
                        native-value="userId"
                        type="is-black">
          <span>UserId</span>
        </b-radio-button>
      </b-field>

      <b-field v-if="receiversType === 'email'" label="대상자들의 이메일 (emails) *"></b-field>
      <b-field v-else label="대상자들의 유저 아이디 (userIds) *"></b-field>
      여러개의 <span v-if="receiversType === 'email'">이메일을</span>
      <span v-else>유저 아이디를</span> 입력 가능하며 엔터(\n)와 쉼표(,)로 구분합니다.

      <b-input v-model="receivers" type="textarea"></b-input>

    </div>
    <b-field v-if="notiType === 'topic'" label="토픽 (topic) *">
      <b-autocomplete v-model="topic"
                      placeholder="ex) notice-all"
                      v-bind:data="topicList"></b-autocomplete>
    </b-field>
  </div>

  <br/>
  <div class="buttons are-large">
    <button class="button is-primary is-fullwidth" v-if="notiType === 'individual'"
            v-on:click="sendNoti"><b>개별 전송</b></button>

    <button class="button is-primary is-fullwidth" v-if="notiType === 'topic'"
            v-on:click="sendNotiByTopic"
            v-bind:disabled="disabled"><b>단체(토픽) 전송</b></button>
  </div>

  <br/>
  <b-field v-if="result" label="Log">
    <b-message class="white-space-pre">{{ JSON.stringify(result, null, '    ') }}</b-message>
  </b-field>
</div>
</template>

<script>
import request from '../common/http';

export default {
  name: 'NotiSender',
  data() {
    return {
      // 채널은 나중에 디비에서 리스트를 가져올 수 있지 않을까?
      channelList: ['channel_default', 'channel_announce', 'channel_betatest'],
      topicList: ['notice-all'],
      isReserved: false,
      noti: {
        channel: '',
        title: '',
        subTitle: '',
        message: null,
        isSummary: false,
        summarySubText: null,
        deeplink: null,
      },
      when: null,
      receiversType: 'email',
      receivers: 'yenarue@gmail.com, copyx00@gmail.com',
      topic: 'notice-all',
      result: null,
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
      const receiverList = this.receivers ? this.receivers.split(/[,\s\n]+/) : [];
      const body = {
        data: this.noti,
        receivers: {
          type: this.receiversType,
          value: receiverList,
        },
        when: this.when,
      };

      request.post('/noti', body)
        .then((result) => {
          this.result = result;

          let toastMessage;
          if (this.isReserved) {
            toastMessage = `예약 성공! (${this.when})`;
          } else {
            toastMessage = `${receiverList.length}개 알림 전송 성공!
             (성공 : ${this.result.data.result.success},
             실패 : ${this.result.data.result.failure})`;
          }

          if (result.status === 200) {
            this.showSuccessToast(toastMessage);
          } else {
            this.showErrorToast();
          }
        })
        .catch((err) => {
          this.result = err;
          this.showErrorToast();
        });
    },
    sendNotiByTopic() {
      const body = {
        data: this.noti,
        when: this.when,
      };

      body.data.isSummary = body.data.isSummary.toString();

      request.post(`/noti/topics/${this.topic}`, body)
        .then((result) => {
          this.result = result;

          if (result.status === 200) {
            this.showSuccessToast(`예약 성공! (${this.when})`);
          } else {
            this.showErrorToast();
          }
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
.noti-sender {
  text-align: start;
  padding: 30px;
}
.white-space-pre {
  white-space: pre-wrap;
}
</style>
