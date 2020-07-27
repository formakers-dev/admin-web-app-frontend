<template>
  <div>
    <div class="head">
      <div class="contents">
        <img v-if="betaTest.iconImageUrl" style="width: 70px" :src="betaTest.iconImageUrl"/>
        <div>
          <h1 class="title" style="margin-top: 10px; display: inline">
            {{ this.betaTest.title }}
            <div class="has-text-primary" style="display: inline">상세 정보</div>
          </h1>
          <b-tooltip v-if="isTargetToFomesMembers"
                     position="is-right"
                     sizr="is-small"
                     style="width: inherit;"
                     label="해당 테스트가 포메스 관리자들에게만 보여지는 모드입니다."
                     multilined>
            <b-tag class="has-text-weight-bold" type="is-primary"
                   style="margin-left: 10px;"
                   v-model="isTargetToFomesMembers">테스트모드
            </b-tag>
          </b-tooltip>
        </div>
      </div>
    </div>
    <div class="contents">
      <section style="margin-bottom: 10px">
        <div class="tile is-ancestor">
          <div class="tile is-parent is-4">
            <div class="tile is-child notification is-white stats-card">
              <p class="title is-5">미션 & 베타테스트 참여/참여완료</p>
              <div id="missionAndBetaTestChart"></div>
              <b-loading :is-full-page="false"
                         :active.sync="loading.missionAndBetaTestChart"></b-loading>
            </div>
          </div>
          <div class="tile is-parent is-vertical is-3">
            <div class="tile is-child notification is-primary">
              <p class="title is-5">베타테스트 참여완료율</p>
              <div class="has-text-right">
                <div class="title is-4">{{statistics.completeRatio}} %</div>
                참여완료 {{statistics.completedCount}} 명 / 참여시도 {{statistics.attendCount}} 명
              </div>
              <b-loading :is-full-page="false"
                         :active.sync="loading.missionAndBetaTestChart"></b-loading>
            </div>
            <div class="tile is-child notification is-warning">
              <p v-if='openingStatus ==="-"' class="title is-5">-</p>
              <p v-if="openingStatus === '대기' || openingStatus === '오픈'" class="title is-5">리워즈 총 예상
                금액</p>
              <p v-if='openingStatus ==="종료"' class="title is-5">리워즈 총 지급 금액</p>
              <p class="title is-4 has-text-right">&#8361; {{statistics.rewards.price | comma}}</p>
              <b-loading :is-full-page="false" :active.sync="loading.rewards"></b-loading>
            </div>
          </div>
        </div>
      </section>
      <div class="level">
        <div class="level-left">
        </div>
        <div class="level-right">
          <div class="level-item">
            <b-button type='is-primary' @click="goRegister">테스트 수정하기</b-button>
          </div>
        </div>
      </div>
      <div class="box">
        <h4 class="title is-4">테스트 기본 정보</h4>
        <b-field label="테스트 아이디" horizontal style="background: #f5f5f5; padding: 10px">
          {{betaTest._id}}
        </b-field>
        <b-field label="오픈 시각" horizontal>
          <b-datetimepicker v-model="betaTest.openDate"
                            placeholder="오픈 시각을 선택해주세요."
                            icon="calendar-today" disabled>
          </b-datetimepicker>
        </b-field>
        <b-field label="종료 시각" horizontal>
          <b-datetimepicker v-model="betaTest.closeDate"
                            placeholder="종료 시각을 선택해주세요."
                            icon="calendar-today" disabled>
          </b-datetimepicker>
        </b-field>
        <b-field label="유형" horizontal>
          <b-field>
            <b-radio-button v-for="subjectType in options.subjectTypes"
                            :key="subjectType.key"
                            v-model="betaTest.subjectType"
                            :native-value="subjectType.key"
                            @input="setSubjectType"
                            type="is-primary" disabled>
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
                            type="is-primary" disabled>
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
                   required disabled></b-input>
        </b-field>
        <b-field label="게임 소개" horizontal>
          <b-input type="textarea" v-model="betaTest.description" disabled></b-input>
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
            :required="betaTest.tags.length === 0" disabled>
          </b-taginput>
        </b-field>
        <b-field horizontal>
          <template slot="label">
            <span class="has-text-danger">*</span> 미션 요약 설명
          </template>
          <b-input v-model="betaTest.missionsSummary"
                   placeholder="사전 신청  /  30분 플레이  /  설문 참여 (객20/주5)"
                   required disabled></b-input>
        </b-field>
        <b-field label="테스트 목적" horizontal>
          <b-input v-model="betaTest.purpose" disabled></b-input>
        </b-field>
        <b-field label="버그리포트 설문 URL" horizontal>
          <b-input v-if="betaTest.bugReport" v-model="betaTest.bugReport.url"
                   placeholder="https://docs.google.com/forms/d/e/1FAIpQLSfCYFte9p8faIOve6YWYQkqDXdeJLggSnucAtnIYR0TsEF8fA/viewform?usp=pp_url&entry.1223559684={email}"
                   disabled></b-input>
          <b-input v-else
                   placeholder="https://docs.google.com/forms/d/e/1FAIpQLSfCYFte9p8faIOve6YWYQkqDXdeJLggSnucAtnIYR0TsEF8fA/viewform?usp=pp_url&entry.1223559684={email}"
                   disabled></b-input>
        </b-field>
        <b-field label="테스트 진행 상태별 문구" horizontal>
          <b-checkbox v-model="isCustomizedProgressText" disabled>
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
                     required disabled></b-input>
          </b-field>
          <b-field horizontal>
            <template slot="label">
              <span class="has-text-danger">*</span> 참여 중
            </template>
            <b-input v-model="betaTest.progressText.doing"
                     ref="betaTest.progressText.doing"
                     placeholder="당신을 기다리고 있었어요! 이어서 참여해볼까요?"
                     required disabled></b-input>
          </b-field>
          <b-field horizontal>
            <template slot="label">
              <span class="has-text-danger">*</span> 참여 완료
            </template>
            <b-input v-model="betaTest.progressText.done"
                     ref="betaTest.progressText.done"
                     placeholder="굿! 훌륭해요! 마감 후 테스터 시상식이 열릴거에요."
                     required disabled></b-input>
          </b-field>
        </div>
      </div>
      <div class="box">
        <h4 class="title is-4">의뢰 게임 정보</h4>
        <b-field horizontal>
          <template slot="label">
            <span class="has-text-danger">*</span> 앱 아이콘
          </template>
          <b-input v-model="betaTest.iconImageUrl"
                   ref="betaTest.iconImageUrl"
                   placeholder="https://i.imgur.com/NBfLCwq.png"
                   required disabled></b-input>
        </b-field>
        <b-field v-if="betaTest.iconImageUrl" label="앱 아이콘 Preview" horizontal>
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
                   required disabled></b-input>
        </b-field>
        <b-field v-if="betaTest.coverImageUrl" label="대표 이미지 Preview" horizontal>
          <img style="width: 500px" :src="betaTest.coverImageUrl"/>
        </b-field>
      </div>
      <div class="box">
        <h4 class="title is-4">리워드</h4>
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
                        :disabled="true"
                        class="column is-one-third rewards"/>
          </draggable>
        </section>
      </div>
      <div class="box">
        <h4 class="title is-4">미션</h4>
        <section>
          <div class="column"
               v-for="(mission, index) in betaTest.missions"
               :key="index"
          >
            <div class="card" style="cursor: pointer">
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <div style="position: absolute; right:20px">
                      <b-button v-if="type==='update'"
                                class="button"
                                type="is-info"
                                style="margin-right: 5px"
                                size="is-small"
                                @click.stop="showBetaTester(mission._id, mission.betaTestId)"
                                outlined>미션 완료자 추가/삭제
                      </b-button>
                    </div>
                  </div>
                </div>
                <div class="content" style="margin-top: 40px">
                  <span class="order-wrapper">{{mission.order}}</span>
                  <Mission :item="mission" :type="'readonly'" :packageName="packageName"></Mission>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import request from '../../common/utils/http';
import RewardItem from '../components/RewardItem.vue';
import Mission from '../components/Mission.vue';
import Draggable from 'vuedraggable';
import Participants  from '../components/Participants';
import Apexchart from 'vue-apexcharts';
import moment from 'moment';

export default {
  name: 'TestDetail',
  components: {
    RewardItem,
    Draggable,
    Mission
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
      subjectTypes:{
        'game-test': '게임 테스트',
        'event' : '이벤트',
        'fomes-test' : '포메스 테스트'
      },
      loading:{
        missionAndBetaTestChart:true,
        rewards:true,
      },
      betaTestCompleteRatioChart:{
        series: [0],
        chart: {
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: '50%',
            }
          },
        },
        labels: ['Cricket'],
      },
      missionAndBetaTestChart:{
        series: [],
        chart: {
          type: 'bar',
          toolbar:{
            show:false
          },
          height:130,
          offsetY: 0,
          parentHeightOffset: 0
        },
        xaxis: {
          categories: [''],
        },
        grid: {
          yaxis: {
            lines: {
              show: false,
            }
          }
        },
        yaxis: {
          categories: [''],
          labels: {
            show: false
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '70%',
            dataLabels: {
              position: 'top',
            },
          },
        },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: '12px',
            colors: ['#000']
          },
          offsetY: -20,
          formatter: function (val) {
            return Number(val) > 0 ? String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0;
          }
        },
        fill: {
          opacity: 1
        },
        legend: {
          position: 'right',
          horizontalAlign: 'center',
          offsetX: -20,
          offsetY: 0,
          itemMargin: {
            horizontal: 0,
            vertical: 0
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val;
            }
          }
        },
      },
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
      },
      rewardType: 9000,
      result: '',
      isTargetToFomesMembers: false,
      isCustomizedProgressText: false,
      packageName: '',
      testType: 'simple',
      type:'add',
      openingStatus:'-',
      betaTest: {
        _id:'',
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
      statistics:{
        mission:{
        },
        'beta-test':{
          attend:0,
          complete:0
        },
        rewards:{
          price:0,
        },
        completedCount: 0,
        attendCount: 0,
        completeRatio:0
      }
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
    this.type='update';
    const betaTestPromise = this.getBetaTest();
    const participantsPromise = this.getParticipants();
    Promise.all([betaTestPromise, participantsPromise]).then((values)=>{
      this.setMissionAndBetaTestChart();
    });
  },
  mounted() {
  },
  filters:{
    comma(val){
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
  methods: {
    getOpeningStatus(open, close){
      const current = new Date().getTime();
      const openDate = new Date(open).getTime();
      const closeDate = new Date(close).getTime();
      if (openDate <= current && closeDate >= current) {
        return "오픈";
      }
      if (closeDate < current) {
        return "종료";
      }
      return "대기";
    },
    getBetaTest(){
      return request.get('/api/beta-test/'+this.$route.query.id).then((result)=>{
        this.betaTest = Object.assign({}, result.data);
        this.betaTest.openDate = new Date(result.data.openDate);
        this.betaTest.closeDate = new Date(result.data.closeDate);
        this.isTargetToFomesMembers = this.betaTest.status === 'test';
        this.isCustomizedProgressText = this.betaTest.progressText ? true : false;
        this.openingStatus = this.getOpeningStatus(result.data.openDate, result.data.closeDate);
        console.log(result.data);

        if (this.openingStatus === '종료') {
          this.getAwardRecords();
        } else {
          let totalPrice = 0;
          this.betaTest.rewards.list.forEach(rewards => {
            if (rewards.count && rewards.price){
              totalPrice += (rewards.count*rewards.price);
            }
          });
          this.statistics.rewards.price = totalPrice;
          this.loading.rewards = false;
        }

        return Promise.resolve();
      }).catch(err => {
        this.$root.showErrorToast('테스트 항목 조회에 실패하였습니다.',err);
        return Promise.reject(err);
      });
    },
    getAwardRecords(){
      const params = {
        filters: 'totalPrice',
        betaTestId: this.$route.query.id
      };
      request.get('/api/statistics/award-records',{params: params}).then(result=>{
        this.statistics.rewards.price = result.data.totalAwardRecordPrice;
        this.loading.rewards = false;
      }).catch(err => {
        this.$root.showErrorToast('수상 금액 정보 조회에 실패하였습니다.',err);
      });
    },
    getParticipants(){
      const params ={
        path: 'overview',
        betaTestId: this.$route.query.id
      };
      return request.get('/api/statistics/participants',{params:params}).then(result=>{
        const participants = result.data.participants;
        participants.forEach(participant =>{
          if(participant.type === 'mission'){
            if(this.statistics.mission[participants.missionId]){
              this.statistics.mission[participants.missionId][participants.status] += 1;
            }else{
              const counts = {complete:0, attend:0};
              counts[participant.status] = 1;
              this.statistics.mission[participants.missionId] = Object.assign({}, counts);
            }
          }else{
            this.statistics['beta-test'][participant.status] += 1;
          }
        });
        return Promise.resolve();
      }).catch(err=>{
        this.$root.showErrorToast('참여자 정보 조회에 실패하였습니다.',err);
        return Promise.reject(err);
      })
    },
    setSubjectType(selected) {
      this.betaTest.subjectType = selected;
      if (selected !== 'game-test') {
        delete this.betaTest.plan;
      }
    },
    changeOrder(list){
      list.forEach((e,index)=>{
        e.order = index+1;
      });
    },
    goRegister(){
      this.$router.replace({path:'/test/register', query:this.$route.query});
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
    },
    setMissionAndBetaTestChart(){
      this.missionAndBetaTestChart.series = [];
      this.missionAndBetaTestChart.series.push(Object.assign({},{name:'베타테스트 참여', data:[this.statistics['beta-test'].attend]}));
      const missions = this.betaTest.missions;
      missions.forEach(mission=>{
        let count = 0;
        if(this.statistics.mission[mission._id]){
          count = this.statistics.mission[mission._id].complete;
        }
        this.missionAndBetaTestChart.series.push(Object.assign({},{name: mission.title, data:[count]}));
      });
      this.missionAndBetaTestChart.series.push(Object.assign({},{name:'베타테스트 참여완료', data:[this.statistics['beta-test'].complete]}));
      const missionAndBetaTestChart = new ApexCharts(document.querySelector("#missionAndBetaTestChart"), this.missionAndBetaTestChart);
      missionAndBetaTestChart.render();
      this.loading.missionAndBetaTestChart = false;

      const betaTestStatistic = this.statistics['beta-test'];
      console.log(this.statistics);
      const ratio = ((betaTestStatistic.complete / betaTestStatistic.attend)*100);
      this.statistics.completedCount = betaTestStatistic.complete;
      this.statistics.attendCount = betaTestStatistic.attend;
      this.statistics.completeRatio = ratio > 0 ? ratio.toFixed() : 0;
    },
  },
};
</script>

<style scoped>
  .container {
    margin: 0 auto !important;
    width: 100% !important;
  }
  .head {
    background: white;
    padding: 1.5rem;
    margin-bottom: 1rem;
    margin-bottom: 1.5rem;
  }
  .contents {
    margin: 0 auto !important;
    width: 85% !important;
  }
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
  .stats-card{
    /*min-height: 150px;*/
  }
</style>
