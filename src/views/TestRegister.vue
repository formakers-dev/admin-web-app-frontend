<template>
  <div class="test-register">
    <h1 class="title">🎮 게임 테스트 등록하기 (개발중) </h1>
    <h2 class="subtitle">
      게임 테스트를 좀 더 편하게 등록하고 싶은 모두의 염원이 만들어낸 페이지 🤗
    </h2>
    <br/>

    <div class="box">

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

      <b-field label="제목 (title) *">
        <b-input v-model="betaTest.title"></b-input>
      </b-field>

      <br/>

      <b-field label="설명 (description)">
        <b-input v-model="betaTest.description"></b-input>
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
      <div class="columns box">
        <b-field class="column" label="대표 이미지 URL (overviewImageUrl) *">
          <p>
            메인화면에서 보여지는 커버 이미지 입니다.
            <b-input v-model="betaTest.overviewImageUrl"
                     placeholder="https://i.imgur.com/NBfLCwq.png"></b-input>
            <br/>
            <img style="width: 500px" v-bind:src="betaTest.overviewImageUrl" alt="대표 이미지가 보여집니다"/>
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

      <br/>

      <div class="box">
        <div>
          <b-field label="리워드 (reward) *"/>
          <button class="button is-black is-small" v-on:click="addRewardCard"><b>추가</b></button>
        </div>
        <div class="columns is-multiline">
          <RewardItem v-for="reward in betaTest.rewards.list"
                      v-bind:key="reward.order"
                      v-bind:reward="reward"
                      v-on:remove-reward-item="removeRewardCard"/>
        </div>
      </div>

      <br/>

      <div class="box">
        <div>
          <b-field label="미션 (missions) *"/>
          <button class="button is-black is-small" v-on:click="addMissionCard"><b>추가</b></button>
        </div>
        <div class="columns is-multiline">
          <Mission v-for="mission in betaTest.missions"
                   v-bind:key="mission.order"
                   v-bind:mission="mission"
                   v-on:remove-mission="removeMissionCard"/>
        </div>
      </div>

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
import request from '../common/http';
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
      isLoading: true,
      betaTest: {
        title: '',
        description: '',
        overviewImageUrl: '',
        iconImageUrl: '',
        openDate: new Date(),
        closeDate: new Date(),
        rewards: {
          minimumDelay: Number,
          list: [],
        },
        missions: [],
      },
    };
  },
  methods: {
    registerBetaTest() {
      // const body = this.betaTest;
      //
      // request.post('/beta-test', body)
      //   .then((result) => {
      //     this.result = result;
      //
      //     const toastMessage = '등록 성공!';
      //
      //     if (result.status === 200) {
      //       this.showSuccessToast(toastMessage);
      //     } else {
      //       this.showErrorToast();
      //     }
      //   })
      //   .catch((err) => {
      //     this.result = err;
      //     this.showErrorToast();
      //   });
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
        iconImageUrl: '',
        title: '',
        description: '',
        descriptionImageUrl: '',
        item: {
          order: 1,
          title: '',
          actionType: '',
          action: '',
          option: '',
        },
      });
    },
    removeMissionCard(order) {
      console.log('removeMissionCard order', order);
      const item = this.betaTest.missions.find(i => i.order === order);
      const itemIndex = this.betaTest.missions.indexOf(item);
      this.betaTest.missions.splice(itemIndex, 1);
    },
    successToast(toastMessage) {
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
  .test-register {
    text-align: start;
    padding: 30px;
  }

  .white-space-pre {
    white-space: pre-wrap;
  }
</style>
