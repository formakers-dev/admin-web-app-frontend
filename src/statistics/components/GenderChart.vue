<template>
  <section>
    <p class="title is-5">성별별 참여/참여완료 횟수</p>
    <div id="genderChart"></div>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </section>
</template>

<script>
import Apexchart from 'vue-apexcharts';

export default {
  name: 'genderChart',
  props: ['items'],
  components:{
  },
  data() {
    return {
      participants: [],
      isLoading:true,
      genderChart:{
        series:[
          {name:'남', data:[0,0]},
          {name:'여', data:[0,0]},
        ],
        chart: {
          type: 'bar',
          height:'130',
          stacked: true,
          stackType: '100%',
          toolbar: {
            show: false
          },
          offsetX: 0,
          offsetY: 0,
          parentHeightOffset: 0
        },
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
          horizontalAlign: 'right',
          offsetX: 0,
          offsetY: 25,
          itemMargin: {
            horizontal: 5,
            vertical: 0
          }
        },
      },
    };
  },
  created() {
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
    comma(val){
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
  methods: {
    setStatistics(){
      this.participants.forEach(participant =>{
        if(participant.user){
          const user = participant.user;
          if(user.gender){
            const gender = user.gender === 'male' ? 0 : 1;
            const type = participant.status === 'attend' ? 0 : 1;
            this.genderChart.series[gender].data[type] += 1;
          }
        }
      });
      const genderChart = new ApexCharts(document.querySelector("#genderChart"), this.genderChart);
      genderChart.render();
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
