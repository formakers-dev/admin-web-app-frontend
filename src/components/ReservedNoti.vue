<template>
<div class="reserved-noti">
  <h1 class="title">예약된 노티 확인하기</h1>
  <h2 class="subtitle">
    예약된 알림을 좀 더 편하게 보고 싶은 모두의 염원이 만들어낸 페이지 🤗
  </h2>
  <br/>

  <br/>

  <strong v-if="!isLoading && data.reservedNotiList.length <= 0" class="is-center">
    ❌️ 예약된 노티가 없습니다 ❌️
  </strong>
  <button v-else class="button field is-danger"
          @click="cancel()"
          :disabled="!checkedRows.length">
    <b-icon icon="close"></b-icon>
    <span>{{ checkedRows.length > 0 ? checkedRows.length + '개' : '' }} 삭제</span>
  </button>

  <br/>

  <b-table
    :data="data.reservedNotiList"
    :loading="isLoading"
    :checked-rows.sync="checkedRows"
    :is-row-checkable="(row) => row.id !== 3"
    checkable
    detailed>

    <template slot-scope="props">
      <b-table-column field="title" label="제목">
        {{ props.row.data.data.title }}
      </b-table-column>

      <b-table-column field="nextRunAt" label="예약시각">
        {{ props.row.nextRunAt }}
      </b-table-column>

      <b-table-column field="channel" label="채널" centered>
        <strong class="tag is-primary">
          {{ props.row.data.data.channel }}
        </strong>
      </b-table-column>

      <b-table-column label="전송타입" centered>
        <strong v-if="props.row.name.includes('topic')" class="tag is-black">
          단체
        </strong>
        <strong v-else class="tag is-warning">
          개별
        </strong>
      </b-table-column>
      <b-table-column label="전송결과" centered>
        <strong v-if="props.row.failCount > 0" class="tag is-danger">실패</strong>
        <strong v-else class="tag is-black">대기중</strong>
      </b-table-column>
    </template>

    <template slot="detail" slot-scope="props">
      <article class="media">
        <div class="media-content">
          <div class="content">
            <p>
              <!-- tags -->
              <strong class="tag is-primary">{{ props.row.data.data.channel }}</strong>
              &nbsp;
              <strong v-if="props.row.name.includes('topic')" class="tag is-black">
                단체
              </strong>
              <strong v-else class="tag is-warning">
                개별
              </strong>
              &nbsp;
              <strong v-if="props.row.failCount > 0" class="tag is-danger">실패</strong>
              <strong v-else class="tag is-black">대기중</strong>
            </p>
            <br/>
            <p v-if="props.row.failCount > 0">
              <b-message type="is-danger" :closable="false" title="실패 상세내용">
                failCount : {{ props.row.failCount }}<br/>
                failReason : {{ props.row.failReason }}<br/>
                failedAt : {{ props.row.failedAt }}<br/>
                lastFinishedAt : {{ props.row.lastFinishedAt }}<br/>
              </b-message>
              <br/>
            </p>
            <p>
              <b-message :closable="false" title="예약 상세내용">
                <strong>title : {{ props.row.data.data.title }}</strong><br/>
                <strong>subTitle : {{ props.row.data.data.subTitle }}</strong><br/>
                <strong>message : {{ props.row.data.data.message }}</strong><br/>
                <strong>isSummary : {{ props.row.data.data.isSummary }}</strong><br/>
                <strong>summarySubText : {{ props.row.data.data.summarySubText }}</strong><br/>
                <strong>deeplink : {{ props.row.data.data.deeplink }}</strong><br/>
                <strong v-if="props.row.name.includes('topic')">
                  topic : {{ props.row.data.topic }}
                </strong>
                <strong v-else>
                  receivers : {{ props.row.data.receivers }}
                </strong>
                <br/>
                <strong>nextRunAt : {{ props.row.nextRunAt }}</strong>
              </b-message>
            </p>
          </div>
        </div>
      </article>
    </template>
  </b-table>

</div>
</template>

<script>
import moment from 'moment';
import request from '../common/http';

export default {
  name: 'ReservedNoti',
  data() {
    const data = {
      reservedNotiList: [],
    };

    return {
      isLoading: true,
      data,
      columns: [
        {
          field: 'data.data.title',
          label: '제목',
        },
        {
          field: 'nextRunAt',
          label: '예약시간',
        },
        {
          field: 'data.data.channel',
          label: '채널',
        },
      ],
      checkedRows: [],
      result: '',
    };
  },
  created() {
    this.getReservedNoti();
  },
  methods: {
    getReservedNoti() {
      request.get('/noti/reserved')
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            this.data.reservedNotiList = res.data.map((item) => {
              const result = item;
              if (result.failCount > 0) {
                result.nextRunAt = result.data.when;
              }
              result.nextRunAt = moment(result.nextRunAt).format('YYYY-MM-DD (ddd) HH:mm:ss');
              return result;
            });
          } else {
            this.showErrorToast();
          }
          this.isLoading = false;
        })
        .catch((err) => {
          this.result = err;
          this.showErrorToast();
        });
    },
    cancel() {
      const checkedNotiIds = this.checkedRows.map(row => row._id);

      request.post('/noti/reserved/cancel', checkedNotiIds)
        .then((res) => {
          if (res.status === 200) {
            this.getReservedNoti();
          } else {
            this.showErrorToast('삭제 실패! 재시도 하세욧!!!');
          }
        })
        .catch((err) => {
          this.result = err;
          this.showErrorToast('삭제 실패! 재시도 하세욧!!!');
        });
    },
    showSuccessToast(toastMessage) {
      this.$toast.open({
        duration: 4000,
        message: toastMessage,
        type: 'is-success',
      });
    },
    showErrorToast(errorMsg) {
      this.$toast.open({
        duration: 4000,
        message: errorMsg || '실패!',
        type: 'is-danger',
      });
    },
  },
};
</script>

<style scoped>
.reserved-noti {
  text-align: start;
  padding: 30px;
}
.white-space-pre {
  white-space: pre-wrap;
}
</style>
