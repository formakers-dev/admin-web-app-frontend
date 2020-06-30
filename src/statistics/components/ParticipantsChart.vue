<template>
  <section>
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <p class="title is-5">테스트별 참여/참여완료</p>
        </div>
      </div>
    </div>
    <div id="participantsChart"></div>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </section>
</template>

<script>
  import Apexchart from 'vue-apexcharts';
  export default {
    name: 'participantsChart',
    props:['items'],
    components:{
    },
    data() {
      return {
        isLoading:true,
        participants:[],
        participantsChart:{
          series: [],
          chart: {
            type: 'bar',
            toolbar:{
              show:false
            }
          },
          plotOptions: {
            bar: {
              horizontal: true,
              dataLabels: {
                position: 'top',
              },
            }
          },
          dataLabels: {
            enabled: true,
            offsetX: -6,
            style: {
              fontSize: '12px',
              colors: ['#fff']
            }
          },
          stroke: {
            show: true,
            width: 1,
            colors: ['#fff']
          },
          xaxis: {
            categories: [],
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
        this.participantsChart.xaxis.categories = [];
        this.participantsChart.series = [];
        this.participantsChart.series.push(Object.assign({name:'베타테스트 참여', data: []}));
        this.participantsChart.series.push(Object.assign({name:'베타테스트 참여완료', data: []}));
        this.participants.forEach(participant => {
          const betaTest = participant._id;
          this.participantsChart.xaxis.categories.push(betaTest.title);
          this.participantsChart.series[0].data.push(participant.totalAttendCount);
          this.participantsChart.series[1].data.push(participant.totalCompleteCount);
        });
        console.log(this.participantsChart.series);
        const participantsChart = new ApexCharts(document.querySelector("#participantsChart"), this.participantsChart);
        participantsChart.render();
        this.isLoading = false;
      },
    }
  };
</script>

<style scoped>
</style>
