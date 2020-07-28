<template>
  <section class="modal-card" style="width: auto">
    <header v-if="type != 'readonly'" class="modal-card-head">
      <div class="modal-card-title">
        {{mission.order}}번째 미션 정보 {{this.type === 'modify'? '수정하기' : '등록하기'}}
      </div>
      <p class="has-text-danger">필수 값 *</p>
    </header>
    <section class="modal-card-body">
      <div class="columns" style="width: 100%; height: max-content">
        <div class="column">
          <b-field v-if="mission._id" label="미션 아이디" horizontal
                   style="background: #f5f5f5; padding: 10px">
            {{mission._id}}
          </b-field>
          <div class="columns" style="width: 100%; height: max-content">

            <div class="column">
              <b-field>
                <template slot="label">
                  <span class="has-text-danger">*</span> 타입
                </template>
                <b-select v-model="missionType"
                          v-on:input="setMissionType" :disabled="disabled">
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
                  <b-input ref='mission.title' v-model="mission.title" required
                           :disabled="disabled"></b-input>
                </div>
              </b-field>
              <b-field>
                <template slot="label">
                  <span class="has-text-danger">*</span> 내용
                </template>
                <b-input ref='mission.description' type="textarea" v-model="mission.description"
                         placeholder="[게임명] 에 대한 구체적인 의견을 작성해주세요." required
                         :disabled="disabled"></b-input>
              </b-field>

              <b-field label="내용 이미지">
                <b-input v-model="mission.descriptionImageUrl"
                         placeholder="https://i.imgur.com/NBfLCwq.png"
                         :disabled="disabled"></b-input>
              </b-field>
              <img v-if="mission.descriptionImageUrl"
                   style="width: 500px" :src="mission.descriptionImageUrl"/>
            </div>
            <div class="column">
              <b-field label="가이드 문구">
                <b-input ref='mission.guide' type="textarea" v-model="mission.guide"
                         :disabled="disabled"></b-input>
              </b-field>

              <b-field v-if="missionType === 'install' || missionType === 'play'">
                <template slot="label">
                  <span class="has-text-danger">*</span> 설치&플레이 게임의 패키지명
                </template>
                <b-input
                  v-model="mission.packageName"
                  ref='mission.packageName'
                  placeholder="com.formakers.fomes"
                  @input="resetAction"
                  required :disabled="disabled"></b-input>
              </b-field>

              <b-field>
                <template slot="label">
                  <span class="has-text-danger">*</span> 액션 타입
                </template>
                <b-select v-model="actionType"
                          @input="setMissionActionType"
                          required :disabled="disabled">
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
                  <div class="level" v-if="missionType === 'install'">
                    <div class="level-left">
                      <b-checkbox v-model="isGooglePlayUrl"
                                  @input="resetAction" :disabled="disabled">
                        구글플레이 기본 마켓 URL 사용하기
                      </b-checkbox>
                    </div>
                    <div class="level-right" style="margin-left: 10px;">
                      <b-button @click="addReferrer" :disabled="disabled">
                        <div style="font-size: 15px">URL에 Referrer 추가</div>
                        <div style="font-size: 10px">(utm_source=formakers)</div>
                      </b-button>
                    </div>
                  </div>

                  <b-input
                    ref='mission.action'
                    v-model="mission.action"
                    placeholder="https://docs.google.com/forms/d/e/1FAIpQLSdxI2s694nLTVk4i7RMkkrtr-K_0s7pSKfUnRusr7348nQpJg/viewform?usp=pp_url&internal_web=true&entry.1042588232={email}"
                    required
                    :disabled="disabled"></b-input>
                </div>

              </b-field>
              <b-field label="옵션">
                <b-taginput
                  v-model="mission.options"
                  :data="missionOptions"
                  autocomplete
                  icon="label"
                  placeholder="미션 아이템의 옵션을 추가해주세요"
                  :disabled="disabled">
                </b-taginput>
              </b-field>
            </div>
          </div>
        </div>
      </div>
    </section>
    <footer v-if="type != 'readonly'" class="modal-card-foot">
      <b-button @click="$emit('close', false)">닫기</b-button>
      <b-button v-if="type==='modify'" type="is-primary" @click="update"><b>미션 수정</b></b-button>
      <b-button v-if="type==='add'" type="is-primary" @click="create"><b>미션 등록</b></b-button>
    </footer>
  </section>
</template>

<script>
  export default {
    name: 'Mission',
    props: {
      item: {
        type: Object,
        default() {
          return null;
        }
      },
      type: {
        type: String,
        default() {
          return 'add';
        }
      },
      packageName: {
        type: String,
        default() {
          return '';
        }
      }
    },
    data() {
      return {
        mission: {},
        isGooglePlayUrl: false,
        actionType: 'default',
        missionType: 'survey',
        missionOptions: ['mandatory', 'repeatable', 'recheckable'],
        missionTypes: ['install', 'play', 'survey'],
        missionActionTypes: ['default', 'internal_web'],
        disabled: false
      };
    },
    mounted() {
      this.mission = Object.assign({}, this.item);
      this.missionType = this.mission.type ? this.mission.type : 'survey';
      this.mission.packageName = this.mission.packageName ? this.mission.packageName : this.packageName;
      this.setMissionType(this.missionType);
      this.actionType = this.mission.actionType ? this.mission.actionType : 'default';
      this.disabled = this.type === 'readonly';
    },
    methods: {
      setMissionType(selected) {
        this.mission.type = selected;
        if (selected === 'survey') {
          this.mission.actionType = 'internal_web';
          delete this.mission.packageName;
        } else if (selected === 'play') {
          this.mission.actionType = 'internal_web';
        } else {
          this.mission.actionType = 'default';
        }
      },
      setMissionActionType(selected) {
        if (selected === 'default') {
          delete this.mission.actionType;
        } else {
          this.mission.actionType = selected;
        }
      },
      resetAction() {
        if (this.isGooglePlayUrl) {
          this.mission.action = `https://play.google.com/store/apps/details?id=${this.mission.packageName}`;
        } else {
          this.mission.action = '';
        }
      },
      addReferrer() {
        if (this.mission.action && this.mission.action.indexOf('referrer=utm_source') < 0) {
          this.mission.action += '&referrer=utm_source%3Dformakers';
        }
      },
      create() {
        if (this.validate()) {
          this.$emit('upsertMission', 'create', this.mission);
          this.$emit('close');
        }
      },
      update() {
        if (this.validate()) {
          this.$emit('upsertMission', 'update', this.mission);
          this.$emit('close');
        }
      },
      validate() {
        let isValid = true;
        for (let ref in this.$refs) {
          if (this.$refs[ref]) {
            let checkValidity = this.$refs[ref].checkHtml5Validity();
            if (!checkValidity) {
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
  .order-wrapper {
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
