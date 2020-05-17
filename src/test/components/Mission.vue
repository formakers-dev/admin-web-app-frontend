<template>
  <section class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">미션 정보 {{modalType === 'modify'? "수정하기" : "등록하기"}}</p>
      <p class="has-text-danger">필수 값 *</p>
    </header>
    <section class="modal-card-body">
      <div class="columns" style="width: 100%; height: max-content">
        <div class="column">
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 타입
            </template>
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
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 제목
            </template>
            <div>
              <b-checkbox v-model="isDependencyWithOrder">
                순서와 연동 (order + "번째 미션")
              </b-checkbox>
              <b-input ref='mission.title' v-model="mission.title" placeholder="1단계 미션" required></b-input>
            </div>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 내용
            </template>
            <b-input ref='mission.description' type="textarea" v-model="mission.description"
                     placeholder="[2048] 에 대한 구체적인 의견을 작성해주세요." required></b-input>
          </b-field>

          <b-field label="내용 이미지">
            <b-input v-model="mission.descriptionImageUrl"
                     placeholder="https://i.imgur.com/NBfLCwq.png"></b-input>
          </b-field>
          <img v-if="mission.descriptionImageUrl"
               style="width: 500px" :src="mission.descriptionImageUrl"/>
        </div>
        <div class="column">
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 가이드 문구
            </template>
            <b-input ref='mission.guide'  type="textarea" v-model="mission.guide" required></b-input>
          </b-field>

          <b-field v-if="type === 'play'">
            <template slot="label">
              <span class="has-text-danger">*</span> 플레이 할 게임의 패키지명
            </template>
            <b-input
              v-model="mission.packageName"
              ref='mission.packageName'
              placeholder="com.formakers.fomes"
              @input="setPlayTypeAction"
              required></b-input>
          </b-field>

          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 액션 타입
            </template>
            <b-select v-model="actionType"
                      @input="setMissionActionType"
                      required>
              <option
                v-for="type in missionActionTypes"
                :value="type"
                :key="type">
                {{ type }}
              </option>
            </b-select>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 액션
            </template>
            <div>
              <b-checkbox v-if="type === 'play'"
                          v-model="isGooglePlayUrl"
                          @input="setPlayTypeAction()">
                구글플레이 기본 마켓 URL 사용하기
              </b-checkbox>
              <b-input
                ref='mission.action'
                v-model="mission.action"
                placeholder="https://docs.google.com/forms/d/e/1FAIpQLSdxI2s694nLTVk4i7RMkkrtr-K_0s7pSKfUnRusr7348nQpJg/viewform?usp=pp_url&internal_web=true&entry.1042588232={email}"
                @input="setDeeplink"
                required></b-input>
            </div>
          </b-field>
          <b-field label="옵션">
            <b-taginput
              v-model="mission.options"
              :data="missionOptions"
              autocomplete
              icon="label"
              placeholder="미션 아이템의 옵션을 추가해주세요">
            </b-taginput>
          </b-field>
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <b-button @click="$emit('close', false)">닫기</b-button>
      <b-button v-if="modalType==='modify'" type="is-primary" @click="update"><b>미션 수정</b></b-button>
      <b-button v-if="modalType==='add'" type="is-primary" @click="create"><b>미션 등록</b></b-button>
    </footer>
  </section>
</template>

<script>
export default {
  name: 'Mission',
  props: {
    item:{
      type: Object,
      default(){
        return null;
      }
    },
    modalType:{
      type: String,
      default(){
        return 'add'
      }
    }
  },
  data() {
    return {
      mission:{},
      isGooglePlayUrl: true,
      isDependencyWithOrder: false,
      actionType: 'default',
      type: 'survey',
      missionOptions: ['mandatory', 'repeatable', 'recheckable'],
      missionTypes: ['play', 'survey'],
      missionActionTypes: ['default', 'internal_web'],
    };
  },
  mounted() {
    this.mission = Object.assign({}, this.item);
    this.setMissionType(this.mission.type || 'survey');
    this.onInputOrder(this.mission.order);
    this.actionType = this.mission.actionType.length > 0 ? this.mission.actionType : 'default';
    this.type = this.mission.type.length > 0 ? this.mission.type : 'survey';
  },
  methods: {
    setMissionType(selected) {
      this.mission.type = selected;
      if (selected === 'play') {
        this.mission.actionType = 'default';
        this.setPlayTypeAction();
      }
    },
    setMissionActionType(selected) {
      if (selected === 'default') {
        delete this.mission.actionType;
      } else {
        this.mission.actionType = selected;
      }
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
    create(){
      if(this.validate()){
        this.$emit('upsertMission', 'create', this.mission);
        this.$emit('close');
      }
    },
    update(){
      if(this.validate()){
        this.$emit('upsertMission', 'update', this.mission);
        this.$emit('close');
      }
    },
    validate(){
      let isValid = true;
      for (let ref in this.$refs) {
        if(this.$refs[ref]){
          let checkValidity = this.$refs[ref].checkHtml5Validity();
          if(!checkValidity){
            isValid = false;
          }
        }
      }
      return isValid;
    }
  },
};
</script>

<style scoped>
  .order-wrapper{
    position: absolute;
    left: 0;
    top: 0;
    padding: 5px 10px;
    background-color: #00BFBA;
    font-weight: bold;
    color: white;
    width: 60px;
    text-align: center;
  }
</style>
