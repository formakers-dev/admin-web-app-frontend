<template>
  <section>
    <p class="title is-5">게임 테스트별 플랜 - 총 {{total | comma}} 개</p>
    <div id="planChart"></div>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </section>
</template>

<script>
import Apexchart from 'vue-apexcharts';

export default {
  name: 'planChart',
  props: ['items'],
  components:{
  },
  data() {
    return {
      allBetaTests: [],
      isLoading:true,
      total: 0,
      planChart:{
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
          categories: ['플랜'],
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
          offsetY: 30,
          itemMargin: {
            horizontal: 5,
            vertical: 0
          }
        },
        series:[
          {name:'트라이얼', data:[], key:'trial'},
          {name:'스타터', data:[], key:'starter'},
          {name:'라이트', data:[], key:'lite'},
          {name:'심플', data:[], key:'simple'},
          {name:'스탠다드', data:[], key:'standard'},
          {name:'미정의', data:[], key:'undefinded'},
        ]
      },
    };
  },
  created() {
  },
  watch : {
    'items':{
      handler(value){
        this.allBetaTests = value;
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
      this.total = this.allBetaTests.length;
      const planStats = {
        trial:0,
        starter:0,
        lite:0,
        simple:0,
        standard:0,
        undefinded:0
      };
      this.allBetaTests.forEach(item=>{
        if(item.plan){
          planStats[item.plan] += 1;
        }else{
          planStats['undefinded'] += 1;
        }
      });
      Object.keys(planStats).forEach((i)=>{
        this.planChart.series.forEach((series)=>{
          if(i === series.key){
            series.data.push(planStats[i]);
          }
        });
      });
      const planChart = new ApexCharts(document.querySelector("#planChart"), this.planChart);
      planChart.render();
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
