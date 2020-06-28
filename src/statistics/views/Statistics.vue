<template>
  <div>
    <h1 class="title">🎮 테스트 상세 통계 🎮</h1>
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
        <div class="column is-half">
          <div class="notification is-white">
            <RewardsPriceChart :items="awardRecordsByCondition"></RewardsPriceChart>
          </div>
        </div>
        <div class="column is-half">
          <div class="notification is-white">
            <JobChart :items="participants"></JobChart>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import moment from 'moment';
import request from '../../common/utils/http';
import BetaTestChart from '../components/BetaTestChart';
import PlanChart from '../components/PlanChart';
import AgeChart from '../components/AgeChart';
import AccumulatedParticipantsChart from '../components/AccumulatedParticipantsChart';
import GenderChart from '../components/GenderChart';
import AccumulatedRewardsPriceChart from '../components/AccumulatedRewardsPriceChart';
import RewardsPriceChart from '../components/RewardsPriceChart';
import JobChart from '../components/JobChart';
export default {
  name: 'statistics',
  components:{
    BetaTestChart,
    PlanChart,
    AgeChart,
    AccumulatedParticipantsChart,
    GenderChart,
    AccumulatedRewardsPriceChart,
    RewardsPriceChart,
    JobChart
  },
  data() {
    return {
      allBetaTests: [],
      participants:[],
      awardRecords:[],
      awardRecordsByCondition:[],
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
    };
  },
  created() {
    this.setStatistics();
  },
  watch : {
  },
  filters:{
  },
  methods: {
    setStatistics(){
      this.getAllBetaTests();
      this.getParticipants();
      this.getAwardRecords();
      this.getAwardRecords({limit:10, sort:'desc'});
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
    getAwardRecords(condition){
      let query = {};
      if(condition){
        query = Object.assign({}, condition);
      }
      request.get('/api/statistics/award-records', {params:query}).then(res=>{
        if(condition){
          this.awardRecordsByCondition = res.data.betaTests;
        }else{
          this.awardRecords = res.data.betaTests;
        }
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
