<template>
  <div>
    <h1 class="title">포인트 교환 요청 목록</h1>
<!--    <div class="level">-->
<!--      <div class="level-left">-->
<!--        <div class="level-item"></div>-->
<!--      </div>-->
<!--      <div class="level-right">-->
<!--        <div class="level-item">-->
<!--          <b-button type="is-primary"-->
<!--                    size="is-medium"-->
<!--                    tag="router-link"-->
<!--                    to="/test/register"-->
<!--          >테스트 등록</b-button>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
    <b-table
      ref="pointExchangeRequestList"
      :data="requestedPointExchanges"
      :bordered="false"
      :hoverable="true"
      :paginated="true"
      per-page="10"
      :current-page.sync="currentPage"
      :pagination-simple="false"
      pagination-position="both"
      @select="showDetail"
      selectable>
      <template slot-scope="props">
        <b-table-column field="latestUpdatedDate" label="최종 수정 날짜" searchable>
          {{ convertHumaniticDate(props.row.date) }}
        </b-table-column>
        <b-table-column field="price" label="금액" searchable>
          {{ props.row.point * -1 }}
        </b-table-column>
        <b-table-column field="phoneNumber" label="전화번호" searchable>
          {{ props.row.phoneNumber }}
        </b-table-column>
        <b-table-column field="assign" label="담당자" sortable centered searchable>
          {{ (props.row.operationData) ? getOperatorNickName(props.row.operationData.operatorAccount) : "" }}
        </b-table-column>
        <b-table-column field="status" label="처리 상태" sortable centered searchable>
          <div class="tag" :class="getStatusStyle(props.row.operationData.status)">{{ convertHumaniticStatus(props.row.operationData.status) }}</div>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
import moment from 'moment';
import request from '../../common/utils/http';
import PointExchangeForm from '../components/PointExchangeForm';

export default {
  name: 'PointExchangeRequestList',
  components:{
  },
  data() {
    return {
      options: {
        operators: [],
        operationStatus: [
          { key: 99, value: '완료', style : 'is-black' },
          { key: 10, value: '요청', style : 'is-warning' },
          { key: -1, value: '실패', style : 'is-danger' }
        ]
      },
      requestedPointExchanges: [],
      currentPage: 1,
    }
  },
  created() {
    request.get('/api/points?type=exchange')
      .then((res) => {
        const all = res.data;
        const failed = all.filter(item => item.operationData.status === -1 ).sort((a, b) => (a.date < b.date) ? -1 : 1)
        const requested = all.filter(item => item.operationData.status === 10 ).sort((a, b) => (a.date < b.date) ? -1 : 1)
        const completed = all.filter(item => item.operationData.status === 99 ).sort((a, b) => (a.date < b.date) ? 1 : -1)
        this.requestedPointExchanges = failed.concat(requested).concat(completed);
        console.log('test=', this.requestedPointExchanges);
      })
      .catch((err) => {
        this.$root.showErrorToast('목록을 조회하는데 실패하였습니다.', err);
      });

    request.get('/api/admin/assignees')
      .then(res => this.options.operators = res.data.map(operator => {
        return {
          key: operator._id,
          value: operator.account,
          text: operator.nickName,
        };
      }))
      .catch(err => console.error(err));
  },
  methods: {
    convertHumaniticDate(date) {
      return moment(date).format("YYYY-MM-DD (ddd) HH:mm:ss");
    },
    convertHumaniticStatus(statusCode) {
      return this.options.operationStatus.filter(status => status.key === statusCode)
        .map(status => status.value)[0];
    },
    getOperatorNickName(operatorAccount) {
      if (!!!operatorAccount || operatorAccount.length <= 0) {
        return "";
      }

      return this.options.operators.filter(operator => operator.value === operatorAccount)[0].text;
    },
    getStatusStyle(statusCode) {
      return this.options.operationStatus.filter(status => status.key === statusCode)
        .map(status => status.style)[0];
    },
    openForm(pointRecord, operators) {
      this.$buefy.modal.open({
        parent: this,
        props: {
          pointRecord,
          operators
        },
        component: PointExchangeForm,
        hasModalCard: true,
        trapFocus: true,
        canCancel: false,
        events: {
          close: (options) => { this.closeForm(options); },
        },
      });
    },
    showDetail(row) {
      this.openForm(row, this.options.operators);
    },
    closeForm() {

    }
  }
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
