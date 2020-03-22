<template>
<div>
  <h1 class="title">알림 관리</h1>
  <div class="level">
    <div class="level-left">
      <div class="level-item">
        <b-button type="is-danger"
                  :disabled="!checkedRows.length"
                  size="is-medium"
                  @click="remove"
                  icon-left="delete"
        >
          {{ checkedRows.length > 0 ? checkedRows.length + '개' : '' }} 삭제
        </b-button>
      </div>
    </div>
    <div class="level-right">
      <div class="level-item">
        <b-button type="is-primary"
                  size="is-medium"
                  icon-left="bell-ring"
                  @click="openNotificationForm(null, 'add')"
        >알람 전송/예약</b-button>
      </div>
    </div>
  </div>


  <b-table
    ref="reservedNotiTable"
    :data="reservedNotiList"
    :loading="isLoading"
    :checked-rows.sync="checkedRows"
    :bordered="false"
    :hoverable="true"
    :show-detail-icon="false"
    default-sort="nextRunAt"
    @select="showDetail"
    checkable
    detailed
    selectable
    >

    <template slot-scope="props">
      <b-table-column field="title" label="제목">
        {{ props.row.data.data.title }}
      </b-table-column>

      <b-table-column field="nextRunAt" label="발송 예정 시각" sortable>
        {{ props.row.nextRunAt }}
      </b-table-column>

      <b-table-column field="channel" label="채널" centered>
        <strong class="tag is-primary">
          {{ convertChannelName(props.row.data.data.channel) }}
        </strong>
      </b-table-column>

      <b-table-column label="전송대상" centered>
        <strong v-if="props.row.name.includes('topic')" class="tag is-success">
          단체
        </strong>
        <strong v-else class="tag is-warning">
          개별
        </strong>
      </b-table-column>
      <b-table-column label="전송결과" centered>
        <b-tooltip
          v-if="props.row.failCount > 0"
          :label="props.row.failReason"
          type="is-danger"
          position="is-right"
          multilined>
          <strong class="tag is-danger">실패</strong>
        </b-tooltip>
        <strong v-else class="tag is-black">대기중</strong>
      </b-table-column>
    </template>

    <template slot="empty">
      <section v-if="!isLoading" class="section">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon
              icon="emoticon-sad"
              size="is-large">
            </b-icon>
          </p>
          <p>예약된 알림이 없습니다.</p>
        </div>
      </section>
    </template>
  </b-table>

</div>
</template>

<script>
import moment from 'moment';
import request from '../../common/utils/http';
import NotificationForm from '../components/NotificationForm';

export default {
  name: 'notification-management',
  data() {
    return {
      isLoading: true,
      selected: null,
      reservedNotiList: [],
      channelList: [
        { key: '테스트 관련', value: 'channel_betatest' },
        { key: '공지사항', value: 'channel_announce' },
        { key: '기본', value: 'channel_default' }],
      notiTypeList: [
        { key: '개별', value: 'individual' },
        { key: '단체', value: 'topic' }],
      topicList: [{ key: 'notice-all', value: 'notice-all' }],
      columns: [
        {
          field: 'data.data.title',
          label: '제목',
        },
        {
          field: 'nextRunAt',
          label: '발송 예정 시각',
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
          this.reservedNotiList = res.data.map((item) => {
            const result = item;
            if (!result.data.when) {
              result.data.when = result.nextRunAt;
            }
            if (result.failCount > 0) {
              result.nextRunAt = result.data.when;
            }
            result.nextRunAt = moment(result.nextRunAt).format('YYYY-MM-DD (ddd) HH:mm:ss');
            return result;
          });
          this.isLoading = false;
          this.checkedRows = [];
        })
        .catch((err) => {
          this.$buefy.toast.open({
            message: '예약된 알람 정보를 불러오는데 실패하였습니다.',
            type: 'is-danger',
          });
          console.log(err.response);
          this.checkedRows = [];
        });
    },
    remove() {
      const checkedNotiIds = this.checkedRows.map(row => row._id);

      request.post('/noti/reserved/cancel', checkedNotiIds)
        .then((res) => {
          this.getReservedNoti();
          this.checkedRows = [];
          this.$buefy.toast.open({
            message: `${checkedNotiIds.length} 개의 예약을 정상적으로 삭제하였습니다.`,
            type: 'is-primary',
          });
          console.log(res);
        })
        .catch((err) => {
          this.result = err;
          this.$buefy.toast.open({
            message: '삭제에 실패하였습니다.',
            type: 'is-danger',
          });
          console.log(err.response);
        });
    },
    openNotificationForm(value, type) {
      this.$buefy.modal.open({
        parent: this,
        props: {
          value,
          type,
          channelList: this.channelList,
          notiTypeList: this.notiTypeList,
          topicList: this.notiTypeList,
        },
        component: NotificationForm,
        hasModalCard: true,
        trapFocus: true,
        canCancel: false,
        events: {
          close: () => this.getReservedNoti(),
        },
      });
    },
    showDetail(row) {
      const info = row.data;
      console.log('row', row);
      const reservedData = {};
      reservedData._id = row._id;
      reservedData.noti = info.data;
      reservedData.noti.isSummary = (info.data.isSummary === 'true');
      reservedData.when = new Date(info.when);
      reservedData.failResult = Object.assign({}, {
        count: row.failCount ? row.failCount : 0,
        reason: row.failReason ? row.failReason : '',
        at: row.failedAt ? new Date(row.failedAt) : null,
      });
      reservedData.topic = info.topic ? info.topic : 'notice-all';
      reservedData.notiType = info.topic ? 'topic' : 'individual';
      if (reservedData.notiType === 'individual') {
        reservedData.receivers = info.receivers.value.toString();
        reservedData.isExcluded = (info.receivers.isExcluded === 'true');
        reservedData.receiversType = info.receivers.type;
      } else {
        reservedData.receivers = '';
        reservedData.isExcluded = false;
        reservedData.receiversType = null;
      }
      console.log(reservedData);
      this.openNotificationForm(reservedData, 'modify');
    },
    convertChannelName(value) {
      const channel = this.channelList.filter(el => el.value === value);
      return channel[0].key;
    },
  },
};
</script>

<style scoped>
</style>
