<template>
  <section>
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <p class="title is-5">테스트별 리워즈 금액(최근 10개)</p>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <b-button type="is-primary"
                    size="is-small"
                    @click="showAllTestPrice"
          >더 보기</b-button>
        </div>
      </div>
    </div>
    <div id="rewardsPriceChart"></div>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </section>
</template>

<script>
  import Apexchart from 'vue-apexcharts';
  import RewardsPriceChartModal from '../modal/RewardsPriceChartModal';
  export default {
    name: 'rewardsPriceChart',
    props:['items'],
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
        rewardsPriceChart:{
          series: [{data:[]}],
          chart: {
            type: 'bar',
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
    },
    watch : {
      'items':{
        handler(value){
          this.awardRecords = value;
          this.setStatistics();
        },
        deep: true
      }
    },
    filters:{
    },
    methods: {
      getOpeningStatus(open, close) {
        const current = new Date().getTime();
        const openDate = new Date(open).getTime();
        const closeDate = new Date(close).getTime();
        if (openDate <= current && closeDate >= current) {
          return 1; //오픈
        }
        if (closeDate < current) {
          return 2; //종료
        }
        //대기
        return 0;
      },
      setStatistics() {
        //누적 참여 완료자 리워즈 통계
        this.rewardsPriceChart.xaxis.categories = [];
        this.rewardsPriceChart.series[0].data = [];
        this.awardRecords.forEach(betaTest => {
          let point = 0;
          betaTest.awardRecords.forEach(awardRecord => {
            if (awardRecord.reward && awardRecord.reward.price) {
              point += awardRecord.reward.price;
            }
          })
          const status = this.getOpeningStatus(betaTest.openDate, betaTest.closeDate);
          this.rewardsPriceChart.xaxis.categories.push(this.options.status[status] + ' ' + betaTest.title);
          this.rewardsPriceChart.series[0].data.push(point);
          this.rewardsPriceChart.colors.push(this.options.colors[status]);
        });
        const rewardsPriceChart = new ApexCharts(document.querySelector("#rewardsPriceChart"), this.rewardsPriceChart);
        rewardsPriceChart.render();
        this.isLoading = false;
      },
      showAllTestPrice() {
        this.$buefy.modal.open({
          parent: this,
          props: {},
          component: RewardsPriceChartModal,
          hasModalCard: true,
          fullScreen: true,
          trapFocus: true,
          canCancel: false,
          events: {}
        });
      }
    }
  };
</script>

<style scoped>
</style>
