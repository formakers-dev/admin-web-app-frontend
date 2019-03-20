<template>
<div class="reserved-noti">
  <h1 class="title">예약된 노티 확인하기</h1>
  <h2 class="subtitle">
    예약된 알림을 좀 더 편하게 보고 싶은 모두의 염원이 만들어낸 페이지 🤗
  </h2>
  <br/>

  <br/>
  <button class="button field is-danger"
          @click="cancel()"
          :disabled="!checkedRows.length">
    <b-icon icon="close"></b-icon>
    <span>{{ checkedRows.length > 0 ? checkedRows.length + '개' : '' }} 삭제</span>
  </button>
  <br/>

  <b-table
    :data="data.reservedNotiList"
    :columns="columns"
    :checked-rows.sync="checkedRows"
    :is-row-checkable="(row) => row.id !== 3"
    checkable
    detailed>

    <template slot="detail" slot-scope="props">
      <article class="media">
        <div class="media-content">
          <div class="content">
            <p>
              <strong class="tag is-success">{{ props.row.data.data.channel }}</strong><br/>
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
                emails : {{ props.row.data.emails }}
              </strong>
              <br/>
              <strong>nextRunAt : {{ props.row.nextRunAt }}</strong>
            </p>
          </div>
        </div>
      </article>
    </template>
  </b-table>

</div>
</template>

<script>
import request from '../common/http';

export default {
  name: 'ReservedNoti',
  data() {
    return {
      data: {
        reservedNotiList: [],
      },
      columns: [
        {
          field: 'data.data.title',
          label: '제목',
        },
        {
          field: 'nextRunAt',
          label: '예약시간',
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
            this.data.reservedNotiList = res.data;
          } else {
            this.showErrorToast();
          }
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
