<template>
  <section>
    <p class="title is-5">연령별 테스트 참여도</p>
    <div id="countBarChart"></div>
    <div id="ageStackChart"></div>
    <div id="userCountBarChart"></div>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </section>
</template>

<script>
import Apexchart from 'vue-apexcharts';

export default {
  name: 'ageChart',
  props:['items'],
  components:{
  },
  data() {
    return {
      isLoading:true,
      options:{
        ageRange:['0-9','10-14','15-19','20-24','25-29','30-34','35-39','40-44','45-49','50-54','55-59','60+']
      },
      participants:[],
      countBarChart: {
        name: 'countBarChart',
        series: [{
          name: '참여',
          data: []
        }, {
          name: '참여 완료',
          data: []
        }],
        chart: {
          type: 'bar',
          height:'315',
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
            colors: ['#000']
          },
          offsetY: -20,
          formatter: function (val) {
            return Number(val) > 0 ? val : '';
          }
        },
        title:{
          text:'연령별 참여/완료 횟수'
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
          categories: []
        },
      },
      userCountBarChart:{
        name: 'userCountBarChart',
        series: [{
          name: '참여',
          data: []
        }, {
          name: '참여 완료',
          data: []
        }],
        chart: {
          type: 'bar',
          height:'315',
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
            colors: ['#000']
          },
          offsetY: -20,
          formatter: function (val) {
            return Number(val) > 0 ? val : '';
          }
        },
        title:{
          text:'연령별 참여/완료 인원수 (Bar)'
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
          categories: []
        },
      },
      ageBarChart:{
        series: [{
          name: '참여',
          data: []
        }, {
          name: '참여 완료',
          data: []
        }],
        chart: {
          type: 'bar',
          height:'315',
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
            colors: ['#000']
          },
          offsetY: -20,
          formatter: function (val) {
            return Number(val) > 0 ? val : '';
          }
        },
        title:{
          text:'연령별 참여/완료 횟수'
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
          categories: []
        },
      },
      ageStackChart:{
        series:[],
        chart: {
          type: 'bar',
          height:'140',
          stacked: true,
          stackType: '100%',
          toolbar: {
            show: false
          },
          offsetX: 0,
          offsetY: 0,
          parentHeightOffset: 0
        },
        colors: [
          '#79ceb8', '#537bc4', '#ffdb00', '#13d8aa', '#314855', '#e95f5c',
          '#f9a3a4', '#ff2052', '#0d69af', '#e66000','#4d148c','#2facb2'
        ],
        grid: {
          yaxis: {
            lines: {
              show: false,
            }
          }
        },
        xaxis: {
          labels: {
            show: false
          },
          categories: ['참여', '참여완료'],
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          }
        },
        yaxis: {
          categories: [''],
          labels: {
            show: true
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
            horizontal: true,
          },
        },
        title:{
          text:'연령별 참여/완료 인원수 (Stack)'
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val
            }
          }
        },
        fill: {
          opacity: 1
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          offsetX: 0,
          offsetY: 0,
          itemMargin: {
            horizontal: 5,
            vertical: 0
          }
        },
      },
    };
  },
  mounted() {
  },
  watch : {
    'items':{
      handler(value){
        this.participants = value;
        this.setStatistics();
      },
      deep: true
    }
  },
  filters:{
  },
  methods: {
    setAgeStackChart(){
      //init
      this.options.ageRange.forEach(range=>{
        //attend : 참여한 사용자 아이디, complete : 참여완료한 사용자 아이디
        const data = {name:range, data:[0,0], attend:new Set([]),complete:new Set([])};
        this.ageStackChart.series.push(data)
      });
      //data[0] : attend, data[1]: complete
      const currentYear = new Date().getFullYear();
      this.participants.forEach(participant =>{
        const user = participant.user;
        if(user){
          if(user.birthday){
            const age = currentYear - user.birthday;
            const type = participant.status === 'attend' ? 0 : 1;
            let index = -1;
            if(age <= 9){
              index = 0;
            }else if(age >= 60){
              index = this.ageStackChart.xaxis.categories.length-1;
            }else{
              index = Math.floor(age/5)-1;
            }
            this.ageStackChart.series[index][participant.status].add(user.userId);
            this.ageStackChart.series[index].data[type] = this.ageStackChart.series[index][participant.status].size;
          }
        }
      });
      const ageStackChart = new ApexCharts(document.querySelector("#ageStackChart"), this.ageStackChart);
      ageStackChart.render();
    },
    setAgeBarChart(barChart, data){
      barChart.xaxis.categories = Object.assign([],this.options.ageRange);
      barChart.series[0].data = Array(barChart.xaxis.categories.length).fill(0);
      barChart.series[1].data = Array(barChart.xaxis.categories.length).fill(0);
      const currentYear = new Date().getFullYear();
      data.forEach(participant => {
        if (participant.user) {
          const user = participant.user;
          if (user.birthday) {
            const age = currentYear - user.birthday;
            const type = participant.status === 'attend' ? 0 : 1;
            if (age <= 9) {
              barChart.series[type].data[0] += 1;
            } else if (age >= 60) {
              barChart.series[type].data[barChart.xaxis.categories.length-1] += 1;
            } else {
              const index = Math.floor(age/5)-1;
              barChart.series[type].data[index] += 1;
            }
          }
        }
      });
      new ApexCharts(document.querySelector("#" + barChart.name), barChart).render();
    },
    setStatistics(){
      const userParticipations = this.participants.map(part => {
        return {
          user: {
            birthday: part.user.birthday,
            gender: part.user.gender,
            job: part.user.job,
            userId: part.user.userId
          },
          type: part.type,
          status: part.status
        };
      });

      function onlyUnique(value, index, self) {
        // return self.indexOf(value) === index;
        const _thing = JSON.stringify(value);
        return index === self.findIndex(obj => {
          return JSON.stringify(obj) === _thing;
        });
      }

      this.setAgeBarChart(this.userCountBarChart, userParticipations.filter(onlyUnique));
      this.setAgeBarChart(this.countBarChart, this.participants);
      this.setAgeStackChart();
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
.stats-card{
  height: 130px;
}
</style>
