<template>
  <section>
    <p class="title is-5">누적 리워즈 금액 - 총 {{ total | comma}} 원</p>
    <div id="accumulatedRewardsPriceChart"></div>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </section>
</template>

<script>
  import Apexchart from 'vue-apexcharts';

  export default {
    name: 'accumulatedRewardsPriceChart',
    props:['items'],
    components:{
    },
    data() {
      return {
        isLoading:true,
        total:0,
        options:{
        },
        awardRecords:[],
        accumulatedRewardsPriceChart:{
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
      comma(val){
        return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    },
    methods: {
      setStatistics(){
        //누적 참여 완료자 리워즈 통계
        const stackedRewardsStats = {};
        this.total = 0;
        this.awardRecords.forEach(betaTest => {
          const closeTimestamp = new Date(betaTest.closeDate).getTime();
          betaTest.awardRecords.forEach(awardRecord => {
            if(awardRecord.reward && awardRecord.reward.price){
              if(stackedRewardsStats[closeTimestamp]){
                stackedRewardsStats[closeTimestamp] += awardRecord.reward.price;
              }else{
                stackedRewardsStats[closeTimestamp] = awardRecord.reward.price;
              }
              this.total += awardRecord.reward.price;
            }
          })
        });
        this.accumulatedRewardsPriceChart.series[0].data = [];
        this.accumulatedRewardsPriceChart.xaxis.categories = [];
        let accumulateRewardPrice = 0;
        Object.keys(stackedRewardsStats).forEach(timestamp =>{
          this.accumulatedRewardsPriceChart.xaxis.categories.push(new Date(Number(timestamp)).toISOString());
          accumulateRewardPrice += stackedRewardsStats[timestamp];
          this.accumulatedRewardsPriceChart.series[0].data.push(accumulateRewardPrice);
        });

        const chart = new ApexCharts(document.querySelector("#accumulatedRewardsPriceChart"), this.accumulatedRewardsPriceChart);
        chart.render();
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
