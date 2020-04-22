<template>
  <div class="mission">
    <div class="box is-vertical">
      <b-field class="columns padding-bottom-10">

        <b-field class="column padding-0" label="순서 (order) *">
          <b-input type="number" v-model="mission.order" v-on:input="onInputOrder"></b-input>
        </b-field>

        <b-field class="column padding-0 padding-left-10" label="타입 (type) *">
          <b-select v-model="type"
                    v-on:input="setMissionType">
            <option
              v-for="type in missionTypes"
              :value="type"
              :key="type">
              {{ type }}
            </option>
          </b-select>
        </b-field>
      </b-field>

      <b-field class="padding-bottom-10" label="제목 (title) *">
        <div>
          <b-switch v-model="isDependencyWithOrder">
            순서와 연동 (order + "번째 미션")
          </b-switch>
          <b-input v-model="mission.title" placeholder="1단계 미션"></b-input>
        </div>
      </b-field>

      <b-field class="padding-bottom-10" label="내용 (description) *">
        <b-input type="textarea" v-model="mission.description"
                 placeholder="[2048] 에 대한 구체적인 의견을 작성해주세요."></b-input>
      </b-field>

      <b-field class="padding-bottom-10" label="내용 이미지 (descriptionImageUrl)">
        <b-input v-model="mission.descriptionImageUrl"
                 placeholder="https://i.imgur.com/NBfLCwq.png"></b-input>
      </b-field>
      <img v-if="mission.descriptionImageUrl.length > 0"
           style="width: 500px" v-bind:src="mission.descriptionImageUrl"/>

      <b-field class="padding-bottom-10" label="가이드 문구 (guide) *">
        <b-input type="textarea" v-model="mission.guide"></b-input>
      </b-field>

      <b-field v-if="type === 'play'" class="padding-bottom-10"
               label="플레이 할 게임의 패키지명 (packageName) *">
        <b-input
          v-model="mission.packageName"
          placeholder="com.formakers.fomes"
          v-on:input="setPlayTypeAction"></b-input>
      </b-field>

      <b-field class="padding-bottom-10" label="액션 타입 (actionType)">
        <b-select v-model="actionType"
                  v-on:input="setMissionActionType">
          <option
            v-for="type in missionActionTypes"
            :value="type"
            :key="type">
            {{ type }}
          </option>
        </b-select>
      </b-field>

      <b-field class="padding-bottom-10" label="액션 (action) *">
        <div>
          <b-switch v-if="type === 'play'"
                    v-model="isGooglePlayUrl"
                    v-on:input="setPlayTypeAction()">
            구글플레이 기본 마켓 URL 사용하기
          </b-switch>
          <b-input
            v-model="mission.action"
            placeholder="https://docs.google.com/forms/d/e/1FAIpQLSdxI2s694nLTVk4i7RMkkrtr-K_0s7pSKfUnRusr7348nQpJg/viewform?usp=pp_url&internal_web=true&entry.1042588232={email}"
            v-on:input="setDeeplink"></b-input>
        </div>
      </b-field>

      <b-field label="옵션 (options)">
        <b-taginput
          v-model="mission.options"
          :data="missionOptions"
          autocomplete
          icon="label"
          placeholder="미션 아이템의 옵션을 추가해주세요">
        </b-taginput>
      </b-field>

      <br/>

      <b-button class="button is-fullwidth"
                type="is-danger"
                @click="$emit('remove-mission', mission.order)"
                outlined><b>삭제</b></b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Mission',
  props: ['mission'],
  data() {
    return {
      isGooglePlayUrl: true,
      isDependencyWithOrder: false,
      actionType: this.mission.actionType.length > 0 ? this.mission.actionType : 'default',
      type: this.mission.type.length > 0 ? this.mission.type : 'survey',
      missionOptions: ['mandatory', 'repeatable', 'recheckable'],
      missionTypes: ['survey', 'play'],
      missionActionTypes: ['default', 'internal_web'],
    };
  },
  created() {
    this.setMissionType(this.mission.type || 'survey');
    this.onInputOrder(this.mission.order);
  },
  methods: {
    setMissionType(selected) {
      console.log('setMissionType : ', selected);

      this.mission.type = selected;

      if (selected === 'play') {
        this.mission.actionType = 'default';
        this.setPlayTypeAction();
      }

      console.log(this.mission);
    },
    setMissionActionType(selected) {
      console.log('setMissionActionType : ', selected);
      if (selected === 'default') {
        delete this.mission.actionType;
      } else {
        this.mission.actionType = selected;
      }
      console.log(this.mission);
    },
    setPlayTypeAction() {
      if (this.isGooglePlayUrl) {
        this.mission.action = `https://play.google.com/store/apps/details?id=${this.mission.packageName}`;
      } else {
        this.mission.action = '';
      }

      this.setDeeplink();
    },
    // TODO : 임시로직 - action, actionType Deeplink로 대체 시 아래 함수는 삭제되어야 함
    setDeeplink() {
      if (this.mission.type === 'play') {
        this.mission.deeplink = this.mission.action;
      } else {
        delete this.mission.deeplink;
      }
    },
    onInputOrder(order) {
      console.log(this.isDependencyWithOrder);
      if (this.isDependencyWithOrder) {
        this.$emit('update-mission-title', {
          order,
          title: `${order}번째 미션`,
        });
      }
    },
  },
};
</script>

<style scoped>
  .mission {
    width: 500px;
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
  .icon {
    width: 50px;
    height: 30px;
    background: black;
  }
  .cursor-pointer {
    cursor: pointer;
  }
</style>
