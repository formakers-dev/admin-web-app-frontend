<template>
  <div>
    <h1 class="title">🎮 게임 테스트 목록 🎮</h1>
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
      :data="allBetaTests"
      :loading="isLoading"
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
      <template slot-scope="props">
        <b-table-column field="iconImageUrl" label="" width="60">
          <img :src="props.row.iconImageUrl" width="40"/>
        </b-table-column>
        <b-table-column field="title" label="제목" searchable>
           {{ props.row.title }}
        </b-table-column>
        <b-table-column field="subjectType" label="유형">
          {{ convertedSubjectType(props.row.subjectType)}}
        </b-table-column>
        <b-table-column field="title" label="플랜">
          {{ props.row.plan ? props.row.plan.toUpperCase() : '-' }}
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
        <b-table-column field="openingStatus" label="상태" sortable>
          <strong v-if="props.row.isTestingMode" class="tag is-primary" style="margin-right:10px">테스트 모드</strong>
          <strong v-if="props.row.openingStatus === 1" class="tag is-danger">오픈</strong>
          <strong v-else-if="props.row.openingStatus === 2" class="tag is-warning">대기</strong>
          <strong v-else class="tag is-black">종료</strong>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
import moment from 'moment';
import request from '../../common/utils/http';
import Epilogue from '../components/EpilogueForm';
export default {
  name: 'TestList',
  data() {
    return {
      allBetaTests: [],
      openedBetaTests: [],
      closedBetaTests: [],
      isLoading: true,
      result: null,
      selected: {},
      currentPage:1,
      subjectTypes:{
        'game-test': '게임 테스트',
        'event' : '이벤트',
        'fomes-test' : '포메스 테스트'
      }
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
            return result;
          });
          this.isLoading = false;
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
      this.$router.push({path:'/test/register', query:{id: row._id, p: String(this.currentPage)}});
    },
    getOpeningStatus(open, close){
      const current = new Date().getTime();
      const openDate = new Date(open).getTime();
      const closeDate = new Date(close).getTime();
      if(openDate <= current && closeDate >= current){
        return 1;
      }
      if(closeDate < current){
        return 3;
      }
      return 2;
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
    }
  },
};
</script>

<style scoped>
  .test-list {
    text-align: start;
    padding: 30px;
  }
</style>
