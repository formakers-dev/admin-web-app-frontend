<template>
  <div>
    <h1 v-if="type==='add'" class="title">🎮 게임 테스트 등록하기 🎮</h1>
    <h1 v-if="type==='update'" class="title">🎮 게임 테스트 수정하기 🎮</h1>
    <b-steps
      v-model="activeStep"
      size="is-small"
      :has-navigation="false"
      :animated="false"
    >
      <div class="level">
        <div class="level-left">
        </div>
        <div class="level-right">
          <div class="level-item">
            <b-button
              outlined
              icon-left="arrow-left"
              :disabled="activeStep === 0"
              @click.prevent="--activeStep">
              Previous
            </b-button>
          </div>
          <div class="level-item">
            <b-button
              outlined
              icon-right="arrow-right"
              :disabled="activeStep === 3"
              @click.prevent="++activeStep">
              Next
            </b-button>
          </div>
          <div class="level-item">
            <b-button v-if="type==='add'" type='is-primary' @click="registerBetaTest" size="is-medium">테스트 등록</b-button>
            <b-button v-if="type==='update'" type='is-primary' @click="updateBetaTest">테스트 수정</b-button>
          </div>
        </div>
      </div>
      <b-step-item step="1" label="테스트 기본 정보" clickable>
        <div class="box">
          <b-field label="테스트 모드 설정" horizontal>
            <b-switch v-model="isTargetToFomesMembers">
              해당 테스트를 <strong class="has-text-primary">포메이커스 관리자들</strong>에게 보여지게 하기! (테스트 모드)
            </b-switch>
          </b-field>
          <b-field label="오픈 시각" horizontal>
            <b-datetimepicker v-model="betaTest.openDate"
                              placeholder="오픈 시각을 선택해주세요."
                              icon="calendar-today">
            </b-datetimepicker>
          </b-field>
          <b-field label="종료 시각" horizontal>
            <b-datetimepicker v-model="betaTest.closeDate"
                              placeholder="종료 시각을 선택해주세요."
                              icon="calendar-today">
            </b-datetimepicker>
          </b-field>
          <b-field label="유형" horizontal>
            <b-field>
              <b-radio-button v-for="subjectType in options.subjectTypes"
                              :key="subjectType.key"
                              v-model="betaTest.subjectType"
                              :native-value="subjectType.key"
                              @input="setSubjectType"
                              type="is-primary">
                {{subjectType.text}}
              </b-radio-button>
            </b-field>
          </b-field>
          <b-field v-if="betaTest.subjectType === 'game-test'" horizontal>
            <template slot="label">
              <span class="has-text-danger">*</span> 플랜
            </template>
            <b-field>
              <b-radio-button v-for="plan in options.plan"
                              :key="plan.key"
                              v-model="betaTest.plan"
                              :native-value="plan.key"
                              type="is-primary">
                {{plan.text}}
              </b-radio-button>
            </b-field>
          </b-field>
          <b-field horizontal>
            <template slot="label">
              <span class="has-text-danger">*</span> 제목
            </template>
            <b-input ref="betaTest.title"
                     v-model="betaTest.title"
                     placeholder="[게임명] 게임 테스트"
                     required></b-input>
          </b-field>
          <b-field label="게임 소개" horizontal>
            <b-input type="textarea" v-model="betaTest.description"></b-input>
          </b-field>
          <b-field horizontal>
            <template slot="label">
              <span class="has-text-danger">*</span> 태그
            </template>
            <b-taginput
              ref="betaTest.tags"
              v-model="betaTest.tags"
              ellipsis
              icon="label"
              placeholder="태그를 추가하세요"
            :required="betaTest.tags.length === 0">
            </b-taginput>
          </b-field>
          <b-field horizontal>
            <template slot="label">
              <span class="has-text-danger">*</span> 미션 요약 설명
            </template>
            <b-input v-model="betaTest.missionsSummary"
                     placeholder="사전 신청  /  30분 플레이  /  설문 참여 (객20/주5)"
                     required></b-input>
          </b-field>
          <b-field label="테스트 목적" horizontal>
            <b-input v-model="betaTest.purpose"></b-input>
          </b-field>
          <b-field label="버그리포트 설문" horizontal>
            <div>
              <b-field>
                <b-radio-button v-for="type in options.webDeeplinkType"
                                :key="type.key"
                                v-model="bugReportUrlType"
                                :native-value="type.key"
                                type="is-primary">
                  {{type.text}}
                </b-radio-button>
              </b-field>
              <b-field v-if="bugReportUrlType === 'internal_web'"
                       label="앱에 보여질 제목" horizontal>
                <b-input v-model="bugReportTitle" placeholder="[게임명] 버그 제보"></b-input>
              </b-field>
              <b-field label="설문 URL" horizontal>
                <b-input v-model="bugReportUrl"
                         placeholder="https://docs.google.com/forms/d/e/1FAIpQLSfCYFte9p8faIOve6YWYQkqDXdeJLggSnucAtnIYR0TsEF8fA/viewform?usp=pp_url&entry.1223559684={email}"
                ></b-input>
              </b-field>
            </div>
          </b-field>
          <b-field label="테스트 진행 상태별 문구" horizontal>
            <b-checkbox v-model="isCustomizedProgressText" @input="initializeProgressText">
              기본 상태별 문구 이외의 문구 출력을 원하는 경우만 체크해서 내용을 수정하세요.
            </b-checkbox>
          </b-field>
          <div v-if="isCustomizedProgressText">
            <b-field horizontal>
              <template slot="label">
                <span class="has-text-danger">*</span> 참여 전
              </template>
              <b-input ref="betaTest.progressText.ready"
                       v-model="betaTest.progressText.ready"
                       placeholder="밑져야 본전! 재미있어 보인다면 참여해 보세요."
              required></b-input>
            </b-field>
            <b-field horizontal>
              <template slot="label">
                <span class="has-text-danger">*</span> 참여 중
              </template>
              <b-input v-model="betaTest.progressText.doing"
                       ref="betaTest.progressText.doing"
                       placeholder="당신을 기다리고 있었어요! 이어서 참여해볼까요?"
              required></b-input>
            </b-field>
            <b-field horizontal>
              <template slot="label">
                <span class="has-text-danger">*</span> 참여 완료
              </template>
              <b-input v-model="betaTest.progressText.done"
                       ref="betaTest.progressText.done"
                       placeholder="굿! 훌륭해요! 마감 후 테스터 시상식이 열릴거에요."
              required></b-input>
            </b-field>
          </div>
        </div>
      </b-step-item>

      <b-step-item step="2" label="의뢰 게임 정보" clickable>
        <div class="box">
          <b-field v-if="betaTest.subjectType === 'game-test'"
                   horizontal>
            <template slot="label">
              게임 패키지명
            </template>
            <b-input v-model="packageName"
                     @input="resetAppsCheckStatus"
                     ref="packageName"
                     placeholder="com.formakers.fomes"></b-input>
            <b-button type="is-primary" @click="getApp(packageName)">
              앱 정보 존재여부 확인
            </b-button>
          </b-field>
          <b-field horizontal>
            <template slot="label">
              <span class="has-text-danger">*</span> 앱 아이콘
            </template>
            <b-input v-model="betaTest.iconImageUrl"
                     ref="betaTest.iconImageUrl"
                     placeholder="https://i.imgur.com/NBfLCwq.png"
                     required></b-input>
            <b-button type="is-info"
                      :disabled="iconImageUrlFromApps === ''"
                      @click="setIconImageUrlFromApps()">앱 정보에서 아이콘 가져오기</b-button>
          </b-field>
          <b-field v-if="betaTest.iconImageUrl"  label="앱 아이콘 Preview" horizontal>
            <img v-if="betaTest.iconImageUrl" style="width: 150px" :src="betaTest.iconImageUrl"/>
          </b-field>
          <b-field horizontal>
            <template slot="label">
              <span class="has-text-danger">*</span> 대표 이미지 URL
              <b-tooltip type="is-dark" label="메인화면에서 보여지는 커버 이미지 입니다.">
                <b-icon size="is-small" icon="help-circle-outline"></b-icon>
              </b-tooltip>
            </template>
            <b-input v-model="betaTest.coverImageUrl"
                     ref="betaTest.converImageUrl"
                     placeholder="https://i.imgur.com/NBfLCwq.png"
            required></b-input>
          </b-field>
          <b-field v-if="betaTest.coverImageUrl"  label="대표 이미지 Preview" horizontal>
            <img style="width: 500px" :src="betaTest.coverImageUrl"/>
          </b-field>
        </div>
      </b-step-item>
      <b-step-item step="3" label="리워드" clickable>
        <div class="box">
          <div class="level">
            <div class="level-left">
            </div>
            <div class="level-right">
              <div class="level-item">
                <b-select v-model="rewardType" size="is-small" style="margin-right: 5px">
                  <option v-for="type in options.rewardTypes"
                          :key="type.key"
                          :value="type.key">
                    {{type.value.title}}
                  </option>
                </b-select>
                <b-button  type='is-info' @click="addRewardCard" size="is-small">리워드 추가</b-button>
              </div>
            </div>
          </div>
          <section>
            <draggable class="columns is-multiline"
                       draggable=".rewards"
                       v-model="betaTest.rewards.list"
                       @change="changeOrder(betaTest.rewards.list)">
              <RewardItem v-for="(reward,index) in betaTest.rewards.list"
                          ref="rewardItem"
                          :key="index"
                          :reward="reward"
                          :reward-types="options.rewardTypes"
                          :disabled="false"
                          class="column is-one-third rewards"
                          @remove-reward-item="removeRewardCard"/>
            </draggable>
          </section>
        </div>
      </b-step-item>
      <b-step-item step="4" label="미션" clickable>
        <div class="box">
          <section>
            <div class="level">
              <div class="level-left">
                <b-field label="테스트 구성" horizontal custom-class="is-small" v-if="type==='add'">
                  <b-field>
                    <b-radio-button v-model="testType"
                                    v-for="type in options.testTypes"
                                    :key="type.key"
                                    :native-value="type.key"
                                    @input="setMissionsByTestType"
                                    type="is-primary"
                    size="is-small">
                      {{type.text}}
                    </b-radio-button>
                  </b-field>
                </b-field>
              </div>
              <div class="level-right">
                <div class="level-item">
                  <b-button  type='is-info' @click="addMissionCard" size="is-small">미션 추가</b-button>
                </div>
              </div>
            </div>
            <section>
              <draggable class="columns is-multiline"
                         draggable=".mission"
                         v-model="betaTest.missions"
                         @change="changeOrder(betaTest.missions)">
                <div class="column is-one-third mission"
                     v-for="(mission, index) in betaTest.missions"
                     :key="index"
                     @click="openMissionForm('modify', mission)"
                >
                  <div class="card" style="cursor: pointer">
                    <div class="card-content">
                      <div class="media">
                        <div class="media-content">
                          <div  style="position: absolute; right:20px">
                            <b-button v-if="type==='update'"
                                      class="button"
                                      type="is-info"
                                      style="margin-right: 5px"
                                      size="is-small"
                                      @click.stop="showBetaTester(mission._id, mission.betaTestId)"
                                      outlined>미션 완료자 추가/삭제</b-button>
                            <b-button class="button"
                                      type="is-danger"
                                      size="is-small"
                                      @click.stop="removeMissionCard(mission.order)"
                                      outlined>삭제</b-button>
                          </div>
                        </div>
                      </div>
                      <div class="content" style="margin-top: 40px">
                        <span class="order-wrapper">{{mission.order}}</span>
                        <p class="title is-5">{{mission.title ? mission.title : '제목을 입력해주세요.'}}
                          <b-tag type="is-warning">{{mission.type}}</b-tag>
                        </p>
                        <p class="subtitle is-6" style="color:gray; margin-top:10px">{{mission.description ? mission.description : '내용을 입력해주세요.'}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </draggable>
            </section>
          </section>
        </div>
      </b-step-item>
    </b-steps>
  </div>
</template>

<script>
import request from '../../common/utils/http';
import RewardItem from '../components/RewardItem.vue';
import Mission from '../components/Mission.vue';
import Draggable from 'vuedraggable';
import Participants  from '../components/Participants';

export default {
  name: 'TestRegister',
  components: {
    RewardItem,
    Draggable,
  },
  props:{
    step:{
      type: Number,
      default(){
        return 0;
      }
    }
  },
  data() {
    return {
      activeStep:0,
      options:{
        plan:[
          {key:'trial', text:'Trial'},
          {key:'starter', text:'Starter'},
          {key:'lite', text:'Lite'},
          {key:'simple', text:'Simple'},
          {key:'standard', text:'Standard'},
        ],
        rewardTypes:[
          {key:9000, value:{typeCode:9000, title:'테스트 수석', iconImageUrl:'https://i.imgur.com/ybuI732.png', content:'문화상품권 3만원', price: 30000, count: 1}},
          {key:7000, value:{typeCode:7000, title:'테스트 차석', iconImageUrl:'https://i.imgur.com/6RaZ7vI.png', content:'문화상품권 5천원', price: 5000, count: 1}},
          {key:5000, value:{typeCode:5000, title:'테스트 성실상', iconImageUrl:'https://i.imgur.com/btZZHRp.png', content:'문화상품권 1천원', price: 1000}},
          {key:3000, value:{typeCode:3000, title:'참가상', iconImageUrl:'', content:''}},
          {key:1000, value:{typeCode:1000, title:'기타', iconImageUrl:'', content:''}},
        ],
        testTypes:[
          {key:'default', text:'자유선택'},
          {key:'short', text:'약식설문형'},
          {key:'simple', text:'간단설문형'},
          {key:'normal', text:'일반설문형'},
          {key:'application+simple', text:'간단설문형 + 참가신청'},
          {key:'application+normal', text:'일반설문형 + 참가신청'},
        ],
        subjectTypes:[
          {key:'game-test', text:'게임 테스트'},
          {key:'fomes-test', text:'포메스 테스트'},
          {key:'event', text:'이벤트'},
        ],
        webDeeplinkType: [
          {key: "internal_web", text: "인앱웹뷰"},
          {key: "external_web", text: "외부 브라우저"},
        ]
      },
      rewardType: 9000,
      result: '',
      isTargetToFomesMembers: true,
      isCustomizedProgressText: false,
      packageName: '',
      iconImageUrlFromApps: '',
      testType: 'simple',
      type:'add',
      bugReportUrlType: 'internal_web',
      bugReportUrl: '',
      bugReportTitle: '',
      betaTest: {
        title: '',
        plan:'trial',
        description: '',
        subjectType: 'game-test',
        tags: [],
        purpose: '',
        coverImageUrl: '',
        iconImageUrl: '',
        openDate: new Date(),
        closeDate: new Date(),
        rewards: {
          list: [],
        },
        missions: [],
        missionsSummary: '',
        status: 'test',
        bugReport: {
          url: '',
        },
      },
    };
  },
  watch:{
    'betaTest.subjectType' : {
      handler(value){
        if(value === 'game-test'){
          if(!this.betaTest.plan){
            this.$set(this.betaTest, 'plan', 'trial');
          }
        }
      },
      deep:true
    },
  },
  created() {
    if(this.$route.query.id){
      this.type='update';
      this.getBetaTest();
    }else{
      this.type='add';
      const openDate = new Date();
      openDate.setHours(9);
      openDate.setMinutes(0);
      openDate.setSeconds(0);
      const closeDate = new Date();
      closeDate.setHours(23);
      closeDate.setMinutes(59);
      closeDate.setSeconds(59);
      this.betaTest.openDate = openDate;
      this.betaTest.closeDate = closeDate;
      this.setMissionsByTestType();
    }
  },
  mounted() {
    this.activeStep = this.step > 0 ? this.step : this.activeStep;
  },
  methods: {
    prepareDataToRegister() {
      if (this.isTargetToFomesMembers) {
        this.betaTest.status = 'test';
      } else {
        delete this.betaTest.status;
      }

      if (this.betaTest.bugReport) {
        const bugReportUrlHost = 'fomes://web';
        let bugReportUrlPath;
        switch (this.bugReportUrlType) {
          case 'internal_web':
            bugReportUrlPath = '/internal';
            break;
          case 'external_web':
            bugReportUrlPath = '/external';
            break;
        }
        this.betaTest.bugReport.url = bugReportUrlHost + bugReportUrlPath
          + "?title=" + this.bugReportTitle + "&url=" + encodeURIComponent(this.bugReportUrl);
      }

      //리워드 관련 임시 처리 (추후 앱 크리티컬 업데이트 시 아래 내용 삭제 필요)
      if (this.betaTest.rewards.list) {
        this.betaTest.rewards.list.forEach(reward => {
          switch (reward.typeCode) {
            case 9000 :
              reward.type = "best";
              break;
            case 7000 :
              reward.type = "good";
              break;
            case 5000 :
              reward.type = "normal";
              break;
            case 3000 :
              reward.type = "participated";
              break;
            case 1000 :
              reward.type = "etc";
              break;
          }
        });
      }
    },
    getBetaTest(){
      request.get('/api/beta-test/'+this.$route.query.id).then((result) => {
        this.betaTest = Object.assign({}, result.data);
        this.betaTest.openDate = new Date(result.data.openDate);
        this.betaTest.closeDate = new Date(result.data.closeDate);
        this.isTargetToFomesMembers = this.betaTest.status === 'test';
        this.isCustomizedProgressText = this.betaTest.progressText ? true : false;

        if (this.type === 'update') {
          if (this.betaTest.bugReport) {
            const url = new URL(this.betaTest.bugReport.url);

            switch (url.pathname) {
              case "//web/internal":
                this.bugReportUrlType = "internal_web";
                break;
              case "//web/external":
                this.bugReportUrlType = "external_web";
            }

            this.bugReportUrl = new URLSearchParams(url.search).get("url");
            this.bugReportTitle = new URLSearchParams(url.search).get("title");
          }
        }
      }).catch(err => {
        this.$root.showErrorToast('테스트 항목 조회에 실패하였습니다.',err);
      });
    },
    registerBetaTest() {
      if(this.validate()){
        this.prepareDataToRegister();
        const body = this.betaTest;
        request.post('/api/beta-test', body)
          .then((result) => {
            this.result = result;
            this.$root.showSuccessToast('등록을 정상적으로 하였습니다.');
            this.$router.push('/test/list');
          })
          .catch((err) => {
            this.$root.showErrorToast('등록에 실패하였습니다.',err);
          });
      }else{
        this.$root.showToast('is-info', '필수 입력 값을 확인해주세요');
      }
    },
    updateBetaTest() {
      if(this.validate()){
        this.prepareDataToRegister();
        const body = this.betaTest;
        console.log(body);
        request.put('/api/beta-test/'+body._id, body)
          .then((result) => {
            this.result = result;
            this.$root.showSuccessToast('정상적으로 수정하였습니다.');
            this.$router.replace({path:'/test/detail', query:this.$route.query});
          })
          .catch((err) => {
            this.$root.showErrorToast('수정에 실패하였습니다.',err);
          });
      }else{
        this.$root.showToast('is-info', '필수 입력 값을 확인해주세요');
      }
    },
    setSubjectType(selected) {
      this.betaTest.subjectType = selected;
      if (selected !== 'game-test') {
        delete this.betaTest.plan;
      }
    },
    addRewardCard() {
      const rewardListLength = this.betaTest.rewards.list.length;
      let item = {};
      this.options.rewardTypes.forEach((i)=>{
        if(i.key === this.rewardType){
          item = Object.assign({}, i.value);
        }
      });
      item.order = rewardListLength > 0
        ? Number(this.betaTest.rewards.list[rewardListLength - 1].order) + 1 : 1;
      this.betaTest.rewards.list.push(item);
    },
    removeRewardCard(order) {
      const item = this.betaTest.rewards.list.find(i => i.order === order);
      const itemIndex = this.betaTest.rewards.list.indexOf(item);
      this.betaTest.rewards.list.splice(itemIndex, 1);
      this.betaTest.rewards.list.forEach((item,index)=>{
        item.order = index+1;
      })
    },
    addMissionCard() {
      if(!this.betaTest.missions){
       this.betaTest.missions = [];
      }
      const mission = {
        order: this.betaTest.missions.length+1,
        type: 'survey',
        title: '',
        description: '',
        descriptionImageUrl: '',
        guide: '',
        actionType: 'internal_web',
        action: '',
        options: [],
      };
      this.openMissionForm('add', mission);
    },
    removeMissionCard(order) {
      console.log('removeMissionCard order', order);
      const item = this.betaTest.missions.find(i => i.order === order);
      const itemIndex = this.betaTest.missions.indexOf(item);
      this.betaTest.missions.splice(itemIndex, 1);
      this.betaTest.missions.forEach((item,index)=>{
        item.order = index+1;
      })
    },
    resetAppsCheckStatus() {
      this.iconImageUrlFromApps = "";
    },
    getApp(packageName) {
      if (!packageName) {
        this.$root.showToast('is-warning', '게임 패키지명을 입력해주세요.');
        this.$refs.packageName.focus();
        return;
      }

      request.get(`/api/apps/${packageName}`)
        .then((res) => {
          this.iconImageUrlFromApps = res.data.iconUrl;
          this.$root.showToast('is-info', '등록된 앱 정보가 존재합니다.');
        })
        .catch((err) => {
          console.log(err);
          if(err && err.response && err.response.status === 404) {
            this.showAppCrawlingConfirmDialog(packageName);
          } else {
            this.$root.showToast('is-danger', '앱 정보 조회 중 오류가 발생했습니다.');
          }
        });
    },
    setIconImageUrlFromApps() {
      this.betaTest.iconImageUrl = this.iconImageUrlFromApps;
    },
    showAppCrawlingConfirmDialog(packageName) {
      this.$buefy.dialog.confirm({
        title: '앱 크롤링 요청',
        message: `등록된 앱 정보가 존재하지 않습니다.<br/><br/><b>${packageName}<br/>앱 정보 크롤링을 요청하시겠습니까?</b></br><br/><i>*크롤링 요청 후 앱 정보 등록까지 약 1분 정도 소요됩니다.</i>`,
        onConfirm: () => this.requestCrawling(packageName)
      })
    },
    requestCrawling(packageName) {
      request.post(`/api/apps/crawling/${packageName}`)
        .then(() => {
          this.$root.showToast('is-info', '앱 크롤링 요청이 등록되었습니다.<br/>약 1분 후에 앱 정보를 다시 조회해보세요.');
        }).catch((err) => {
          console.log(err);
          this.$root.showToast('is-danger', '앱 크롤링 요청 중 오류가 발생했습니다.<br/>개발 담당자에게 문의하세요.');
      });
    },
    initializeProgressText(checked) {
      const isInit = this.betaTest.progressText ? false : true;
      if (checked && isInit) {
        this.betaTest.progressText = {
          ready: '밑져야 본전! 재미있어 보인다면 참여해 보세요.',
          doing: '당신을 기다리고 있었어요! 이어서 참여해볼까요?',
          done: '굿! 훌륭해요! 마감 후 테스터 시상식이 열릴거에요.',
        };
      } else {
        delete this.betaTest.progressText;
      }
    },
    setMissionsByTestType() {
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
            actionType: 'internal_web',
            action: '',
            options: ['mandatory'],
          });
        case 'short':
        case 'simple':
        case 'normal':
          missions.push({
            order: missions.length + 1,
            type: 'install',
            title: '게임 설치 & 플레이',
            description: '[게임명] 게임을 설치하고 플레이하세요.',
            descriptionImageUrl: 'https://i.imgur.com/7ElrcO4.png',
            guide: '• 미션에 참여하면 테스트 대상 게임 보호를 위해 무단 배포 금지에 동의한 것으로 간주됩니다.',
            packageName: '',
            actionType: 'default',
            action: '',
            options: [
              'mandatory',
              'repeatable'
            ],
          });
          missions.push({
            order: missions.length + 1,
            type: 'play',
            title: '게임 플레이 인증하기',
            description: '[게임명] 게임을 플레이하고 인증해주세요.(30분 이상 플레이 권장)',
            descriptionImageUrl: 'https://i.imgur.com/GXpQhAj.png',
            guide: '',
            packageName: '',
            actionType: 'internal_web',
            action: '',
            options: [
              'mandatory'
            ],
          });
          missions.push({
            order: missions.length + 1,
            type: 'survey',
            title: '플레이 후 소감 작성',
            description: '[게임명]에 대한 구체적인 의견을 작성해주세요.',
            descriptionImageUrl: 'https://i.imgur.com/XfqTB0K.png',
            guide: '• "참여 완료" 상태에도 소감을 수정할 수 있습니다.\n• 솔직하고 구체적으로 의견을 적어주시는게 제일 중요합니다.',
            actionType: 'internal_web',
            action: '',
            options: [
              'mandatory',
              'repeatable',
              'recheckable'
            ],
          });
          break;

        default: // Do nothing
      }
      this.betaTest.missions = missions;
    },
    changeOrder(list){
      list.forEach((e,index)=>{
        e.order = index+1;
      });
    },
    openMissionForm(type, item){
          this.$buefy.modal.open({
            parent: this,
            props: {
              item:item,
              modalType: type,
              packageName: this.packageName
            },
            component: Mission,
            hasModalCard: true,
            trapFocus: true,
            canCancel: false,
            events: {
              upsertMission:(action, value) => {this.upsertMission(action, value)},
            },
      });
    },
    upsertMission(action, value){
      if(action === 'add'){
        this.$set(this.betaTest.missions, this.betaTest.missions.length, value);
      }else{
        this.$set(this.betaTest.missions, value.order-1, value);
      }
    },
    validate(){
      let isValid = true;
      for (let ref in this.$refs) {
        if(!this.$refs[ref]){
          continue;
        }
        if(ref === 'betaTest.tags'){
          isValid = this.$refs[ref].tags.length > 0;
          if(!isValid){
            this.$refs[ref].focus();
          }
        }else{
          if(this.$refs[ref].length > 0){
            for(let index in this.$refs[ref]){
              const arrayRefs = this.$refs[ref][index].$refs;
              for(let refTag in arrayRefs){
                if(arrayRefs[refTag]){
                  let checkValidity = arrayRefs[refTag].checkHtml5Validity();
                  if(!checkValidity){
                    console.log(arrayRefs[refTag]);
                    isValid = false;
                  }
                }
              }
            }
          }else{
            let checkValidity = this.$refs[ref].checkHtml5Validity();
            if(!checkValidity){
              console.log(ref,this.$refs[ref]);
              isValid = false;
            }
          }
        }
      }
      return isValid;
    },
    showBetaTester(missionId, betaTestId){
      this.$buefy.modal.open({
        parent: this,
        props: {
          betaTestId:betaTestId,
          missionId:missionId
        },
        component: Participants,
        hasModalCard: true,
        trapFocus: true,
        canCancel: false,
        events: {
        }})
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
