<template>
  <div class="test-register">
    <h1 class="title">🎮 게임 테스트 등록하기</h1>
    <h2 class="subtitle">
      게임 테스트를 좀 더 편하게 등록하고 싶은 모두의 염원이 만들어낸 페이지 🤗
    </h2>
    <br/>

    <div class="box">
      <div class="subtitle"><strong>테스트 기본 정보</strong></div>
      <br/>
      <div class="columns box">
        <b-field class="column" label="오픈 날짜 (openDate) *">
          <b-field style="padding-left: 10px; align-items: center">
            <b-datepicker v-model="betaTest.openDate"
                          style="padding-right: 10px"
                          placeholder="오픈할 날짜를 선택하세요"
                          icon="calendar-today"
                          mobile-native="true"
                          editable>
            </b-datepicker>
            <b-timepicker v-model="betaTest.openDate"
                          style="padding-right: 10px"
                          placeholder="오픈할 시각을 선택하세요"
                          icon="clock"
                          mobile-native="true"
                          editable>
            </b-timepicker>
          </b-field>
        </b-field>

        <br/>

        <b-field class="column" label="종료 날짜 (closeDate) *">
          <b-field style="padding-left: 10px; align-items: center">
            <b-datepicker v-model="betaTest.closeDate"
                          style="padding-right: 10px"
                          placeholder="종료할 날짜를 선택하세요"
                          icon="calendar-today"
                          mobile-native="true"
                          editable>
            </b-datepicker>
            <b-timepicker v-model="betaTest.closeDate"
                          style="padding-right: 10px"
                          placeholder="종료할 시각을 선택하세요"
                          icon="clock"
                          mobile-native="true"
                          editable>
            </b-timepicker>
          </b-field>
        </b-field>
      </div>
      <br/>

      <b-field label="유형 (subjectType) *">
        <b-field style="padding-bottom: 20px">
          <b-radio-button v-model="betaTest.subjectType"
                          native-value="game-test"
                          v-on:input="setSubjectType"
                          type="is-black">
            <span>게임 테스트</span>
          </b-radio-button>

          <b-radio-button v-model="betaTest.subjectType"
                          native-value="fomes-test"
                          v-on:input="setSubjectType"
                          type="is-black">
            <span>포메스 테스트</span>
          </b-radio-button>

          <b-radio-button v-model="betaTest.subjectType"
                          native-value="event"
                          v-on:input="setSubjectType"
                          type="is-black">
            <span>이벤트</span>
          </b-radio-button>
        </b-field>
      </b-field>

      <b-field label="플랜 (plan) *" v-if="betaTest.subjectType === 'game-test'">
        <b-field style="padding-bottom: 20px">
          <b-radio-button v-model="betaTest.plan"
                          native-value="trial"
                          v-on:input="setPlan"
                          type="is-black">
            <span>Trial Plan</span>
          </b-radio-button>

          <b-radio-button v-model="betaTest.plan"
                          native-value="starter"
                          v-on:input="setPlan"
                          type="is-black">
            <span>Starter Plan</span>
          </b-radio-button>

          <b-radio-button v-model="betaTest.plan"
                          native-value="lite"
                          v-on:input="setPlan"
                          type="is-black">
            <span>Lite Plan</span>
          </b-radio-button>

          <b-radio-button v-model="betaTest.plan"
                          native-value="simple"
                          v-on:input="setPlan"
                          type="is-black">
            <span>Simple Plan</span>
          </b-radio-button>

          <b-radio-button v-model="betaTest.plan"
                          native-value="standard"
                          v-on:input="setPlan"
                          type="is-black">
            <span>Standard Plan</span>
          </b-radio-button>
        </b-field>
      </b-field>

      <b-field label="제목 (title) *">
        <b-input v-model="betaTest.title"></b-input>
      </b-field>

      <br/>

      <b-field label="설명 (description)">
        <b-input type="textarea" v-model="betaTest.description"></b-input>
      </b-field>

      <br/>

      <b-field label="태그 (tags) *">
        <b-taginput
          v-model="betaTest.tags"
          ellipsis
          icon="label"
          placeholder="태그를 추가하세요">
        </b-taginput>
      </b-field>

      <br/>

      <b-field label="목적 (purpose)">
        <b-input v-model="betaTest.purpose"></b-input>
      </b-field>

      <br/>

      <b-field label="버그리포트 설문 URL (bugReport.url)">
        <b-input v-model="betaTest.bugReport.url" placeholder="https://docs.google.com/forms/d/e/1FAIpQLSfCYFte9p8faIOve6YWYQkqDXdeJLggSnucAtnIYR0TsEF8fA/viewform?usp=pp_url&entry.1223559684={email}"></b-input>
      </b-field>

      <br/>

      <div class="box">
        <div class="subtitle"><strong>의뢰 게임 정보</strong></div>

        <div class="columns" v-if="betaTest.subjectType === 'game-test'">
          <b-field class="column" label="플레이 할 게임의 패키지명 (packageName) *">
            <b-input
              v-model="packageName" ref="packageName"
              placeholder="com.formakers.fomes"></b-input>
          </b-field>
          <b-field class="column" label="↓↓↓">
            <button class="button is-black is-small" v-on:click="getApp(packageName)">
              <b>apps정보에서 앱 아이콘 가져오기</b>
            </button>
          </b-field>
        </div>

        <div class="columns">
          <b-field class="column" label="대표 이미지 URL (coverImageUrl) *">
            <p>
              메인화면에서 보여지는 커버 이미지 입니다.
              <b-input v-model="betaTest.coverImageUrl"
                       placeholder="https://i.imgur.com/NBfLCwq.png"></b-input>
              <br/>
              <img style="width: 500px" v-bind:src="betaTest.coverImageUrl" alt="대표 이미지가 보여집니다"/>
            </p>
          </b-field>

          <b-field class="column" label="앱 아이콘 (iconImageUrl) *">
            <p>
              배너 클릭시 보여질 디테일 화면 입니다.
              <b-input v-model="betaTest.iconImageUrl"
                       placeholder="https://i.imgur.com/NBfLCwq.png"></b-input>
              <br/>
              <img style="width: 150px" v-bind:src="betaTest.iconImageUrl" alt="앱 아이콘이 보여집니다"/>
            </p>
          </b-field>
        </div>
      </div>
      <br/>

      <div class="box">
        <div class="subtitle"><strong>테스트 구성</strong></div>

        <b-field style="padding-bottom: 20px">
          <b-radio-button v-model="testType"
                          native-value="default"
                          v-on:input="setTestTemplateByTestType"
                          type="is-black">
            <span>자유선택</span>
          </b-radio-button>
          <b-radio-button v-model="testType"
                          native-value="simple"
                          v-on:input="setTestTemplateByTestType"
                          type="is-black">
            <span>간단설문형</span>
          </b-radio-button>
          <b-radio-button v-model="testType"
                          native-value="normal"
                          v-on:input="setTestTemplateByTestType"
                          type="is-black">
            <span>일반설문형</span>
          </b-radio-button>
          <b-radio-button v-model="testType"
                          native-value="application+simple"
                          v-on:input="setTestTemplateByTestType"
                          type="is-black">
            <span>간단설문형 + 참가신청</span>
          </b-radio-button>
          <b-radio-button v-model="testType"
                          native-value="application+normal"
                          v-on:input="setTestTemplateByTestType"
                          type="is-black">
            <span>일반설문형 + 참가신청</span>
          </b-radio-button>
        </b-field>

        <div class="box">
          <div>
            <div class="subtitle"><strong>리워드 (reward) *</strong></div>
            <button class="button is-black is-small" v-on:click="addRewardCard"><b>추가</b></button>
          </div>
          <br/>
          <div class="columns is-multiline">
            <RewardItem class="padding-right-10 padding-bottom-10"
                        v-for="reward in betaTest.rewards.list"
                        v-bind:key="reward"
                        v-bind:reward="reward"
                        v-on:remove-reward-item="removeRewardCard"/>
          </div>
        </div>

        <br/>

        <div class="box">
          <div>
            <div class="subtitle"><strong>미션 (missions) *</strong></div>
            <button class="button is-black is-small" v-on:click="addMissionCard"><b>추가</b></button>
          </div>
          <br/>
          <div class="columns is-multiline">
            <Mission class="padding-right-10 padding-bottom-10"
                     v-for="mission in betaTest.missions"
                     v-bind:key="mission"
                     v-bind:mission="mission"
                     v-on:remove-mission="removeMissionCard"
                     v-on:update-mission-title="updateMissionTitle"/>
          </div>
        </div>
      </div>

      <br/>

      <div class="box">
        <div class="subtitle"><strong>테스트 진행 상태별 문구 (progressText) </strong></div>
        <br/>
        <b-checkbox v-model="isCustomizedProgressText" v-on:input="initializeProgressText">
          기본 상태별 문구 이외의 문구 출력을 원하는 경우만 체크해서 내용을 수정하세요.
        </b-checkbox>
        <br/>

        <div v-if="isCustomizedProgressText">
          <b-field label="참여 전 (ready) *">
            <b-input v-model="betaTest.progressText.ready"
                     placeholder="밑져야 본전! 재미있어 보인다면 참여해 보세요."></b-input>
          </b-field>
          <b-field label="참여 중 (doing) *">
            <b-input v-model="betaTest.progressText.doing"
                     placeholder="당신을 기다리고 있었어요! 이어서 참여해볼까요?"></b-input>
          </b-field>
          <b-field label="참여 완료 (done) *">
            <b-input v-model="betaTest.progressText.done"
                     placeholder="굿! 훌륭해요! 마감 후 테스터 시상식이 열릴거에요."></b-input>
          </b-field>
        </div>
      </div>

      <br/>

      <b-switch v-model="isTargetToFomesMembers">
        해당 테스트를 <strong class="has-text-primary">포메이커스 관리자들</strong>에게 보여지게 하기! (테스트 모드)
      </b-switch>

      <br/>
      <br/>
      <div class="buttons are-large">
        <button class="button is-primary is-fullwidth"
                v-on:click="registerBetaTest"><b>등록</b></button>
      </div>

      <br/>
    </div>

    <br/>
    <b-field v-if="result" label="Log">
      <b-message class="white-space-pre">{{ JSON.stringify(result, null, ' ') }}</b-message>
    </b-field>
  </div>
</template>

<script>
import request from '../common/utils/http';
import RewardItem from '../components/RewardItem.vue';
import Mission from '../components/Mission.vue';

export default {
  name: 'TestRegister',
  components: {
    RewardItem,
    Mission,
  },
  data() {
    return {
      result: '',
      isLoading: true,
      isTargetToFomesMembers: true,
      isCustomizedProgressText: false,
      packageName: '',
      testType: 'simple',
      betaTest: {
        title: '[게임명] 게임 테스트',
        description: '',
        subjectType: 'game-test',
        tags: [],
        purpose: '',
        coverImageUrl: '',
        iconImageUrl: '',
        openDate: new Date(),
        closeDate: new Date(),
        rewards: {
          // minimumDelay: Number,
          list: [],
        },
        missions: [],
        status: 'test',
        bugReport: {
          url: '',
        },
      },
    };
  },
  created() {
    this.setTestTemplateByTestType();
  },
  methods: {
    prepareDataToRegister() {
      if (this.isTargetToFomesMembers) {
        this.betaTest.status = 'test';
      } else {
        delete this.betaTest.status;
      }
    },
    registerBetaTest() {
      this.prepareDataToRegister();

      const body = this.betaTest;

      request.post('/api/beta-test', body)
        .then((result) => {
          this.result = result;

          if (result.status === 200) {
            this.showSuccessToast('등록 성공!');
          } else {
            this.showErrorToast('실패! 로그를 확인하시오!');
          }
        })
        .catch((err) => {
          this.result = err;
          this.showErrorToast();
        });
    },
    setSubjectType(selected) {
      console.log('setSubjectType : ', selected);

      this.betaTest.subjectType = selected;

      if (selected !== 'game-test') {
        delete this.betaTest.plan;
      }

      console.log(this.betaTest);
    },
    setPlan(selected) {
      console.log('setPlan : ', selected);

      this.betaTest.plan = selected;

      console.log(this.betaTest);
    },
    addRewardCard() {
      console.log('addRewardCard');
      const rewardListLength = this.betaTest.rewards.list.length;
      this.betaTest.rewards.list.push({
        order: rewardListLength > 0
          ? Number(this.betaTest.rewards.list[rewardListLength - 1].order) + 1 : 1,
        iconImageUrl: '',
        title: '',
        content: '',
      });
    },
    removeRewardCard(order) {
      console.log('removeRewardCard order', order);
      const item = this.betaTest.rewards.list.find(i => i.order === order);
      const itemIndex = this.betaTest.rewards.list.indexOf(item);
      this.betaTest.rewards.list.splice(itemIndex, 1);
    },
    addMissionCard() {
      console.log('addMissionCard');
      const missionLength = this.betaTest.missions.length;
      this.betaTest.missions.push({
        order: missionLength > 0
          ? Number(this.betaTest.missions[missionLength - 1].order) + 1 : 1,
        type: '',
        title: '',
        description: '',
        descriptionImageUrl: '',
        guide: '',
        actionType: '',
        action: '',
        options: '',
      });
    },
    removeMissionCard(order) {
      console.log('removeMissionCard order', order);
      const item = this.betaTest.missions.find(i => i.order === order);
      const itemIndex = this.betaTest.missions.indexOf(item);
      this.betaTest.missions.splice(itemIndex, 1);
    },
    updateMissionTitle(value) {
      const item = this.betaTest.missions.find(i => i.order === value.order);
      item.title = value.title;
    },
    getApp(packageName) {
      if (!packageName) {
        alert('앱의 패키지명을 입력하세요.');
        this.$refs.packageName.focus();
        return;
      }

      request.get(`/api/apps/${packageName}`)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            this.betaTest.iconImageUrl = res.data.iconUrl;
          } else {
            this.showErrorToast('실패! 로그를 확인하시오!');
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
    showErrorToast(toastMessage) {
      this.$toast.open({
        duration: 4000,
        message: toastMessage,
        type: 'is-danger',
      });
    },
    initializeProgressText(checked) {
      if (checked) {
        this.betaTest.progressText = {
          ready: '밑져야 본전! 재미있어 보인다면 참여해 보세요.',
          doing: '당신을 기다리고 있었어요! 이어서 참여해볼까요?',
          done: '굿! 훌륭해요! 마감 후 테스터 시상식이 열릴거에요.',
        };
      } else {
        delete this.betaTest.progressText;
      }
    },
    setTestTemplateByTestType() {
      console.log('setTestTemplateByTestType: ', this.testType);

      // Set rewards
      const rewardList = [];
      switch (this.testType) {
        case 'simple':
        case 'application+simple':
          rewardList.push({
            order: rewardList.length + 1,
            iconImageUrl: 'https://i.imgur.com/ybuI732.png',
            title: '테스트 수석',
            content: '문화상품권 5천원 (1명 선정)',
          });
          rewardList.push({
            order: rewardList.length + 1,
            iconImageUrl: 'https://i.imgur.com/btZZHRp.png',
            title: '테스트 성실상',
            content: '문화상품권 1천원 (20명 선정)',
          });
          break;

        case 'normal':
        case 'application+normal':
          rewardList.push({
            order: rewardList.length + 1,
            iconImageUrl: 'https://i.imgur.com/ybuI732.png',
            title: '테스트 수석',
            content: '문화상품권 3만원 (1명 선정)',
          });
          rewardList.push({
            order: rewardList.length + 1,
            iconImageUrl: 'https://i.imgur.com/6RaZ7vI.png',
            title: '테스트 차석',
            content: '문화상품권 5천원 (5명 선정)',
          });
          rewardList.push({
            order: rewardList.length + 1,
            iconImageUrl: 'https://i.imgur.com/btZZHRp.png',
            title: '테스트 성실상',
            content: '문화상품권 1천원 (참여자 전원)',
          });
          break;

        default: // Do nothing
      }
      this.betaTest.rewards.list = rewardList;

      // Set missions
      const missions = [];
      switch (this.testType) {
        case 'application+simple':
        case 'application+normal':
          missions.push({
            order: missions.length + 1,
            type: 'survey',
            title: '참여 신청',
            description: '[게임명] 클로즈드 베타 테스터 참여 신청',
            descriptionImageUrl: 'https://i.imgur.com/F3EJAOs.png',
            guide: '• 참여 신청 후 설치권한 부여까지 약 1일이 소요됩니다.',
            actionType: '',
            action: '',
            options: ['mandatory'],
          });

        // eslint-disable-next-line no-fallthrough
        case 'simple':
        case 'normal':
          missions.push({
            order: missions.length + 1,
            type: 'play',
            title: '게임 플레이',
            description: '[게임명] 게임을 플레이해주세요.(30분 이상 권장)',
            descriptionImageUrl: 'https://i.imgur.com/FDDy1WG.png',
            guide: '• 미션에 참여하면 테스트 대상 게임 보호를 위해 무단 배포 금지에 동의한 것으로 간주됩니다.',
            packageName: '',
            actionType: '',
            action: '',
            options: '',
          });
          missions.push({
            order: missions.length + 1,
            type: 'survey',
            title: '플레이 후 소감 작성',
            description: '[게임명]에 대한 구체적인 의견을 작성해주세요.',
            descriptionImageUrl: 'https://i.imgur.com/XfqTB0K.png',
            guide: '• "참여 완료" 상태에도 소감을 수정할 수 있습니다.\n• 솔직하고 구체적으로 의견을 적어주시는게 제일 중요합니다.',
            actionType: '',
            action: '',
            options: [
              'mandatory',
              'repeatable',
            ],
          });
          break;

        default: // Do nothing
      }
      this.betaTest.missions = missions;
    },
  },
};
</script>

<style scoped>
  .test-register {
    text-align: start;
    padding: 30px;
  }

  .white-space-pre {
    white-space: pre-wrap;
  }

  .padding-0 {
    padding: 0;
  }
  .padding-left-10 {
    padding-left: 10px;
  }
  .padding-right-10 {
    padding-right: 10px;
  }
  .padding-bottom-10 {
    padding-bottom: 10px;
  }
</style>
