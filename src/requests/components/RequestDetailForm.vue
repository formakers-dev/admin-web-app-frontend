<template>
  <div class="modal-card noti-info-container">
    <header class="modal-card-head">
      <p class="modal-card-title">알림 정보 {{type === 'modify'? '수정하기' : '등록하기'}}</p>
      <p><font color="red">필수 값 *</font></p>
    </header>
    <section class="modal-card-body">
      <div class="columns" style="width: 100%; height: max-content">
        <div class="column">
          <b-field v-if="data.operatorName">
            <template slot="label">
              운영담당자
              <b-tooltip type="is-dark"
                         label="정보를 등록/수정한 사용자가 담당자로 지정됩니다."
                         position="is-right">
                <b-button class="is-white"
                          style="margin-left: -15px; background: transparent;"
                          rounded>
                  <b-icon size="is-small" icon="help-circle-outline" ></b-icon>
                </b-button>
              </b-tooltip>
            </template>
            <b-field>
              {{data.operatorName}}
            </b-field>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 운영담당자 처리 상태
            </template>
            <b-select  v-model="data.status">
              <option v-for="status in options.status"
                      :key="status.key"
                      :value="status.key">
                {{status.text}}
              </option>
            </b-select>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 의뢰일시
            </template>
            <b-field>
              <b-datetimepicker v-model="data.date"
                                placeholder="의뢰일시"
                                icon="calendar-today">
              </b-datetimepicker>
            </b-field>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 의뢰 희망 테스터 인원 수
            </template>
            <b-numberinput v-model="data.numberOfTester"
                           min="0"
                     validation-message="필수 입력 값입니다."
                     required
            ></b-numberinput>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 의뢰 목적
            </template>
            <b-input v-model="data.purpose"
                     placeholder="의뢰 목적을 입력해주세요."
                     type="textarea"></b-input>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 플랜
            </template>
            <b-select v-model="data.plan">
              <option v-for="plan in options.plan"
                      :key="plan.key"
                      :value="plan.key"
              >
                {{plan.text}}
              </option>
            </b-select>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 희망 테스트 시작일시
            </template>
            <b-datetimepicker v-model="data.openDate"
                              placeholder="테스트 시작일시"
                              icon="calendar-today">
            </b-datetimepicker>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 희망 테스트 진행 일 수
            </template>
            <b-numberinput v-model.number="data.duration"
                           min="0"
                     validation-message="필수 입력 값입니다."
                     required
            ></b-numberinput>
          </b-field>
          <b-field>
            <template slot="label">
              추가 고려사항
            </template>
            <b-input v-model="data.additionalInfo"
                     placeholder="추가 고려사항을 입력해주세요."
                     type="textarea"></b-input>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 유저정보 구매 여부
            </template>
            <b-field>
              <b-checkbox v-model="data.isIncludedUserData">
                {{ data.isIncludedUserData ? '네' : '아니요' }}
              </b-checkbox>
            </b-field>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 커스터마이징 구매 여부
            </template>
            <b-field>
              <b-checkbox v-model="data.isIncludedCustomizing">
                {{ data.isIncludedCustomizing ? '네' : '아니요' }}
              </b-checkbox>
            </b-field>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 커스터마이징 매니저 이메일
            </template>
            <b-taginput
              v-model="data.customizingManagerEmails"
              allow-new
              ellipsis
              icon="label"
              placeholder="이메일을 입력하세요.">
            </b-taginput>
          </b-field>
        </div>
        <div class="is-vertical-divider" style="height: 100%"></div>
        <div class="column">
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 게임 타이틀
            </template>
            <b-input v-model="data.game.title"
                     validation-message="필수 입력 값입니다."
                     required
            ></b-input>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 게임 태그
            </template>
            <b-taginput
              v-model="data.game.tags"
              allow-new
              ellipsis
              icon="label"
              placeholder="게임 태그 입력하세요.">
            </b-taginput>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 게임 설명
            </template>
            <b-input v-model="data.game.description"
                     placeholder="게임 설명을 입력해주세요."
                     type="textarea"></b-input>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 게임 다운로드 URL
            </template>
            <b-input v-model="data.game.downloadUrl"
                     validation-message="필수 입력 값입니다."
                     required
            ></b-input>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 게임 패키지 이름
            </template>
            <b-input v-model="data.game.packageName"
                     validation-message="필수 입력 값입니다."
                     required
            ></b-input>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 개발 진행 단계
            </template>
            <b-select v-model="data.game.devProcess">
              <option v-for="process in options.devProcess"
                      :key="process.key"
                      :value="process.key">
                {{process.text}}
              </option>
            </b-select>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 게임회사 이름
            </template>
            <b-input v-model="data.company.name"
                     validation-message="필수 입력 값입니다."
                     required
            ></b-input>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 게임회사 분류
            </template>
            <b-input v-model="data.company.class"
                     validation-message="필수 입력 값입니다."
                     required
            ></b-input>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 게임회사 규모
            </template>
            <b-numberinput v-model="data.company.numberOfEmployee"
                           min="0"
                           validation-message="필수 입력 값입니다."
                           required
            ></b-numberinput>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 게임회사 분류
            </template>
            <b-input v-model="data.company.class"
                     validation-message="필수 입력 값입니다."
                     required
            ></b-input>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 의뢰자 레퍼럴
            </template>
            <b-taginput
              v-model="data.customer.referer"
              allow-new
              ellipsis
              icon="label"
              placeholder="의뢰자 레퍼럴을 입력하세요.">
            </b-taginput>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 의뢰자 이름
            </template>
            <b-input v-model="data.company.name"
                     validation-message="필수 입력 값입니다."
                     required
            ></b-input>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 의뢰자 전화번호
            </template>
            <b-input v-model="data.company.phoneNumber"
                     validation-message="필수 입력 값입니다."
                     required
            ></b-input>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 의뢰자 이메일
            </template>
            <b-input v-model="data.company.email"
                     validation-message="필수 입력 값입니다."
                     required
            ></b-input>
          </b-field>
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$emit('close')">닫기</button>
      <button class="button is-primary" @click="save"><b>저장</b></button>
    </footer>
  </div>
</template>

<script>
  import request from '../../common/utils/http';

  export default {
    name: 'RequestDetailForm',
    components: {},
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
        error: {
          message: false,
        },
        options:{
          status:[
            {key: 'received',color:'is-danger', text:'접수'},
            {key: 'processing', color:'is-primary', text:'처리중'},
            {key: 'completed', color:'is-warning', text:'종료'},
            {key: 'cancel', color:'is-dark', text:'취소'}
          ],
          devProcess:[
            {key:'1000', text: '기획 & 컨셉 정의'},
            {key:'2000', text: '프로토 타입'},
            {key:'3000', text: '출시 전'},
            {key:'4000', text: '베타 출시'},
            {key:'5000', text: '정식 출시'}
          ],
          plan:[
            {key:'standard', text:'Standard'},
            {key:'simple', text:'Simple'},
            {key:'lite', text:'Lite'},
          ]
        },
        disabled: false,
        data: {
          _id: '',
          // 의뢰 메타 데이터
          date: new Date(),       // 의뢰 일자
          numberOfTester: 0,
          purpose: '',
          plan: '', // 소문자로 영어만
          openDate: new Date(), // 희망 테스트 시작일
          duration: 0, // 희망 테스트 진행 일 수
          additionalInfo: '',
          isIncludedUserData: false,
          isIncludedCustomizing: false,
          customizingManagerEmails: [],
          operatorName: '', //운영담당자 이름
          status: 'received', // 운영담당자가 처리한 상태
          // 게임
          game: {
            title: '',
            tags: [],
            description: '',
            downloadUrl: '',
            packageName: '',
            devProcess: '1000',
          },
          // company
          company: {
            name: '',
            class: '',
            numberOfEmployee: 0,
          },
          // 의뢰자 메타데이터
          customer: {
            referer: [],
            name: '',
            role: '',
            phoneNumber: '',
            email: ''
          }
        }
      };
    },
    mounted() {
      this.data = this.value;
    },
    watch: {
      value:{
        handler(v){
          this.data = Object.assign({}, v);
        },
        deep: true
      }
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
        return true;
      },
      save(){

      }
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

  .noti-info-container .field {
    margin-bottom: 1rem;
  }

  .modal-card-body {
    display: flex;
    align-content: center;
    justify-content: center;
  }
</style>
