<template>
  <div>
    <h1 v-if="type==='add'" class="title">🎮 게임 테스트 등록하기 🎮</h1>
    <h1 v-if="type==='update'" class="title">🎮 게임 테스트 수정하기 🎮</h1>
    <div class="level">
      <div class="level-left">
      </div>
      <div class="level-right">
        <div class="level-item">
            <b-button v-if="type==='add'" type='is-primary' @click="registerBetaTest" size="is-medium">테스트 등록</b-button>
            <b-button v-if="type==='update'" type='is-primary' @click="updateBetaTest" size="is-medium">테스트 수정</b-button>
        </div>
      </div>
    </div>
    <b-steps
      v-model="activeStep"
      size="is-small"
      :has-navigation="false"
      :animated="false"
    >
      <div class="level">
        <div class="level-left"></div>
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
              :disabled="activeStep===3"
              @click.prevent="++activeStep">
              Next
            </b-button>
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
          <b-field label="설명" horizontal>
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
          <b-field label="목적" horizontal>
            <b-input v-model="betaTest.purpose"></b-input>
          </b-field>
          <b-field label="버그리포트 설문 URL" horizontal>
            <b-input v-model="betaTest.bugReport.url" placeholder="https://docs.google.com/forms/d/e/1FAIpQLSfCYFte9p8faIOve6YWYQkqDXdeJLggSnucAtnIYR0TsEF8fA/viewform?usp=pp_url&entry.1223559684={email}"></b-input>
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
            <b-input
              v-model="packageName"
              ref="packageName"
              placeholder="com.formakers.fomes"></b-input>
          </b-field>
          <b-field v-if="betaTest.subjectType === 'game-test'" label="앱 아이콘 가져오기" horizontal>
              <b-button type="is-primary" @click="getApp(packageName)">
                apps 정보에서 앱 아이콘 가져오기
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
                <b-field label="테스트 구성" horizontal custom-class="is-small">
                  <b-field>
                    <b-radio-button v-model="betaTest.type"
                                    v-for="type in options.testTypes"
                                    :key="type.key"
                                    :native-value="type.key"
                                    @input="setTestTemplateByTestType"
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
                  <div class="card">
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
                                      outlined>미션 이용자 관리</b-button>
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
        ]
      },
      result: '',
      isLoading: true,
      isTargetToFomesMembers: true,
      isCustomizedProgressText: false,
      packageName: '',
      testType: 'simple',
      type:'add',
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
    }
    this.setTestTemplateByTestType();

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
    },
    getBetaTest(){
      request.get('/api/beta-test/'+this.$route.query.id).then((result)=>{
        this.betaTest = Object.assign({}, result.data);
        this.betaTest.openDate = new Date(result.data.openDate);
        this.betaTest.closeDate = new Date(result.data.closeDate);
        this.isTargetToFomesMembers = this.betaTest.status === 'test';
        this.isCustomizedProgressText = this.betaTest.progressText ? true : false;
        console.log(result.data);
        console.log(this.isCustomizedProgressText);
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
            this.$router.push({path:'/test/list', query:{page:this.$route.query.p}});
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
      this.betaTest.rewards.list.push({
        order: rewardListLength > 0
          ? Number(this.betaTest.rewards.list[rewardListLength - 1].order) + 1 : 1,
        iconImageUrl: '',
        title: '',
        content: '',
        price:0
      });
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
        type: 'play',
        title: '',
        description: '',
        descriptionImageUrl: '',
        guide: '',
        actionType: 'default',
        action: '',
        packageName:'',
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
    getApp(packageName) {
      if (!packageName) {
        this.showToast('is-info', '게임 패키지명을 입력해주세요.')
        this.$refs.packageName.focus();
        return;
      }

      request.get(`/api/apps/${packageName}`)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            this.betaTest.iconImageUrl = res.data.iconUrl;
          } else {
            this.showErrorToast('앱아이콘 정보를 불러오는데 실패하였습니다.');
          }
        })
        .catch((err) => {
          this.result = err;
          this.showErrorToast();
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
    setTestTemplateByTestType() {
      // Set rewards
      const rewardList = [];
      switch (this.testType) {
        case 'short':
          rewardList.push({
            order: rewardList.length + 1,
            iconImageUrl: 'https://i.imgur.com/btZZHRp.png',
            title: '테스트 참여상',
            content: '게임 인앱 아이템',
            price:0
          });
          break;
        case 'simple':
        case 'application+simple':
          rewardList.push({
            order: rewardList.length + 1,
            iconImageUrl: 'https://i.imgur.com/ybuI732.png',
            title: '테스트 수석',
            content: '문화상품권 5천원 (1명 선정)',
            price:5000
          });
          rewardList.push({
            order: rewardList.length + 1,
            iconImageUrl: 'https://i.imgur.com/btZZHRp.png',
            title: '테스트 성실상',
            content: '문화상품권 1천원 (20명 선정)',
            price:1000
          });
          break;

        case 'normal':
        case 'application+normal':
          rewardList.push({
            order: rewardList.length + 1,
            iconImageUrl: 'https://i.imgur.com/ybuI732.png',
            title: '테스트 수석',
            content: '문화상품권 3만원 (1명 선정)',
            price:30000
          });
          rewardList.push({
            order: rewardList.length + 1,
            iconImageUrl: 'https://i.imgur.com/6RaZ7vI.png',
            title: '테스트 차석',
            content: '문화상품권 5천원 (5명 선정)',
            price:5000
          });
          rewardList.push({
            order: rewardList.length + 1,
            iconImageUrl: 'https://i.imgur.com/btZZHRp.png',
            title: '테스트 성실상',
            content: '문화상품권 1천원 (참여자 전원)',
            price:1000
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
        case 'short':
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
            options: [],
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
          isValid = this.$refs[ref].tags.length > 0
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
                    console.log(arrayRefs[refTag])
                    isValid = false;
                  }
                }
              }
            }
          }else{
            let checkValidity = this.$refs[ref].checkHtml5Validity();
            if(!checkValidity){
              console.log(ref,this.$refs[ref])
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
