<template>
  <div>
    <h1 class="title">게임 테스트 목록</h1>
    <section style="margin-bottom: 10px">
      <div class="level">
        <div class="level-left">
          <div class="level-item"></div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <b-button type="is-text"
                      size="is-small"
                      tag="router-link"
                      to="/statistics/beta-tests"
            >더 보기</b-button>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column is-one-fifth">
          <div class="notification is-primary stats-card">
            <p class="title is-5">총 베타테스트 수</p>
            <p class="title is-4 has-text-right">{{ statistics.totalBetaTests | comma}} 개</p>
            <b-loading :is-full-page="false" :active.sync="statistics.totalBetaTests ==='-'"></b-loading>
          </div>
        </div>
        <div class="column">
          <div class="notification is-white stats-plan-card">
            <p class="title is-5">플랜</p>
            <div id="planStatsChart"></div>
            <b-loading :is-full-page="false" :active.sync="loading.planStatsChart"></b-loading>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column">
          <div class="notification is-info stats-card">
            <p class="title is-5">누적 참여완료 현황</p>
            <div class="columns">
              <div class="column">
                <div>참여완료 횟수</div>
                <p class="title is-4 has-text-right">{{statistics.totalParticipantCount | comma}}
                  번</p>
                <b-loading :is-full-page="false"
                           :active.sync="statistics.totalParticipantCount ==='-'"></b-loading>
              </div>
              <div class="column">
                <div>참여완료자 수</div>
                <p class="title is-4 has-text-right">{{statistics.totalParticipantUserCount |
                  comma}} 명</p>
                <b-loading :is-full-page="false"
                           :active.sync="statistics.totalParticipantUserCount ==='-'"></b-loading>
              </div>
              <div class="column">
                <div>1인당 평균 참여완료 횟수</div>
                <p class="title is-4 has-text-right">{{ Math.round(statistics.totalParticipantCount
                  / statistics.totalParticipantUserCount * 100) / 100 | comma}} 회</p>
                <b-loading :is-full-page="false"
                           :active.sync="statistics.totalParticipantUserCount ==='-'"></b-loading>
              </div>
            </div>
          </div>
        </div>

        <div class="column">
          <div class="notification is-warning stats-card">
            <p class="title is-5">누적 리워드 현황</p>
            <div class="columns">
              <div class="column">
                <div>총 금액</div>
                <p class="title is-4 has-text-right">&#8361; {{statistics.totalAwardRecordPrice |
                  comma}}</p>
                <b-loading :is-full-page="false"
                           :active.sync="statistics.totalAwardRecordPrice ==='-'"></b-loading>
              </div>
              <div class="column">
                <div>1인당 평균 리워드 금액</div>
                <p class="title is-4 has-text-right">&#8361; {{ Math.round(statistics.totalAwardRecordPrice / statistics.totalParticipantUserCount * 100) / 100|
                  comma}}</p>
                <b-loading :is-full-page="false"
                           :active.sync="statistics.totalAwardRecordPrice ==='-'"></b-loading>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="level">
      <div class="level-left">
        <div class="level-item"></div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <b-button type="is-primary"
                    size="is-medium"
                    tag="router-link"
                    to="/test/register"
          >테스트 등록</b-button>
        </div>
      </div>
    </div>
    <b-table
      ref="betaTestsTable"
      :data="filteredBetaTests"
      :bordered="false"
      :hoverable="true"
      :paginated="true"
      per-page="10"
      default-sort="openDate"
      :default-sort-direction="'desc'"
      :current-page.sync="currentPage"
      :pagination-simple="false"
      pagination-position="both"
      @select="showDetail"
      selectable>
      <template slot="top-left">
        <b-field grouped>
          <b-datepicker
            v-model="searchDate"
            range
          placeholder="기간을 선택해주세요.">
          </b-datepicker>
          <p class="control">
            <b-button type="is-primary" @click="searchDate=[]">전체 기간 보기</b-button>
          </p>
        </b-field>
      </template>
      <template slot-scope="props">
        <b-table-column field="iconImageUrl" label="" width="60">
          <img :src="props.row.iconImageUrl" width="40"/>
        </b-table-column>
        <b-table-column field="title" label="제목" searchable>
           {{ props.row.title }}
        </b-table-column>
        <b-table-column field="subjectTypeDisplay" label="유형" searchable>
          {{ props.row.subjectTypeDisplay }}
        </b-table-column>
        <b-table-column field="plan" label="플랜" searchable>
          {{ props.row.plan ? props.row.plan.replace('v2_','').toUpperCase() + '플랜' : '-' }}
        </b-table-column>
        <b-table-column field="openDate" label="오픈 날짜" sortable centered>
          {{ props.row.openDateDisplay }}
        </b-table-column>
        <b-table-column field="closeDate" label="종료 날짜" sortable centered>
          {{ props.row.closeDateDisplay }}
        </b-table-column>
        <b-table-column field="" label="관리" centered>
          <b-button outlined type="is-info" size="is-small" style="margin-right: 10px" @click.stop="showEpilogue(props.row._id)">에필로그</b-button>
          <b-button outlined type="is-success" size="is-small" @click.stop="goAwardRecords(props.row._id)">수상자</b-button>
        </b-table-column>
        <b-table-column field="openingStatus" label="상태" sortable searchable>
          <strong v-if="props.row.isTestingMode" class="tag is-primary" style="margin-right:10px">테스트 모드</strong>
          <strong class="tag" :class="getOpeningStatusStyle(props.row.openingStatus)">{{ props.row.openingStatus }}</strong>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
import moment from 'moment';
import request from '../../common/utils/http';
import Epilogue from '../components/EpilogueForm';
import Apexchart from 'vue-apexcharts';
export default {
  name: 'TestList',
  components:{
  },
  data() {
    return {
      allBetaTests: [],
      awardRecordsPrice:{}, //key:betaTestId, value: totalPrice
      allParticipants:[],
      allAwardRecords:[],
      selected: {},
      currentPage:1,
      subjectTypes:{
        'game-test': '게임 테스트',
        'event' : '이벤트',
        'fomes-test' : '포메스 테스트'
      },
      statistics:{
        totalBetaTests:'-',
        plan:{
          trial:'-',
          starter:'-',
          lite:'-',
          simple:'-',
          standard:'-',
          v2_indie: '-',
          v2_30: '-',
          v2_50: '-',
          v2_100: '-',
          v2_300: '-',
          v2_recruit: '-',
          v2_pc: '-',
        },
        totalParticipantCount:'-',
        totalParticipantUserCount:'-',
        totalAwardRecordPrice:'-'
      },
      loading:{
        planStatsChart:true
      },
      planStatsChart:{
        chart: {
          type: 'bar',
          height: '110',
          stacked: true,
          stackType: '100%',
          toolbar:{
            show:false
          },
          offsetX:0,
          offsetY:-45,
          parentHeightOffset:0
        },
        grid:{
          yaxis: {
            lines: {
              show: false,
            }
          }
        },
        xaxis:{
          labels:{
            show:false
          },
          categories: ['플랜'],
          axisBorder:{
            show:false
          },
          axisTicks: {
            show:false
          }
        },
        yaxis:{
          categories:[''],
          labels:{
            show:false
          },
          axisBorder:{
            show:false
          },
          axisTicks: {
            show:false
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
          offsetX:0,
          offsetY:30,
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
          {name:'인디플랜', data:[], key:'v2_indie'},
          {name:'30플랜', data:[], key:'v2_30'},
          {name:'50플랜', data:[], key:'v2_50'},
          {name:'100플랜', data:[], key:'v2_100'},
          {name:'300플랜', data:[], key:'v2_300'},
          {name:'리크루팅플랜', data:[], key:'v2_recruit'},
          {name:'PC플랜', data:[], key:'v2_pc'},
        ]
      },
      searchDate:[],
      filteredBetaTests:[],
      planChartObj:null,
    };
  },
  created() {
    this.currentPage = this.$route.query.page ? Number(this.$route.query.page) : 1;
    this.getAllBetaTests();
  },
  watch : {
    'currentPage':{
      handler(value){
        this.$router.push({ query: {page: String(value)} });
      },
      deep: true
    },
    'allBetaTests':{
      handler(value){
        this.setStatistics()
      }
    },
    'searchDate':{
      handler(value){
        let totalParticipants = 0;
        let totalPrice = 0;
        if(value.length == 0){
          this.filteredBetaTests = this.allBetaTests;
          totalParticipants = this.allParticipants.length;
        }else{
          const open = moment(new Date(value[0]).toISOString()).valueOf();
          const close = moment(new Date(value[1]).toISOString()).valueOf() + 86400000;
          this.filteredBetaTests = this.allBetaTests.filter(i=>{
            const openDate = moment(i.openDate).valueOf();
            const closeDate = moment(i.closeDate).valueOf();
            if(open <= openDate && closeDate<=close){
              this.allParticipants.forEach(participant=>{
                if(participant.betaTestId === i._id){
                  totalParticipants +=1;
                }
              });
              totalPrice += this.awardRecordsPrice[i._id] ? this.awardRecordsPrice[i._id] : 0;
              return i;
            }
          });
        }

        this.statistics.totalBetaTests = this.filteredBetaTests.length;
        this.statistics.totalParticipantCount = totalParticipants;
        this.statistics.totalParticipantUserCount = Object.keys(this.groupBy(res.data.participants, 'userId')).length;
        this.statistics.totalAwardRecordPrice = totalPrice;
        this.setPlanChart();
      },
      deep:true
    }
  },
  filters:{
    comma(val){
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
  methods: {
    getAllBetaTests() {
      request.get('/api/beta-test')
        .then((res) => {
          this.allBetaTests = res.data.map((betaTest) => {
            const result = betaTest;
            result.openDateDisplay = this.convertDateTime(betaTest.openDate);
            result.closeDateDisplay = this.convertDateTime(betaTest.closeDate);
            result.openingStatus = this.getOpeningStatus(betaTest.openDate, betaTest.closeDate);
            result.isTestingMode = betaTest.status;
            result.subjectTypeDisplay = this.convertedSubjectType(betaTest.subjectType);
            return result;
          });
          this.filteredBetaTests = this.allBetaTests;
          this.currentPage = this.$route.query.page ? Number(this.$route.query.page) : 1;
        })
        .catch((err) => {
          this.$root.showErrorToast('테스트 목록을 조회하는데 실패하였습니다.', err);
        });
    },
    convertDateTime(date){
      return moment(date).format('YYYY-MM-DD (ddd) HH:mm:ss');
    },
    showDetail(row){
      this.$router.push({path:'/test/detail', query:{id: row._id, p: String(this.currentPage)}});
    },
    getOpeningStatus(open, close){
      const current = new Date().getTime();
      const openDate = new Date(open).getTime();
      const closeDate = new Date(close).getTime();
      if (openDate <= current && closeDate >= current) {
        return "오픈";
      }
      if (closeDate < current) {
        return "종료";
      }
      return "대기";
    },
    getOpeningStatusStyle(value) {
      if (value === '오픈') {
        return 'is-danger'
      } else if (value === '대기') {
        return 'is-warning'
      } else {
        return 'is-black'
      }
    },
    convertedSubjectType(value){
      return this.subjectTypes[value] ? this.subjectTypes[value] : value;
    },
    showEpilogue(id){
      this.$buefy.modal.open({
        parent: this,
        props: {
          betaTestId: id,
        },
        component: Epilogue,
        hasModalCard: true,
        trapFocus: true,
        canCancel: false,
        events: {
        }})
    },
    goAwardRecords(id){
      this.$router.push({path:'/award-records', query:{betaTestId:id}});
    },
    setPlanChart(){
      Object.keys(this.statistics.plan).forEach((i)=>{
        this.statistics.plan[i] = 0
      });
      this.filteredBetaTests.forEach(item=>{
        if(item.plan){
          this.statistics.plan[item.plan] += 1
        }
      });

      const data = [];
      Object.keys(this.statistics.plan).forEach((i)=>{
        const key = i;
        const value = this.statistics.plan[i];
        this.planStatsChart.series.forEach(item=>{
          if(item.key === key){
            item.data[0] = value;
            data.push(item)
          }
        });
      });
      this.$set(this.planStatsChart.series, data);
      if(this.planChartObj){
        this.planChartObj.updateSeries(this.planStatsChart.series, true);
      }else{
        this.planChartObj = new ApexCharts(document.querySelector("#planStatsChart"), this.planStatsChart);
        this.planChartObj.render();
      }
    },
    setStatistics(){
      this.loading.planStatsChart = true;
      this.setTotalParticipants();
      this.setTotalAwardRecordPrice();
      this.setPlanChart();
      this.statistics.totalBetaTests = this.filteredBetaTests.length;
      this.loading.planStatsChart = false;
    },
    setTotalParticipants(){
      request.get('/api/statistics/participants?path=overview&type=beta-test&status=complete').then(res => {
        const groupBy = function(xs, key) {
          return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
          }, {});
        };

        this.statistics.totalParticipantCount = res.data.participants.length;
        this.statistics.totalParticipantUserCount = Object.keys(this.groupBy(res.data.participants, 'userId')).length;

        this.allParticipants = res.data.participants;
      }).catch(err=>{
        console.log(err);
        this.$root.showErrorToast('총 참여자 수를 조회하는데 실패하였습니다.', err);
      })
    },
    setTotalAwardRecordPrice(){
      request.get('/api/statistics/award-records').then(res=>{
        this.allAwardRecords = res.data.betaTests;
        this.statistics.totalAwardRecordPrice = 0;
        this.allAwardRecords.forEach(i=>{
          this.statistics.totalAwardRecordPrice += i.totalPrice;
          if(i.totalPrice > 0){
            this.awardRecordsPrice[i._id] = i.totalPrice;
          }
        });
      }).catch(err=>{
        this.$root.showErrorToast('총 수상 금액을 조회하는데 실패하였습니다.', err);
      })
    },
    groupBy(xs, key) {
      return xs.reduce((rv, x) => {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    }
  },
};
</script>

<style scoped>
.stats-card{
  min-height: 130px;
}
  .stats-plan-card{
    height: 130px;
  }
</style>
