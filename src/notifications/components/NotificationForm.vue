<template>
    <div class="modal-card noti-info-container">
      <header class="modal-card-head">
        <p class="modal-card-title">알림 정보 {{type === 'modify'? "수정하기" : "등록하기"}}</p>
        <p><font color="red">필수 값 *</font></p>
      </header>
      <section class="modal-card-body">
        <div class="columns" style="width: 100%; min-height: 600px">
          <div class="column">
            <b-field  v-if="type==='modify'" label="전송 상태">
              <div v-if="data.failResult.count > 0">
                <strong class="tag is-danger">실패</strong>
                <br>
                <b-message type="is-danger">
                  <ul>
                    <li>실패 횟수 : {{data.failResult.count}}</li>
                    <li>실패 원인 : {{data.failResult.reason}}</li>
                    <li>실패 시간 : {{data.failResult.at}}</li>
                  </ul>
                </b-message>
              </div>
              <strong v-else class="tag is-black">대기중</strong>
            </b-field>
            <b-field >
              <template slot="label">
                <span class="has-text-danger">*</span> 채널
              </template>
              <b-field>
                <b-radio-button v-for="channel in channelList"
                                :key="channel.key"
                                v-model="data.noti.channel"
                                :native-value="channel.value">
                  <span>{{channel.key}}</span>
                </b-radio-button>
              </b-field>
            </b-field>
            <b-field >
              <template slot="label">
                <span class="has-text-danger">*</span> 제목
              </template>
              <b-input v-model="data.noti.title"
                       validation-message="필수 입력 값입니다."
                       required
              ></b-input>
            </b-field>
            <b-field>
              <template slot="label">
                <span class="has-text-danger">*</span> 내용
                <b-tooltip type="is-dark"
                           label="알림에 기본적으로 보여지는 문구입니다."
                           position="is-right"
                           >
                  <b-button class="is-white"
                            style="margin-left: -15px; background: transparent;"
                            rounded>
                    <b-icon size="is-small" icon="help-circle-outline" ></b-icon>
                  </b-button>
                </b-tooltip>
              </template>
              <b-input v-model="data.noti.subTitle"
                       placeholder="알림에 기본적으로 보여지는 문구입니다."
                       type="textarea"
                       required
                       validation-message="필수 입력 값입니다."></b-input>
            </b-field>

            <b-field :type="{'is-danger' : error.message}" :message="{'30자 이상 입력해주세요.' : error.message}">
              <template slot="label">
                <b-checkbox v-model="isExistedMessage" size="is-small"></b-checkbox>
                접힌 알림을 펼쳤을 때 보여지는 내용
                <b-tooltip type="is-dark"
                           label="접힌 알림을 펼쳤을 때 보여질 문구입니다. 입력하지 않으면 `내용`에 적은 문구가 보여집니다. 30자 이상 적어주세요!"
                           position="is-right"
                           multilined>
                  <b-button class="is-white"
                            style="margin-left: -15px; background: transparent;"
                            rounded>
                    <b-icon size="is-small" icon="help-circle-outline" ></b-icon>
                  </b-button>
                </b-tooltip>
              </template>
              <b-input v-if="isExistedMessage"
                       :value="data.noti.message || ''"
                       @input="data.noti.message = ($event === '' ? null : $event)"
                       minlength="30"
                       maxlength="10000"
                       placeholder="접힌 알림을 펼쳤을 때 보여질 문구입니다. 입력하지 않으면 `내용`에 적은 문구가 보여집니다. 30자 이상 적어주세요!"
                       type="textarea"></b-input>
            </b-field>
            <b-field >
              <template slot="label">
                딥링크
                <b-tooltip type="is-dark"
                           label="알림 클릭시에 수행될 액션입니다. 미입력시에는 포메스 메인화면으로 이동합니다. Deeplink 포맷에 대한 자세한 내용은 클릭하여 도움말을 살펴보세요."
                           position="is-right"
                           multilined>
                  <b-button class="is-white"
                            style="margin-left: -15px; background: transparent;"
                            rounded
                            tag="a"
                            href="https://www.notion.so/formakers/0x03_-_Deeplink_-619417f97b224fc4be4230cdcba4bea6"
                            target="_blank">
                    <b-icon size="is-small" icon="help-circle-outline" ></b-icon>
                  </b-button>
                </b-tooltip>
              </template>
              <b-input v-bind:value="data.noti.deeplink || ''"
                       v-on:input="data.noti.deeplink = ($event === '' ? null : $event)"
                       placeholder="ex) http://www.naver.com 혹은 fomes://launch?action=main"></b-input>
            </b-field>
          </div>
          <div class="is-vertical-divider"></div>
          <div class="column">
            <div class="box">
              <b-field>
                <template slot="label">
                  <span class="has-text-danger">*</span> 전송 대상
                </template>
                <b-field>
                  <b-radio-button v-for="notiType in notiTypeList"
                                  :key="notiType.key"
                                  v-model="data.notiType"
                                  :native-value="notiType.value" required>
                    <span>{{notiType.key}}</span>
                  </b-radio-button>
                </b-field>
              </b-field>
              <b-field  v-if="data.notiType === 'individual'">
                <template slot="label">
                  <span class="has-text-danger">*</span> 전송 대상자 타입
                </template>
                <b-field>
                  <b-radio-button v-for="receiversType in receiversTypes"
                                  :key="receiversType.key"
                                  v-model="data.receiversType"
                                  :native-value="receiversType.value" required>
                    <span>{{receiversType.key}}</span>
                  </b-radio-button>
                </b-field>
              </b-field>

              <b-field v-if="data.notiType === 'individual'" label="전송 옵션">
                <div>
                  <b-checkbox v-model="data.isExcluded">
                    아래 사용자들을 제외한 모두에게 보내기
                  </b-checkbox>
                </div>
              </b-field>

              <b-field v-if="data.notiType === 'test'">
                <template slot="label">
                  <span class="has-text-danger">*</span> 테스터
                </template>
                <div style="padding-top: 0.375em;">
                  <b-tooltip style="margin-right:10px"
                             v-for="tester in test.members"
                             type="is-dark"
                             :label="tester.email"
                             :key="tester.name"
                             position="is-bottom">
                    <b-checkbox v-model="test.receivers"
                                :native-value="tester.email">
                      {{tester.name}}
                    </b-checkbox>
                  </b-tooltip>
                </div>
              </b-field>

              <b-field v-if="data.notiType === 'individual'">
                <template slot="label">
                  <span class="has-text-danger">*</span> 대상자들의 {{data.receiversType === 'email' ? "이메일" : "유저 아이디"}}
                  <b-tooltip type="is-dark"
                             label="엔터(\n)와 쉼표(,)로 구분합니다."
                             position="is-right"
                             multilined>
                    <b-button class="is-white"
                              style="margin-left: -15px; background: transparent;"
                              rounded>
                      <b-icon size="is-small" icon="help-circle-outline" ></b-icon>
                    </b-button>
                  </b-tooltip>
                </template>
                <b-input v-model="data.receivers"
                         type="textarea"
                         required
                         placeholder="엔터(\n)와 쉼표(,)로 구분합니다."
                         validation-message="필수 입력 값입니다."></b-input>
              </b-field>

              <b-field v-if="data.notiType === 'topic'">
                <template slot="label">
                  <span class="has-text-danger">*</span> 토픽
                </template>
                <b-radio style="padding-top: 0.375em;"
                         v-for="topic in topicList"
                         :key="topic.key"
                         v-model="data.topic"
                         :native-value="topic.value" required>
                  <span>{{topic.key}}</span>
                </b-radio>
              </b-field>
            </div>
            <b-field>
              <template slot="label">
                발송 예약 시각
                <b-tooltip type="is-dark"
                           label="미입력 시에는 알림이 바로 전송됩니다."
                           position="is-right">
                  <b-button class="is-white"
                            style="margin-left: -15px; background: transparent;"
                            rounded>
                    <b-icon size="is-small" icon="help-circle-outline"></b-icon>
                  </b-button>
                </b-tooltip>
              </template>
              <b-field>
                <b-datetimepicker v-model="data.when"
                                  placeholder="예약 시각을 선택해주세요."
                                  icon="calendar-today">
                </b-datetimepicker>
                <b-button type="is-primary"
                          @click="data.when = null"
                          style="border-radius: 0;">예약 취소</b-button>
              </b-field>
            </b-field>
            <b-field>
              <div class="buttons">
                <button class="button is-primary"
                        @click="setTime(11,30)">
                  <span>11:30</span>
                </button>
                <button class="button is-primary"
                        @click="setTime(18,0)">
                  <span>18:00</span>
                </button>
                <button class="button is-primary"
                        @click="setTime(18,30)">
                  <span>18:30</span>
                </button>
                <button class="button is-primary"
                        @click="setTime(19,0)">
                  <span>19:00</span>
                </button>
                <button class="button is-primary"
                        @click="setTime(19,30)">
                  <span>19:30</span>
                </button>
                <button class="button is-primary"
                        @click="setTime(20,0)">
                  <span>20:00</span>
                </button>
                <button class="button is-primary"
                        @click="setTime(20,30)">
                  <span>20:30</span>
                </button>
              </div>
            </b-field>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button" type="button" @click="$emit('close')">닫기</button>
        <div v-if="data.when">
          <button class="button is-primary"
                  v-if="data.notiType === 'individual'"
                  @click="send"><b>개별 전송 예약</b></button>

          <button class="button is-primary" v-if="data.notiType === 'topic'"
                  @click="send"><b>단체 전송 예약</b></button>

          <button class="button is-primary"
                  v-if="data.notiType === 'test'"
                  @click="send"><b>테스트 전송 예약</b></button>
        </div>
        <div v-else>
          <button class="button is-primary"
                  v-if="data.notiType === 'individual'"
                  @click="send"><b>개별 전송</b></button>

          <button class="button is-primary"
                  v-if="data.notiType === 'topic'"
                  @click="send"><b>단체 전송</b></button>

          <button class="button is-primary"
                  v-if="data.notiType === 'test'"
                  @click="send"><b>테스트 전송</b></button>
        </div>
      </footer>
    </div>
</template>

<script>
import request from '../../common/utils/http';

export default {
  name: 'NotificationForm',
  components: {
  },
  props: {
    value: {
      type: Object,
      default() {
        return null;
      },
    },
    type: {
      type: String,
      default() {
        return 'add';
      },
    },
  },
  data() {
    return {
      channelList: [
        { key: '테스트 관련', value: 'channel_betatest' },
        { key: '공지사항', value: 'channel_announce' },
        { key: '기본', value: 'channel_default' }],
      notiTypeList: [
        { key: '개별', value: 'individual' },
        { key: '단체', value: 'topic' },
        { key: '테스트(개별)', value: 'test' }],
      topicList: [
        { key: 'notice-all', value: 'notice-all' }],
      receiversTypes: [
        { key: 'Email', value: 'email' },
        { key: 'User ID', value: 'userId' }],
      test: {
        mode: false,
        members: [
          { name: 'Eve', email: 'bolimlee22@gmail.com' },
          { name: 'Yenarue', email: 'yenarue@gmail.com' },
          { name: 'Jason', email: 'sryu99@gmail.com' },
          { name: 'Jake', email: 'copyx00@gmail.com' },
          { name: 'Irene', email: 'irene.shin@formakers.net' },
          { name: 'Mormo', email: 'kime879643@gmail.com' },
          { name: 'Ssong', email: 'higgsong@gmail.com' },
          { name: 'Formakers.Dev', email: 'formakers.dev@gmail.com' }],
        receivers: [],
      },
      error: {
        message: false,
      },
      disabled: false,
      isExistedMessage: false,
      data: {
        id: '',
        isReserved: false,
        noti: {
          channel: 'channel_betatest',
          title: '',
          subTitle: '',
          message: '',
          deeplink: '',
        },
        when: null,
        receiversType: 'email',
        receivers: '',
        topic: 'notice-all',
        result: null,
        notiType: 'individual',
        isExcluded: false,
        failResult: {
          count: 0,
          reason: '',
          at: '',
        },
      },
    };
  },
  mounted() {
    // modal type
    if (this.type === 'modify') {
      this.data = Object.assign({}, this.value);
    } else {
      this.data.notiType = 'test';
    }
    if (this.data.noti.message && this.data.noti.message.length > 0) {
      this.isExistedMessage = true;
    }
  },
  watch: {
    'data.notiType': {
      handler(after) {
        this.test.mode = (after === 'test');
      },
      deep: true,
    },
    isExistedMessage: {
      handler(after) {
        if (!after) {
          this.data.noti.message = '';
        }
      },
    },
    'data.noti.message': {
      handler(after) {
        this.error.message = (after.length < 30 && after.length > 0);
      },
      deep: true,
    },
  },
  methods: {
    setTime(hour, min) {
      let datetime;
      if (this.data.when) {
        datetime = new Date(this.data.when);
      } else {
        datetime = new Date();
      }
      datetime.setHours(hour);
      datetime.setMinutes(min);
      this.data.when = datetime;
    },
    validate() {
      console.log(this.data.noti.message.length);
      if (this.data.noti.title === '' || this.data.noti.subTitle === '') {
        return false;
      }
      const messageLength = this.data.noti.message.length;
      if (this.isExistedMessage && (messageLength > 0 && messageLength < 30)) {
        return false;
      }
      if (this.data.notiType === 'individual' && this.data.receivers.length === 0) {
        return false;
      }
      if (this.test.mode && this.test.receivers.length === 0) {
        return false;
      }
      return true;
    },
    send() {
      if (!this.validate()) {
        this.$buefy.toast.open({
          message: '입력 값들을 다시 한 번 확인해 주세요.',
          type: 'is-danger',
        });
        return;
      }
      if (this.data.notiType === 'individual' || this.test.mode) {
        this.sendNoti();
      } else {
        this.sendNotiByTopic();
      }
    },
    sendNoti() {
      let receiverList = [];
      if (this.test.mode) {
        receiverList = this.test.receivers;
      } else {
        receiverList = this.data.receivers ? this.data.receivers.split(/[,\s\n]+/) : [];
      }
      const body = {
        _id: this.data._id ? this.data._id : null,
        data: this.data.noti,
        receivers: {
          type: this.data.receiversType,
          value: receiverList,
          isExcluded: this.data.isExcluded,
        },
        when: this.data.when,
        notiType: 'individual',
      };

      console.log(body);
      request({
        url: '/api/noti',
        method: this.type === 'modify' ? 'put' : 'post',
        data: body,
      }).then((res) => {
        this.result = res;

        if (this.data.when) {
          this.$root.showSuccessToast('정상적으로 전송/예약을 하였습니다.');
        } else {
          const failCount = this.result.data.result.failure ? this.result.data.result.failure : 0;
          const message = `총 ${receiverList.length}의 알람을 전송하였습니다.(성공 : ${this.result.data.result.success} / 실패 : ${failCount})`;
          this.$buefy.toast.open({
            message,
            type: 'is-primary',
            duration: 3000,
          });
        }
      }).catch((err) => {
        this.$root.showErrorToast('예약에 실패하였습니다.', error);
      });
    },
    sendNotiByTopic() {
      const body = {
        _id: this.data._id ? this.data._id : null,
        data: this.data.noti,
        when: this.data.when,
        notiType: this.data.notiType,
      };

      const url = '/api/noti/topics/'+ this.data.topic;
      request({
        url,
        method: this.type === 'modify' ? 'put' : 'post',
        data: body,
      }).then((res) => {
        this.$root.showSuccessToast('정상적으로 전송/예약을 하였습니다.');
      }).catch((err) => {
        this.$root.showErrorToast('예약에 실패하였습니다.', error);
      });
    },
  },
};
</script>

<style scoped>
  .noti-info-container {
     width: auto;
   }
  .white-space-pre {
    white-space: pre-wrap;
  }
  .noti-info-container .field{
    margin-bottom:1rem;
  }
  .modal-card-body{
    display: flex;
    align-content: center;
    justify-content: center;
  }
</style>
