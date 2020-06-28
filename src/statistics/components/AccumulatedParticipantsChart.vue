<template>
  <section>
    <p class="title is-5">누적 테스트 참여/참여완료 횟수</p>
    <div id="accumulatedParticipantsChart"></div>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </section>
</template>

<script>
  import Apexchart from 'vue-apexcharts';

  export default {
    name: 'accumulatedParticipantsChart',
    props:['items'],
    components:{
    },
    data() {
      return {
        isLoading:true,
        options:{
        },
        participants:[],
        accumulatedParticipantsChart:{
          series: [{
            name: '참여',
            data: []
          }, {
            name: '참여 완료',
            data: []
          }],
          chart: {
            type: 'area'
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'smooth'
          },
          xaxis: {
            type: 'datetime',
            categories: [],
          },
          tooltip: {
            x: {
              format: 'yyyy-MM-dd HH:mm'
            }
          }
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
      setStatistics(){
        let stats = {};
        this.participants.forEach(participant => {
          if(participant.date){
            const date = new Date(participant.date).getTime();
            if(stats[date]){
              if(stats[date][participant.status]){
                stats[date][participant.status] += 1;
              }else{
                stats[date][participant.status] = 1;
              }
            }else{
              if(participant.status === 'attend'){
                stats[date] = Object.assign({}, {attend:1, complete:0});
              }else if(participant.status === 'complete'){
                stats[date] = Object.assign({}, {attend:0, complete:1});
              }
            }
          }
        });
        this.accumulatedParticipantsChart.series[0].data = [];
        this.accumulatedParticipantsChart.series[1].data = [];
        this.accumulatedParticipantsChart.xaxis.categories = [];
        let accumulatedAttend = 0;
        let accumulatedComplete = 0;
        Object.keys(stats).forEach(date =>{
          this.accumulatedParticipantsChart.xaxis.categories.push(new Date(Number(date)).toISOString());
          accumulatedAttend += stats[date].attend;
          accumulatedComplete += stats[date].complete;
          this.accumulatedParticipantsChart.series[0].data.push(accumulatedAttend);
          this.accumulatedParticipantsChart.series[1].data.push(accumulatedComplete);
        });
        const accumulatedParticipantsChart = new ApexCharts(document.querySelector("#accumulatedParticipantsChart"), this.accumulatedParticipantsChart);
        accumulatedParticipantsChart.render();
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
