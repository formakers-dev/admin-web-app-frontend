<template>
  <section>
    <p class="title is-5">연령별 테스트 참여도</p>
    <div id="ageStackChart"></div>
    <div id="ageBarChart"></div>
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
            colors: ['#fff']
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
        colors: ['#79ceb8', '#537bc4', '#ffdb00', '#13d8aa', '#314855', '#e95f5c', '#f9a3a4', '#ff2052',
          '#0d69af', '#e66000','#4d148c','#2facb2'
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
          text:'연령별 참여/완료 인원수'
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
        const data = {name:range, data:[], attend:new Set([]),complete:new Set([])};
        this.ageStackChart.series.push(data)
      });
      //data[0] : attend, data[1]: complete
      const currentYear = new Date().getFullYear();
      this.participants.forEach(participant =>{
        if(participant.user.length > 0){
          const user = participant.user[0];
          if(user.birthday){
            const age = currentYear - user.birthday;
            const type = participant.status === 'attend' ? 0 : 1;
            let index = -1;
            if(age <= 9){
              index = 0;
            }else if(age >= 60){
              index = this.ageBarChart.xaxis.categories.length-1;
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
    setAgeBarChart(){
      this.ageBarChart.xaxis.categories = Object.assign([],this.options.ageRange);
      this.ageBarChart.series[0].data = Array(this.ageBarChart.xaxis.categories.length).fill(0);
      this.ageBarChart.series[1].data = Array(this.ageBarChart.xaxis.categories.length).fill(0);
      const currentYear = new Date().getFullYear();
      this.participants.forEach(participant => {
        if(participant.user.length > 0){
          const user = participant.user[0];
          if(user.birthday){
            const age = currentYear - user.birthday;
            const type = participant.status === 'attend' ? 0 : 1;
            if(age <= 9){
              this.ageBarChart.series[type].data[0] += 1;
            }else if(age >= 60){
              this.ageBarChart.series[type].data[this.ageBarChart.xaxis.categories.length-1] += 1;
            }else{
              const index = Math.floor(age/5)-1;
              this.ageBarChart.series[type].data[index] += 1;
            }
          }
        }
      });
      const ageBarChart = new ApexCharts(document.querySelector("#ageBarChart"), this.ageBarChart);
      ageBarChart.render();
    },
    setStatistics(){
      this.setAgeStackChart();
      this.setAgeBarChart();
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
