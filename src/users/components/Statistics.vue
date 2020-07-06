<template>
  <div>
    <div class="notification is-white">
      <p class="title is-5">누적 가입자 - 총 {{users.length}} 명</p>
      <div id="signUpChart"></div>
      <b-loading :is-full-page="false" :active.sync="loading.signUp"></b-loading>
    </div>

    <div class="columns is-multiline">

      <div class="column is-half">
        <div class="notification is-white">
          <p class="title is-5">성별</p>
          <div id="genderChart"></div>
          <b-loading :is-full-page="false" :active.sync="loading.gender"></b-loading>
        </div>
      </div>
      <div class="column is-half">
        <div class="notification is-white">
          <p class="title is-5">직업</p>
          <div id="jobChart"></div>
          <b-loading :is-full-page="false" :active.sync="loading.job"></b-loading>
        </div>
      </div>
    </div>

    <div class="notification is-white">
      <p class="title is-5">연령</p>
      <div id="ageChart"></div>
      <b-loading :is-full-page="false" :active.sync="loading.age"></b-loading>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import Apexchart from 'vue-apexcharts';
import request from '../../common/utils/http';

export default {
  name: 'userStatistics',
  components:{
  },
  data() {
    return {
      users: [],
      loading:{
        gender:true,
        job:true,
        age:true,
        signUp:true,
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
      genderChart:{
        series: [0,0,0],
        chart: {
          type: 'pie',
          height: 370
        },
        labels: ['남','여','미정의'],
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " 명"
            }
          },
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
          },
          height: 360
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
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " 명"
            }
          },
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
        labels:[],
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          // opposite: true
        },
        tooltip: {
          x: {
            format: 'yyyy-MM-dd HH:mm'
          },
          y: {
            formatter: function(value,index){
              return value +' 명'
            }
          }
        },
      },
      ageChart:{
        series: [],
        chart: {
          type: 'bar',
          toolbar:{
            show:false
          }
        },
        plotOptions: {
          bar: {
            horizontal: false
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: [],
          title: {
            text: '연령'
          }
        },
        yaxis: {
          labels: {
            show: true,
            formatter: function(val, index) {
              return val.toFixed();
            }
          },
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " 명"
            }
          },
          x: {
            show: true,
            formatter: function(value){
              return '만 ' + value + '세';
            }
          }
        }
      }
    };
  },
  created() {
    request.get('/api/statistics/users').then((res)=>{
      this.users = res.data.users;
      this.setStatistics();
    }).catch(err=>{
      this.$root.showErrorToast('사용자 통계 정보를 조회하는데 실패하였습니다.', err);
    });
  },
  watch : {
  },
  filters:{
  },
  mounted() {
  },
  methods: {
    setGenderChart(){
      const totalUsers = this.users.length;
      //set gender chart
      const maleCount = this.users.filter((i)=>{ return i.gender === 'male'}).length;
      const femaleCount = this.users.filter((i)=>{ return i.gender === 'female'}).length;
      const undefinedCount = totalUsers - maleCount - femaleCount;
      this.genderChart.series = [maleCount, femaleCount, undefinedCount];
      const genderChart = new ApexCharts(document.querySelector("#genderChart"), this.genderChart);
      genderChart.render();
      this.loading.gender = false;
    },
    setJobChart(){
      //job length : 18
      const jobLength = Object.keys(this.options.job).length;
      this.jobChart.series[0].data = Array(jobLength).fill(0);
      this.jobChart.xaxis.categories = Array(jobLength).fill('');
      Object.keys(this.options.job).forEach(key =>{
        const job = this.options.job[key];
        this.jobChart.xaxis.categories[job.index] = job.name;
      });
      this.users.forEach(user => {
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
    },
    setSignUpChart(){
      const signUpStats = {};
      this.users.forEach(user => {
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
        this.signUpChart.labels.push(Number(signUpTime));
        accumulateUser += signUpStats[signUpTime];
        this.signUpChart.series[0].data.push(accumulateUser);
      });
      console.log(this.signUpChart);
      const signUpChart = new ApexCharts(document.querySelector("#signUpChart"), this.signUpChart);
      signUpChart.render();
      this.loading.signUp = false;
    },
    setAgeChart(){
      this.ageChart.series = [];
      this.ageChart.xaxis.categories = [];
      const currentYear = new Date().getFullYear();
      const ageMap = {}; //key: age, value: count
      this.users.forEach(user=>{
        if(user.birthday){
          const age = (currentYear - user.birthday);
          if(ageMap[age]){
            ageMap[age] += 1;
          }else{
            ageMap[age] = 1;
          }
        }
      });
      this.ageChart.series.push({name:'', data: Object.values(ageMap)});
      this.ageChart.xaxis.categories = Object.keys(ageMap);
      const ageChart = new ApexCharts(document.querySelector("#ageChart"), this.ageChart);
      ageChart.render();
      this.loading.age = false;
    },
    setStatistics(){
      this.setGenderChart();
      this.setJobChart();
      this.setSignUpChart();
      this.setAgeChart();
    },
  }
};
</script>

<style scoped>
.stats-card{
  height: 130px;
}
</style>
