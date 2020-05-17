<template>
  <div class="modal-card noti-info-container">
    <header class="modal-card-head">
      <p class="modal-card-title">의뢰 정보 {{type === 'modify'? '수정하기' : '등록하기'}}</p>
      <p><font color="red">필수 값 *</font></p>
    </header>
    <section class="modal-card-body">
      <div class="columns" style="width: 100%; height: max-content">
        <div class="column">
          <b-field>
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
            <b-select  v-model="data.operatorAccountId">
              <option v-for="member in members"
                      :key="member.email"
                      :value="member.email">
                {{member.name}}
              </option>
            </b-select>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 의뢰 상태
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
              의뢰 취소 여부
            </template>
            <b-field>
              <b-checkbox v-model="data.isCancelled">
                {{ data.isCancelled ? '네' : '아니요' }}
              </b-checkbox>
            </b-field>
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
              의뢰 목적
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
              유저 정보 구매 여부
            </template>
            <b-field>
              <b-checkbox v-model="data.isIncludedUserData">
                {{ data.isIncludedUserData ? '네' : '아니요' }}
              </b-checkbox>
            </b-field>
          </b-field>
          <b-field>
            <template slot="label">
              커스터마이징 구매 여부
            </template>
            <b-field>
              <b-checkbox v-model="data.isIncludedCustomizing">
                {{ data.isIncludedCustomizing ? '네' : '아니요' }}
              </b-checkbox>
            </b-field>
          </b-field>
          <b-field>
            <template slot="label">
              <span v-if="data.isIncludedCustomizing" class="has-text-danger">* </span>커스터마이징 매니저 이메일
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
        <div class="is-vertical-divider"></div>
        <div class="column">
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 게임 타이틀
            </template>
            <b-input v-model="data.game.title"
                     ref="gameTitle"
                     validation-message="필수 입력 값입니다."
                     required
            ></b-input>
          </b-field>
          <b-field>
            <template slot="label">
              게임 태그
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
                     ref="gameDescription"
                     placeholder="게임 설명을 입력해주세요."
                     type="textarea"
                     required
            ></b-input>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 게임 다운로드 URL
            </template>
            <b-input v-model="data.game.downloadUrl"
                     ref="gameDownloadUrl"
                     validation-message="필수 입력 값입니다."
                     required
            ></b-input>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 게임 패키지 이름
            </template>
            <b-input v-model="data.game.packageName"
                     ref="gamePackageName"
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
              <span class="has-text-danger">*</span> 회사 이름
            </template>
            <b-input v-model="data.company.name"
                     ref="companyName"
                     validation-message="필수 입력 값입니다."
                     required
            ></b-input>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 회사 분류
            </template>
            <b-input v-model="data.company.class"
                     ref="companyClass"
                     validation-message="필수 입력 값입니다."
                     required
            ></b-input>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 회사 규모
            </template>
            <b-numberinput v-model="data.company.numberOfEmployee"
                           min="0"
                           validation-message="필수 입력 값입니다."
                           required
            ></b-numberinput>
          </b-field>
          <b-field>
            <template slot="label">
              의뢰자 이름
            </template>
            <b-input v-model="data.customer.name"></b-input>
          </b-field>
          <b-field>
            <template slot="label">
              의뢰자 전화번호
            </template>
            <b-input v-model="data.customer.phoneNumber"></b-input>
          </b-field>
          <b-field>
            <template slot="label">
              의뢰자 직책
            </template>
            <b-input v-model="data.customer.role"></b-input>
          </b-field>
          <b-field>
            <template slot="label">
              의뢰자 이메일
            </template>
            <b-input v-model="data.customer.email"></b-input>
          </b-field>
          <b-field>
            <template slot="label">
              의뢰자 레퍼럴
            </template>
            <b-taginput
              v-model="data.customer.referers"
              allow-new
              ellipsis
              icon="label"
              placeholder="의뢰자 레퍼럴을 입력하세요.">
            </b-taginput>
          </b-field>
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$emit('close', false)">닫기</button>
      <button v-if="type==='modify'" class="button is-primary" @click="update"><b>의뢰 수정</b></button>
      <button v-if="type==='add'" class="button is-primary" @click="create"><b>의뢰 생성</b></button>
    </footer>
  </div>
</template>

<script>
  import httpRequest from '../../common/utils/http';

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
      options:{
        type: Object,
        default(){
          return null;
        }
      }
    },
    data() {
      return {
        members: [
          { name: 'Eve', email: 'bolimlee22@gmail.com' },
          { name: 'Yenarue', email: 'yenarue@gmail.com' },
          { name: 'Jason', email: 'sryu99@gmail.com' },
          { name: 'Jake', email: 'copyx00@gmail.com' }
        ],
        disabled: false,
        data: {
          _id: '',
          // 의뢰 메타 데이터
          date: new Date(),       // 의뢰 일자
          numberOfTester: 10,
          purpose: '',
          plan: 'lite', // 소문자로 영어만
          openDate: new Date(), // 희망 테스트 시작일
          duration: 7, // 희망 테스트 진행 일 수
          additionalInfo: '',
          isIncludedUserData: false,
          isIncludedCustomizing: false,
          customizingManagerEmails: [],
          operatorName: '', //운영담당자 이름
          operatorAccountId: '',
          status: 'received', // 운영담당자가 처리한 상태
          isCancelled: false,
          // 게임
          game: {
            title: '',
            tags: [],
            description: '',
            downloadUrl: '',
            packageName: '',
            devProcess: 1000,
          },
          // company
          company: {
            name: '',
            class: '',
            numberOfEmployee: 0,
          },
          // 의뢰자 메타데이터
          customer: {
            referers: [],
            name: '',
            role: '',
            phoneNumber: '',
            email: ''
          }
        }
      };
    },
    mounted() {
      if(this.value){
        this.data = this.value;
      }
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
      validate() {
        let isValid = true;
        for (let ref in this.$refs) {
          let checkValidity = this.$refs[ref].checkHtml5Validity();
          if(!checkValidity){
            isValid = false;
          }
        }
        return isValid;
      },
      getOperatorName(){
        if(this.data.operatorAccountId){
          return this.members.filter((member)=> member.email === this.data.operatorAccountId)[0].name;
        }
        return '';
      },
      update(){
        if(this.validate()){
          this.data.operatorName = this.getOperatorName();
          const url = '/api/requests/'+this.data._id;
          httpRequest.put(url, this.data).then(res=>{
            this.$root.showSuccessToast('정상적으로 수정하였습니다.');
            this.$emit('close', true);
          }).catch(error=>{
            this.$root.showErrorToast('수정에 실패하였습니다.', error);
          });
        }
      },
      create(){
        if(this.validate()){
          this.data.operatorName = this.getOperatorName();
          const url = '/api/requests';
          httpRequest.post(url, this.data).then(res=>{
            this.$root.showSuccessToast('정상적으로 의뢰 등록하였습니다.');
            this.$emit('close', true);
          }).catch(error=>{
            this.$root.showErrorToast('의뢰 등록에 실패하였습니다.', error);
          });
        }
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
