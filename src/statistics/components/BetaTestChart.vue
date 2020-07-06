<template>
  <section>
    <p class="title is-5">테스트 종류 - 총 {{total | comma}} 개</p>
    <div id="betaTestChart"></div>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </section>
</template>

<script>
import Apexchart from 'vue-apexcharts';

export default {
  name: 'betaTestChart',
  props: ['items'],
  components:{
  },
  data() {
    return {
      allBetaTests: [],
      total:0,
      isLoading: true,
      options: {
        subjectTypes: {
          'game-test': '게임 테스트',
          'event': '이벤트',
          'fomes-test': '포메스 테스트'
        },
      },
      betaTestChart: {
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
          categories: ['테스트 종류'],
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
        series: [
          {
            name: '게임 테스트',
            data: [],
            key: 'game-test'
          },
          {
            name: '이벤트',
            data: [],
            key: 'event'
          },
          {
            name: '포메스 테스트',
            data: [],
            key: 'fomes-test'
          },
          {
            name: '미정의',
            data: [],
            key: 'undefinded'
          },
        ]
      },
    }
  },
  created() {
  },
  mounted() {
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
    convertedSubjectType(value){
      return this.options.subjectTypes[value] ? this.options.subjectTypes[value] : value;
    },
    setStatistics(){
      this.allBetaTests = this.items;
      this.total = this.items.length;
      const subjectTypeStats = {
        'game-test':0,
        'event':0,
        'fomes-test':0,
        'undefinded':0,
      }
      this.allBetaTests.forEach(item=>{
        if(item.subjectType){
          subjectTypeStats[item.subjectType] += 1
        }else{
          subjectTypeStats['undefinded'] += 1
        }
      });
      Object.keys(subjectTypeStats).forEach((i)=>{
        this.betaTestChart.series.forEach((series)=>{
          if(i === series.key){
            series.data.push(subjectTypeStats[i]);
          }
        });
      })
      const betaTestChart = new ApexCharts(document.querySelector("#betaTestChart"), this.betaTestChart);
      betaTestChart.render();
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
</style>
