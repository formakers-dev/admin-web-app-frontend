<template>
  <div>
    <h1 class="title">🎮 통계 🎮</h1>
    <section style="margin-bottom: 10px">
      <div class="columns is-multiline">
        <div class="column is-one-third">
          <div class="notification is-white">
            <BetaTestChart :items="allBetaTests"></BetaTestChart>
          </div>
        </div>
        <div class="column is-one-third">
          <div class="notification is-white">
            <PlanChart :items="allBetaTests"></PlanChart>
          </div>
        </div>
        <div class="column is-one-third">
          <div class="notification is-white">
            <GenderChart :items="participants"></GenderChart>
          </div>
        </div>
        <div class="column is-half">
          <div class="notification is-white">
            <AgeChart :items="participants"></AgeChart>
          </div>
        </div>
        <div class="column is-half">
          <div class="notification is-white">
            <AccumulatedParticipantsChart :items="participants"></AccumulatedParticipantsChart>
          </div>
        </div>
        <div class="column is-half">
          <div class="notification is-white">
            <AccumulatedRewardsPriceChart :items="awardRecords"></AccumulatedRewardsPriceChart>
          </div>
        </div>
<!--        <div class="column is-half">-->
<!--          <div class="notification is-white">-->
<!--            <p class="title is-5">직업</p>-->
<!--            <div id="jobChart"></div>-->
<!--            <b-loading :is-full-page="false" :active.sync="loading.job"></b-loading>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="column is-half">-->
<!--          <div class="notification is-white">-->
<!--            <p class="title is-5">누적 가입자 - 총 {{statistics.users.total | comma}} 명</p>-->
<!--            <div id="signUpChart"></div>-->
<!--            <b-loading :is-full-page="false" :active.sync="loading.signUp"></b-loading>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="column is-half">-->
<!--          <div class="notification is-white">-->
<!--            <p class="title is-5">테스트별 참여자</p>-->
<!--            <div id="participantsChart"></div>-->
<!--            <b-loading :is-full-page="false" :active.sync="loading.participants"></b-loading>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="column is-half">-->
<!--          <div class="notification is-white">-->
<!--            <p class="title is-5">누적 리워즈 금액 - 총 {{statistics.awardRecords.totalPrice | comma}} 원</p>-->
<!--            <div id="awardRecordsChart"></div>-->
<!--            <b-loading :is-full-page="false" :active.sync="loading.awardRecordsChart"></b-loading>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="column is-half">-->
<!--          <div class="notification is-white">-->
<!--            <p class="title is-5">테스트별 리워즈 금액</p>-->
<!--            <div id="awardRecordsChartByTest"></div>-->
<!--            <b-loading :is-full-page="false" :active.sync="loading.awardRecordsChartByTest"></b-loading>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </section>
  </div>
</template>

<script>
import moment from 'moment';
import request from '../../common/utils/http';
import Apexchart from 'vue-apexcharts';
import BetaTestChart from '../components/BetaTestChart';
import PlanChart from '../components/PlanChart';
import AgeChart from '../components/AgeChart';
import AccumulatedParticipantsChart from '../components/AccumulatedParticipantsChart';
import GenderChart from '../components/GenderChart';
import AccumulatedRewardsPriceChart from '../components/AccumulatedRewardsPriceChart';
export default {
  name: 'statistics',
  components:{
    BetaTestChart,
    PlanChart,
    AgeChart,
    AccumulatedParticipantsChart,
    GenderChart,
    AccumulatedRewardsPriceChart
  },
  data() {
    return {
      allBetaTests: [],
      participants:[],
      awardRecords:[],
      openedBetaTests: [],
      closedBetaTests: [],
      statistics:{
        betaTests:{
          total : '-',
          plan:{
            trial:'-',
            starter:'-',
            lite:'-',
            simple:'-',
            standard:'-'
          }
        },
        participants:{
          total:'-'
        },
        awardRecords:{
          totalPrice:'-'
        },
        users:{
          total:'-'
        }
      },
      loading:{
        totalBetaTests:true,
        plan:true,
        gender:true,
        job:true,
        age:true,
        signUp:true,
        participants: true,
        awardRecordsChart: true,
        awardRecordsChartByTest: true
      },
      options:{
        subjectTypes:{
          'game-test': '게임 테스트',
          'event' : '이벤트',
          'fomes-test' : '포메스 테스트'
        },
        job:{
          '1000':{name:'관리자',index:0},
          '2000':{name:'전문가',index:1},
          '2001':{name:'IT 종사자',index:2},
          '3000':{name:'사무 종사자',index:3},
          '4000':{name:'서비스 종사자',index:4},
          '5000':{name:'학생',index:5},
          '5003':{name:'초등학생',index:6},
          '5001':{name:'중고등학생',index:7},
          '5002':{name:'대학생',index:8},
          '6000':{name:'판매 종사자',index:9},
          '7000':{name:'농업/어업 숙련 종사자',index:10},
          '8000':{name:'기능원 및 관련 기능 종사자',index:11},
          '9000':{name:'장치/기계 조작 및 조립 종사자',index:12},
          '10000':{name:'단순노무 종사자',index:13},
          '11000':{name:'군인',index:14},
          '12000':{name:'기타',index:15},
          '12001':{name:'주부',index:16},
          '12002':{name:'무직',index:17},
        }
      },
      jobChart:{
        series: [{
          name: '',
          data: []
        }],
        chart: {
          type: 'bar',
          toolbar:{
            show:false
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              position: 'top',
            },
          },
        },
        dataLabels: {
          enabled: true,
          offsetX: -6,
          style: {
            fontSize: '12px',
            colors: ['#fff']
          }
        },
        xaxis: {
          categories: [],
        }
      },
      signUpChart:{
        chart:{
          type:'area',
        },
        series:[{
          name:'누적 가입자 수',
          data:[]
        }],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime',
          categories: []
        },
        yaxis: {
          opposite: true
        },
        tooltip: {
          x: {
            format: 'yyyy-MM-dd HH:mm'
          },
        },
      },
      awardRecordsChart:{
        chart:{
          type:'area',
        },
        series:[{
          name:'누적 리워즈 금액',
          data:[]
        }],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          type: 'datetime',
          categories: []
        },
        yaxis: {
          opposite: true
        },
        tooltip: {
          x: {
            format: 'yyyy-MM-dd HH:mm'
          },
        },
      },
      awardRecordsChartByTest:{
        series: [{
          name: '',
          data: []
        }],
        chart: {
          type: 'bar',
          toolbar:{
            show:false
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              position: 'top',
            },
          }
        },
        dataLabels: {
          enabled: true,
          offsetX: -6,
          style: {
            fontSize: '12px',
            colors: ['#fff']
          }
        },
        stroke: {
          show: true,
          width: 1,
          colors: ['#fff']
        },
        xaxis: {
          categories: [],
        },
      },
    };
  },
  created() {
    this.setStatistics();
  },
  watch : {
  },
  filters:{
    comma(val){
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
  methods: {
    convertDateTime(date){
      return moment(date).format('YYYY-MM-DD (ddd) HH:mm:ss');
    },
    getOpeningStatus(open, close){
      const current = new Date().getTime();
      const openDate = new Date(open).getTime();
      const closeDate = new Date(close).getTime();
      if(openDate <= current && closeDate >= current){
        return '오픈';
      }
      if(closeDate < current){
        return '종료';
      }
      return '대기';
    },
    convertedSubjectType(value){
      return this.options.subjectTypes[value] ? this.options.subjectTypes[value] : value;
    },
    setStatistics(){
      this.getAllBetaTests();
      this.getParticipants();
      this.getAwardRecords();
      // this.setUsers();
      // this.setAwardRecords();
    },
    setUsers(){
      request.get('/api/statistics/users').then((res)=>{
        console.log(res.data);
        const users = Object.assign([], res.data.users);
        //set total user
        const totalUsers = users.length;
        this.statistics.users.total = totalUsers;

        //set gender chart
        const maleCount = users.filter((i)=>{ return i.gender === 'male'}).length;
        const femaleCount = totalUsers - maleCount;
        this.genderChart.series = [ maleCount, femaleCount];
        const genderChart = new ApexCharts(document.querySelector("#genderChart"), this.genderChart);
        genderChart.render();
        this.loading.gender = false;

        //set job chart
        this.jobChart.series[0].data = Array(18).fill(0);
        this.jobChart.xaxis.categories = Array(18).fill('');
        Object.keys(this.options.job).forEach(key =>{
          const job = this.options.job[key];
          this.jobChart.xaxis.categories[job.index] = job.name;
        });
        users.forEach(user => {
          if(user.job){
            const code = String(user.job);
            if(this.options.job[code]){
              this.jobChart.series[0].data[this.options.job[code].index] += 1;
            }
          }
        });
        const jobChart = new ApexCharts(document.querySelector("#jobChart"), this.jobChart);
        jobChart.render();
        this.loading.job = false;

        //set user sign up chart
        const signUpStats = {};
        users.forEach(user => {
          if(user.signUpTime){
            const signUpTime = new Date(user.signUpTime).getTime();
            if(signUpStats[signUpTime]){
              signUpStats[signUpTime] += 1;
            }else{
              signUpStats[signUpTime] = 1;
            }
          }
        });
        this.signUpChart.series[0].data = [];
        this.signUpChart.xaxis.categories = [];
        let accumulateUser = 0;
        Object.keys(signUpStats).forEach(signUpTime =>{
          this.signUpChart.xaxis.categories.push(new Date(Number(signUpTime)).toISOString());
          accumulateUser += signUpStats[signUpTime];
          this.signUpChart.series[0].data.push(accumulateUser);
        });

        const signUpChart = new ApexCharts(document.querySelector("#signUpChart"), this.signUpChart);
        signUpChart.render();
        this.loading.signUp = false;
      }).catch((err)=>{
        this.$root.showErrorToast('사용자 정보 조회하는데 실패하였습니다.', err);
      })
    },
    getAllBetaTests(){
      request.get('/api/statistics/beta-tests')
        .then((res) => {
          this.allBetaTests = res.data.betaTests;
        })
        .catch((err) => {
          this.$root.showErrorToast('테스트 목록을 조회하는데 실패하였습니다.', err);
        });
    },
    getParticipants(){
      request.get('/api/statistics/participants?type=beta-test').then(res=>{
        this.participants = res.data.participants;
      }).catch(err=>{
        console.log(err);
        this.$root.showErrorToast('참여자 정보를를 조회하는데 실패하였습니다.', err);
      })
    },
    getAwardRecords(){
      request.get('/api/statistics/award-records').then(res=>{
        console.log(res.data);
       this.awardRecords = res.data.betaTests;
        //테스트별 누적 리워즈 금액
        this.awardRecordsChartByTest.xaxis.categories = [];
        this.awardRecordsChartByTest.series[0].data = [];
        const awardRecordsChartByTestData = res.data.betaTests.length >= 10 ? res.data.betaTests.slice(res.data.betaTests.length-10,res.data.betaTests.length) : res.data.betaTests;
        awardRecordsChartByTestData.forEach(betaTest => {
          this.awardRecordsChartByTest.xaxis.categories.push(betaTest.title);
          let point = 0;
          betaTest.awardRecords.forEach(awardRecord => {
            if(awardRecord.reward && awardRecord.reward.price){
              point += awardRecord.reward.price;
            }
          })
          this.awardRecordsChartByTest.series[0].data.push(point);
        });
        const awardRecordsChartByTest = new ApexCharts(document.querySelector("#awardRecordsChartByTest"), this.awardRecordsChartByTest);
        awardRecordsChartByTest.render();
        this.loading.awardRecordsChartByTest = false;

      }).catch(err=>{
        this.$root.showErrorToast('수상 금액정보를 조회하는데 실패하였습니다.', err);
      })
    },
  }
};
</script>

<style scoped>
.stats-card{
  height: 130px;
}
</style>
