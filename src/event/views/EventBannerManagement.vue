<template>
  <div>
    <h1 class="title">🎉 이벤트 배너 🎉</h1>
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <b-button type="is-danger"
                    :disabled="!checkedRows.length"
                    size="is-medium"
                    style="margin-right: 10px"
                    @click="remove"
                    icon-left="delete"
          >
            {{ checkedRows.length > 0 ? checkedRows.length + '개' : '' }} 삭제
          </b-button>
          <b-button type="is-info"
                    size="is-medium"
                    @click="updateOrder"
          >
            순서 저장
          </b-button>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <b-button type="is-primary"
                    size="is-medium"
                    icon-left="calendar-check"
                    @click="openForm(null, 'add')"
          >배너 추가</b-button>
        </div>
      </div>
    </div>

      <b-table
        ref="eventBannerTable"
        :data="postList"
        :loading="isLoading"
        :checked-rows.sync="checkedRows"
        :bordered="false"
        :hoverable="true"
        default-sort="order"
        @select="showDetail"
        draggable
        @dragstart="dragstart"
        @drop="drop"
        @dragover="dragover"
        @dragleave="dragleave"
        checkable
        selectable
      >

        <template slot-scope="props">
          <b-table-column field="order" label="순서" centered>
            <strong>{{ props.row.order }}</strong>
          </b-table-column>

          <b-table-column field="order" label="Cover Image" centered>
            <img :src=props.row.coverImageUrl width="200px">
          </b-table-column>

          <b-table-column field="title" label="제목" sortable>
            {{ props.row.title }}
          </b-table-column>

          <b-table-column field="openDate" label="오픈 날짜" centered sortable>
            {{ convertDateTime(props.row.openDate) }}
          </b-table-column>

          <b-table-column field="closeDate" label="종료 날짜" centered sortable >
            {{ convertDateTime(props.row.closeDate) }}
          </b-table-column>

          <b-table-column field="status" label="상태" sortable centered>
            <strong v-if="getStatus(props.row.openDate, props.row.closeDate)" class="tag is-warning">오픈</strong>
            <strong v-else-if="getStatus(props.row.openDate, props.row.closeDate)" class="tag is-primary">대기</strong>
            <strong v-else class="tag is-warning">종료</strong>
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
              <p>등록된 이벤트 배너가 없습니다.</p>
            </div>
          </section>
        </template>
      </b-table>
    </div>
</template>

<script>
import moment from 'moment';
import request from '../../common/http';
import EventBannerForm from '../components/EventBannerForm';

export default {
  name: 'EventBannerManagement',
  data() {
    return {
      postList: [],
      isLoading: true,
      checkedRows: [],
      draggingRow: null,
      draggingRowIndex: null,
    };
  },
  created() {
    this.getAllPosts();
  },
  methods: {
    dragstart(payload) {
      this.draggingRow = payload.row;
      this.draggingRowIndex = payload.index;
      payload.event.dataTransfer.effectAllowed = 'copy';
    },
    dragover(payload) {
      payload.event.dataTransfer.dropEffect = 'copy';
      payload.event.target.closest('tr').classList.add('is-selected');
      payload.event.preventDefault();
    },
    dragleave(payload) {
      payload.event.target.closest('tr').classList.remove('is-selected');
      payload.event.preventDefault();
    },
    drop(payload) {
      payload.event.target.closest('tr').classList.remove('is-selected');
      const newIndex = payload.index; // result index
      const oldIndex = this.draggingRowIndex;
      const posts = this.postList;
      const post = posts[oldIndex];
      if (newIndex > oldIndex) {
        for (let i = oldIndex; i < newIndex; i++) {
          posts[i] = posts[i + 1];
        }
      } else {
        for (let i = oldIndex; i > newIndex; i--) {
          posts[i] = posts[i - 1];
        }
      }
      posts[newIndex] = post;
      posts.forEach((el, i) => {
        el.order = i + 1;
      });
    },
    updateOrder() {
      this.isLoading = true;
      request.put('/posts', this.postList)
        .then((res) => {
          if (res.status === 200) {
            this.showSuccessToast('순서를 정상적으로 저장하였습니다.');
          } else {
            this.showErrorToast('순서를 저장하는데 실패하였습니다', res);
          }
          this.isLoading = false;
        })
        .catch((err) => {
          this.showErrorToast('순서를 저장하는데 실패하였습니다', err);
          this.isLoading = false;
        });
    },
    getStatus(openDate, closeDate) {
      const current = moment();
      if (current.isBetween(openDate, closeDate)) {
        return true;
      }
      if (current.isBefore(openDate)) {
        return true;
      }
      return true;
    },
    convertDateTime(date) {
      return moment(date).format('YYYY-MM-DD (ddd) HH:mm:ss');
    },
    getAllPosts() {
      this.isLoading = true;
      request.get('/posts')
        .then((res) => {
          console.log('response', res.data);
          if (res.status === 200) {
            res.data.forEach((element, index) => {
              element.order = index + 1;
            });
            this.postList = res.data;
          } else {
            this.showErrorToast('이벤트 배너 정보를 불러오는데 실패하였습니다.', res);
          }
          this.isLoading = false;
          this.checkedRows = [];
        })
        .catch((err) => {
          this.showErrorToast('이벤트 배너 정보를 불러오는데 실패하였습니다.', err);
          this.isLoading = false;
          this.checkedRows = [];
        });
    },
    remove() {
      if (confirm('삭제하시겠습니까?')) {
        const checkedIds = this.checkedRows.map(row => row._id);
        this.isLoading = true;
        request.post('/posts/delete', checkedIds)
          .then((res) => {
            if (res.status === 200) {
              this.getAllPosts();
              this.checkedRows = [];
              this.showSuccessToast(`${checkedIds.length} 개의 배너를 정상적으로 삭제하였습니다.`);
            } else {
              this.showErrorToast('삭제에 실패하였습니다', res);
            }
            this.isLoading = false;
          })
          .catch((err) => {
            this.showErrorToast('삭제에 실패하였습니다', err);
            this.isLoading = false;
          });
      }
    },
    openForm(value, type) {
      this.$buefy.modal.open({
        parent: this,
        props: {
          value,
          type,
          length: this.postList.length,
        },
        component: EventBannerForm,
        hasModalCard: true,
        trapFocus: true,
        canCancel: false,
        events: {
          close: () => this.getAllPosts(),
        },
      });
    },
    showDetail(row) {
      this.openForm(row, 'modify');
    },
    showSuccessToast(message) {
      this.$buefy.toast.open({
        message,
        type: 'is-primary',
      });
    },
    showErrorToast(message, err) {
      this.$buefy.toast.open({
        message,
        type: 'is-danger',
      });
      console.log(err);
    },
  },
};
</script>

<style scoped>
</style>
