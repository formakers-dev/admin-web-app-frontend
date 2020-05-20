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
      current-page.sync="1"
      :pagination-simple="false"
      pagination-position="both"
      @select="showDetail"
      selectable>
      <template slot-scope="props">
        <b-table-column field="_id" label="ID" width="60" searchable>
          {{ props.row._id }}
        </b-table-column>
        <b-table-column field="iconImageUrl" label="" width="60">
          <img :src="props.row.iconImageUrl" width="40"/>
        </b-table-column>
        <b-table-column field="title" label="제목" searchable>
           {{ props.row.title }}
        </b-table-column>
        <b-table-column field="title" label="플랜">
          {{ props.row.plan ? props.row.plan.toUpperCase() : '' }}
        </b-table-column>
        <b-table-column field="openDate" label="오픈 날짜" sortable centered>
          {{ props.row.openDateDisplay }}
        </b-table-column>
        <b-table-column field="closeDate" label="종료 날짜" sortable centered>
          {{ props.row.closeDateDisplay }}
        </b-table-column>
        <b-table-column field="openingStatus" label="상태" centered sortable>
          <strong v-if="props.row.openingStatus === 1" class="tag is-danger">오픈</strong>
          <strong v-else-if="props.row.openingStatus === 2" class="tag is-warning">대기</strong>
          <strong v-else class="tag is-black">종료</strong>
          <strong v-if="props.row.isTestingMode" class="tag is-primary" style="margin-left:10px">테스트 모드</strong>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
import moment from 'moment';
import request from '../../common/utils/http';

export default {
  name: 'TestList',
  data() {
    return {
      allBetaTests: [],
      openedBetaTests: [],
      closedBetaTests: [],
      isLoading: true,
      result: null,
      selected: {}
    };
  },
  created() {
    this.getAllBetaTests();
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
        })
        .catch((err) => {
          this.$root.showErrorToast('테스트 목록을 조회하는데 실패하였습니다.', err);
        });
    },
    convertDateTime(date){
      return moment(date).format('YYYY-MM-DD (ddd) HH:mm:ss');
    },
    showDetail(row){
      this.$router.push({path:'/test/register', query:{id: row._id}});
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
  },
};
</script>

<style scoped>
  .test-list {
    text-align: start;
    padding: 30px;
  }
</style>
