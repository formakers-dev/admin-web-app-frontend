<template>
  <section>
    <p class="title is-5">직업별 테스트 참여완료 횟수</p>
    <div id="jobChart"></div>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </section>
</template>

<script>
import Apexchart from 'vue-apexcharts';
import moment from 'moment';
export default {
  name: 'jobChart',
  props:['items'],
  components:{
  },
  data() {
    return {
      isLoading:true,
      options:{
        job:{
          '1000':{name:'관리자',index:0},
          '2000':{name:'전문가',index:1},
          '2001':{name:'IT 종사자',index:2},
          '3000':{name:'사무 종사자',index:3},
          '4000':{name:'서비스 종사자',index:4},
          '5000':{name:'학생',index:5},
          '5003':{name:'초등학생',index:6},
          '5001':{name:'중고등학생',index:7},
          '5002':{name:'대학생',index:8},
          '6000':{name:'판매 종사자',index:9},
          '7000':{name:'농업/어업 숙련 종사자',index:10},
          '8000':{name:'기능원 및 관련 기능 종사자',index:11},
          '9000':{name:'장치/기계 조작 및 조립 종사자',index:12},
          '10000':{name:'단순노무 종사자',index:13},
          '11000':{name:'군인',index:14},
          '12000':{name:'기타',index:15},
          '12001':{name:'주부',index:16},
          '12002':{name:'무직',index:17},
        }
      },
      participants:[],
      jobChart: {
        series: [
        ],
        chart: {
          type: 'line',
          height: '330',
          zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true
          },
        },
        plotOptions: {
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: 'smooth',
          width: 2,
        },
        markers: {
          size: 1
        },
        colors: [
          '#79ceb8', '#537bc4', '#ffdb00', '#13d8aa', '#314855',
          '#e95f5c', '#f9a3a4', '#ff2052', '#0d69af', '#e66000',
          '#4d148c', '#2facb2', '#52565e', '#da1884', '#84bd00',
          '#b84592', '#003666', '#7f181b'
        ],
        xaxis: {
          type:'numeric',
          categories: [],
          tickPlacement: 'on',
          labels: {
            show : true,
            formatter: function(val, index){
              return moment(val).format("YYYY-MM");
            },
          }
        },
        yaxis: {
          labels: {
            show: true,
            formatter: function(val, index) {
              if(val){
                return val.toFixed();
              }else{
                return 0;
              }
            }
          },
          min:0,
        },
        legend: {
          position: 'right',
          horizontalAlign: 'center'
        },
        tooltip:{
          x: {
            show: true,
            formatter: function(value, timestamp, index) {
              return moment(new Date(value).toISOString()).format("YYYY-MM");
            }
          },
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
    setJobChart(){
      this.jobChart.series = [];
      this.jobChart.xaxis.categories = [];
      const data = [];
      Object.keys(this.options.job).forEach(job=>{
        data.push(Object.assign({},{
          jobCode: job,
          totalCount:{
            complete:0,
            attend:0
          },
          ranking: Object.keys(this.options.job).length,
          jobName: this.options.job[job].name,
          items:{}
        }));
      });
      const dateSet = new Set([]);
      this.participants.forEach(participant => {
        if(participant.user){
          const index = this.options.job[participant.user.job].index;
          data[index].totalCount[participant.status] +=1;
          const date = new Date(participant.date);
          // const convertedDate = moment(new Date(date.getFullYear(), date.getMonth(), 1).toISOString()).format('YYYY-MM');
          const convertedDate = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
          dateSet.add(convertedDate);
          if(data[index].items[convertedDate]){
            data[index].items[convertedDate] += 1;
          }else{
            data[index].items[convertedDate] = 1;
          }
        }
      });
      // set to array
      // const dateArray = Array.from(dateSet);
      // dateArray.forEach(i=>{
      //   const convertedDate = moment(new Date(i).toISOString()).format('YYYY-MM');
      //   this.jobChart.xaxis.categories.push(convertedDate);
      // })
      this.jobChart.xaxis.categories = Array.from(dateSet);
      data.sort((a,b)=>{
        return a.totalCount.complete > b.totalCount.complete ? -1 : a.totalCount.complete < b.totalCount.complete ? 1 : 0;
      });
      data.forEach((item,index)=>{
        item.ranking = index+1;
        const dataArray = Array.fill(this.jobChart.xaxis.categories.length, 0);
        this.jobChart.xaxis.categories.forEach((date, index)=>{
          if(item.items[date]){
           dataArray[index] = item.items[date];
          }
        });
        const series = Object.assign({},
          {
            name: item.ranking+". "+item.jobName,
            data:Object.assign([], dataArray)
          })
        this.jobChart.series.push(series);
      });
      const jobChart = new ApexCharts(document.querySelector("#jobChart"), this.jobChart);
      jobChart.render();
    },
    setStatistics(){
      this.setJobChart();
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
