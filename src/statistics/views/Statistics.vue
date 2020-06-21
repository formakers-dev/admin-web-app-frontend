<template>
  <div>
    <h1 class="title">🎮 통계 🎮</h1>
    <section style="margin-bottom: 10px">
      <div class="columns is-multiline">
        <div class="column is-one-third">
          <div class="notification is-white">
            <p class="title is-5">베타 테스트</p>
            <div id="betaTestChart"></div>
            <b-loading :is-full-page="false" :active.sync="loading.totalBetaTests"></b-loading>
          </div>
        </div>
        <div class="column is-one-third">
          <div class="notification is-white">
            <p class="title is-5">플랜</p>
            <div id="planChart"></div>
            <b-loading :is-full-page="false" :active.sync="loading.plan"></b-loading>
          </div>
        </div>
        <div class="column is-one-third">
          <div class="notification is-white">
            <p class="title is-5">성별</p>
            <div id="genderChart"></div>
            <b-loading :is-full-page="false" :active.sync="loading.gender"></b-loading>
          </div>
        </div>
        <div class="column is-half">
          <div class="notification is-white">
            <p class="title is-5">연령</p>
            <div id="ageChart"></div>
            <b-loading :is-full-page="false" :active.sync="loading.age"></b-loading>
          </div>
        </div>
        <div class="column is-half">
          <div class="notification is-white">
            <p class="title is-5">직업</p>
            <div id="jobChart"></div>
            <b-loading :is-full-page="false" :active.sync="loading.job"></b-loading>
          </div>
        </div>
        <div class="column is-half">
          <div class="notification is-white">
            <p class="title is-5">누적 가입자 - 총 {{statistics.users.total | comma}} 명</p>
            <div id="signUpChart"></div>
            <b-loading :is-full-page="false" :active.sync="loading.signUp"></b-loading>
          </div>
        </div>
        <div class="column is-half">
          <div class="notification is-white">
            <p class="title is-5">테스트별 참여자</p>
            <div id="participantsChart"></div>
            <b-loading :is-full-page="false" :active.sync="loading.participantsChart"></b-loading>
          </div>
        </div>
        <div class="column is-half">
          <div class="notification is-white">
            <p class="title is-5">누적 리워즈 금액 - 총 {{statistics.awardRecords.totalPrice | comma}} 원</p>
            <div id="awardRecordsChart"></div>
            <b-loading :is-full-page="false" :active.sync="loading.awardRecordsChart"></b-loading>
          </div>
        </div>
        <div class="column is-half">
          <div class="notification is-white">
            <p class="title is-5">테스트별 리워즈 금액</p>
            <div id="awardRecordsChartByTest"></div>
            <b-loading :is-full-page="false" :active.sync="loading.awardRecordsChartByTest"></b-loading>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import moment from 'moment';
import request from '../../common/utils/http';
import Apexchart from 'vue-apexcharts';

export default {
  name: 'statistics',
  components:{
  },
  data() {
    return {
      allBetaTests: [],
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
      ageChart:{
        series: [{
          name: '남',
          data: []
        }, {
          name: '여',
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
            colors: ['#fff']
          }
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        fill: {
          opacity: 1
        },
        xaxis: {
          // categories: ['60+','55-59','50-54','45-49','40-44','35-39','30-34','25-29','20-24','15-19','10-14','0-9'],
          categories: ['0-9','10-14','15-19','20-24','25-29','30-34','35-39','40-44','45-49','50-54','55-59','60+'],
        },
      },
      genderChart:{
        series: [],
        chart: {
          type: 'pie',
          height: 300
        },
        labels: ['남', '여'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
      betaTestChart:{
        chart: {
          type: 'donut',
          height: 300
        },
        series:[],
        labels:['게임 테스트','이벤트','포메스 테스트','미정의'],
        plotOptions:{
          pie:{
            donut:{
              labels:{
                show:true,
                total:{
                  show:true,
                  showAlways:true,
                  formatter: function (w) {
                    return w.globals.seriesTotals.reduce((a, b) => {
                      return a + b
                    }, 0)
                  }
                }
              }
            }
          }
        },
      },
      planChart:{
        chart: {
          type: 'donut',
          height: 300
        },
        labels:['트라이얼','스타터','라이트','심플','스탠다드'],
        yaxis: {
          labels: {
            show: false
          }
        },
        plotOptions:{
          pie:{
            donut:{
              labels:{
                show:true,
                total:{
                  show:true,
                  showAlways:true,
                  formatter: function (w) {
                    return w.globals.seriesTotals.reduce((a, b) => {
                      return a + b
                    }, 0)
                  }
                }
              }
            }
          }
        },
        series:[{data:[]}]
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
      participantsChart:{
        series: [{
          name: '베타 테스트 참여',
          data: []
        }, {
          name: '베타 테스트 완료',
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
            fontSize: '10px',
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
      this.setBetaTests();
      this.setParticipants();
      this.setUsers();
      this.setAwardRecords();
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

        //set age chart
        this.ageChart.series[0].data = Array(this.ageChart.xaxis.categories.length).fill(0);
        this.ageChart.series[1].data = Array(this.ageChart.xaxis.categories.length).fill(0);
        const currentYear = new Date().getFullYear();
        users.forEach(user => {
          if(user.birthday && user.gender){
            const age = currentYear - user.birthday;
            const genderIndex = user.gender === 'male' ? 0 : 1;
            if(age <= 9){
              this.ageChart.series[genderIndex].data[0] += 1;
            }else if(age >= 60){
              this.ageChart.series[genderIndex].data[this.ageChart.xaxis.categories.length-1] += 1;
            }else{
              const index = Math.floor(age/5)-1;
              this.ageChart.series[genderIndex].data[index] += 1;
            }
          }
        });
        const ageChart = new ApexCharts(document.querySelector("#ageChart"), this.ageChart);
        ageChart.render();
        this.loading.age = false;

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
    setBetaTests(){
      request.get('/api/statistics/beta-tests')
        .then((res) => {
          this.allBetaTests = res.data.betaTests;
          this.statistics.betaTests.total = res.data.betaTests.length;
          const subjectTypeStats = {
            'game-test':0,
            'event':0,
            'fomes-test':0,
            'undefinded':0,
          }
          this.allBetaTests.forEach(item=>{
            if(item.plan){
              this.statistics.betaTests.plan[item.plan] += 1
            }
            if(item.subjectType){
              subjectTypeStats[item.subjectType] += 1
            }else{
              subjectTypeStats['undefinded'] += 1
            }
          });
          this.betaTestChart.series = [];
          Object.keys(subjectTypeStats).forEach((i)=>{
            this.betaTestChart.series.push(subjectTypeStats[i])
          })
          const betaTestChart = new ApexCharts(document.querySelector("#betaTestChart"), this.betaTestChart);
          betaTestChart.render();
          this.loading.totalBetaTests = false;

          const planStats = {
            trial:0,
            starter:0,
            lite:0,
            simple:0,
            standard:0,
          };
          this.allBetaTests.forEach(item=>{
            if(item.plan){
              planStats[item.plan] += 1;
            }
          });
          this.planChart.series = [];
          Object.keys(planStats).forEach((i)=>{
            this.planChart.series.push(planStats[i]);
          });
          const planChart = new ApexCharts(document.querySelector("#planChart"), this.planChart);
          planChart.render();
          this.loading.plan = false;
        })
        .catch((err) => {
          this.$root.showErrorToast('테스트 목록을 조회하는데 실패하였습니다.', err);
        });
    },
    setParticipants(){
      request.get('/api/statistics/participants').then(res=>{
        const data = res.data.betaTests;
        this.participantsChart.xaxis.categories = [];
        this.participantsChart.series[0].data = [];
        this.participantsChart.series[1].data = [];
        data.forEach(i =>{
          this.participantsChart.xaxis.categories.push(i.title);
          let attendCount = 0;
          let completeCount = 0;
          i.participants.forEach(participant =>{
            if(participant.type === 'beta-test'){
              if(participant.status === 'attend'){
                attendCount += 1;
              }else if(participant.status === 'complete'){
                completeCount += 1;
              }
            }
          });
          this.participantsChart.series[0].data.push(attendCount);
          this.participantsChart.series[1].data.push(completeCount);
        });
        const participantsChart = new ApexCharts(document.querySelector("#participantsChart"), this.participantsChart);
        participantsChart.render();
        this.loading.participants = false;
      }).catch(err=>{
        console.log(err);
        this.$root.showErrorToast('참여자 정보를를 조회하는데 실패하였습니다.', err);
      })
    },
    setAwardRecords(){
      request.get('/api/statistics/award-records').then(res=>{
        //누적 참여 완료자 리워즈 통계
        const stackedRewardsStats = {};
        this.statistics.awardRecords.totalPrice = 0;
        res.data.betaTests.forEach(betaTest => {
          const closeTimestamp = new Date(betaTest.closeDate).getTime();
          betaTest.awardRecords.forEach(awardRecord => {
            if(awardRecord.reward && awardRecord.reward.price){
              if(stackedRewardsStats[closeTimestamp]){
                stackedRewardsStats[closeTimestamp] += awardRecord.reward.price;
              }else{
                stackedRewardsStats[closeTimestamp] = awardRecord.reward.price;
              }
              this.statistics.awardRecords.totalPrice += awardRecord.reward.price;
            }
          })
        });
        this.awardRecordsChart.series[0].data = [];
        this.awardRecordsChart.xaxis.categories = [];
        let accumulateRewardPrice = 0;
        Object.keys(stackedRewardsStats).forEach(timestamp =>{
          this.awardRecordsChart.xaxis.categories.push(new Date(Number(timestamp)).toISOString());
          accumulateRewardPrice += stackedRewardsStats[timestamp];
          this.awardRecordsChart.series[0].data.push(accumulateRewardPrice);
        });

        const awardRecordsChart = new ApexCharts(document.querySelector("#awardRecordsChart"), this.awardRecordsChart);
        awardRecordsChart.render();
        this.loading.awardRecordsChart = false;

        //테스트별 누적 리워즈 금액
        this.awardRecordsChartByTest.xaxis.categories = [];
        this.awardRecordsChartByTest.series[0].data = [];
        const awardRecordsChartByTestData = res.data.betaTests.length >= 10 ? res.data.betaTests.slice(0,10) : res.data.betaTests;
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
    }
  },
};
</script>

<style scoped>
.stats-card{
  height: 130px;
}
</style>
