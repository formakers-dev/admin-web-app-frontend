<template>
  <section class="modal-card">
    <header class="modal-card-head">
      <p  class="modal-card-title">전체 테스트별 리워즈 금액</p>
    </header>
    <div class="modal-card-body">
      <div style="width: 100%" id="allRewardsPriceChart"></div>
      <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
    </div>
    <footer class="modal-card-foot">
      <b-button @click="$parent.close()">닫기</b-button>
    </footer>
  </section>
</template>

<script>
  import Apexchart from 'vue-apexcharts';
  import request from '../../common/utils/http';
  export default {
    name: 'allRewardsPriceChart',
    components:{
    },
    data() {
      return {
        isLoading:true,
        options:{
          colors: ['#ffdb00','#00BFBA','#ff2052'],
          status: ['(대기)','(오픈)','(종료)']
        },
        awardRecords:[],
        allRewardsPriceChart:{
          series: [{data:[]}],
          chart: {
            type: 'bar',
            width: '100%',
            height: 'auto',
            toolbar:{
              show:false
            },
          },
          plotOptions: {
            bar: {
              horizontal: true,
              distributed: true,
              dataLabels: {
                position: 'bottom',
              },
            }
          },
          dataLabels: {
            enabled: true,
            textAnchor: 'start',
            style: {
              colors: ['#000']
            },
            formatter: function (val, opt) {
              return opt.w.globals.labels[opt.dataPointIndex] + " - " + String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",")+'원';
            },
            offsetX: 0,
          },
          colors: [],
          stroke: {
            show: true,
            width: 1,
            colors: ['#fff']
          },
          xaxis: {
            categories: [],
          },
          yaxis: {
            labels: {
              show: false
            }
          },
          tooltip: {
            theme: 'dark',
            x: {
              show: false
            },
            y: {
              title: {
                formatter: function () {
                  return ''
                }
              }
            }
          },
          legend: {
            show:false
          }
        },
      };
    },
    mounted() {
      this.getAwardRecords();
    },
    watch : {
    },
    filters:{
    },
    methods: {
      getOpeningStatus(open, close){
        const current = new Date().getTime();
        const openDate = new Date(open).getTime();
        const closeDate = new Date(close).getTime();
        if(openDate <= current && closeDate >= current){
          return 1; //오픈
        }
        if(closeDate < current){
          return 2; //종료
        }
        //대기
        return 0;
      },
      setStatistics(){
        //누적 참여 완료자 리워즈 통계
        this.allRewardsPriceChart.xaxis.categories = [];
        this.allRewardsPriceChart.series[0].data = [];
        this.awardRecords.forEach(betaTest => {
          const status = this.getOpeningStatus(betaTest.openDate, betaTest.closeDate);
          this.allRewardsPriceChart.xaxis.categories.push(this.options.status[status] + ' ' + betaTest.title);
          this.allRewardsPriceChart.series[0].data.push(betaTest.totalPrice);
          this.allRewardsPriceChart.colors.push(this.options.colors[status]);
        });
        this.allRewardsPriceChart.chart.height = this.awardRecords.length * 40 + 300;
        const allRewardsPriceChart = new ApexCharts(document.querySelector("#allRewardsPriceChart"), this.allRewardsPriceChart);
        allRewardsPriceChart.render();
        this.isLoading = false;
      },
      getAwardRecords(){
        let query = { sort: 'desc'};
        request.get('/api/statistics/award-records', {params:query}).then(res=>{
         this.awardRecords = res.data.betaTests;
         this.setStatistics();
        }).catch(err=>{
          this.$root.showErrorToast('수상 금액정보를 조회하는데 실패하였습니다.', err);
        })
      },
    },
  };
</script>

<style scoped>
  .stats-card{
    height: 130px;
  }
</style>
