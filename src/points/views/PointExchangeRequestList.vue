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
      default-sort="date"
      :default-sort-direction="'desc'"
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
          {{ props.row.metaData.operatorAccountId }}
        </b-table-column>
        <b-table-column field="status" label="처리 상태" sortable centered searchable>
          <div class="tag" :class="getStatusStyle(props.row.status)">{{ convertHumaniticStatus(props.row.status) }}</div>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'PointExchangeRequestList',
  components:{
  },
  data() {
    return {
      options: {
        status: [
          {
            key: 1,
            value : '완료',
            style : 'is-black'
          }, {
            key: 10,
            value: '요청',
            style : 'is-danger'
          }
        ]
      },
      requestedPointExchanges: [{
        "userId" : "google115909938647516500511",
        "date" : new Date("2020-07-15T08:42:02.427Z"),
        "point" : -5000,
        "type" : 2,
        "status" : 1,
        "description" : "5000원권 1장 교환",
        "phoneNumber" : "010-1111-2222",
        "metaData" : {
          "operatorAccountId" : "irene@formakers.net"
        },
        "__v" : 0
      }],
      currentPage: 1,
    }
  },
  methods: {
    convertHumaniticDate(date) {
      return moment(date).format("YYYY-MM-DD (ddd) HH:mm:ss");
    },
    convertHumaniticStatus(statusCode) {
      return this.options.status.filter(status => status.key === statusCode)
        .map(status => status.value)[0];
    },
    getStatusStyle(statusCode) {
      return this.options.status.filter(status => status.key === statusCode)
        .map(status => status.style)[0];
    },
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
