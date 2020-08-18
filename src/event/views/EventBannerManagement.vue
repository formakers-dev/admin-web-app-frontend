<template>
  <div>
    <h1 class="title">이벤트 배너</h1>
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
          <b-tooltip type="is-info"
                     label="Drag & Drop 으로 이벤트 배너의 순서를 변경해보세요!"
                     position="is-bottom"
                     multilined>
            <b-button type="is-info"
                      size="is-medium"
                      @click="updateOrder"
                      :disabled="disabled.order"
            >
              순서 저장
            </b-button>
          </b-tooltip>
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
        :checked-rows.sync="checkedRows"
        :bordered="false"
        :hoverable="true"
        :paginated="true"
        per-page="10"
        current-page.sync="1"
        :pagination-simple="false"
        pagination-position="both"
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
          <b-table-column field="order" label="순서" centered sortable>
            <strong>{{ props.row.order }}</strong>
          </b-table-column>

          <b-table-column field="order" label="Cover Image" centered>
            <img :src=props.row.coverImageUrl width="200px">
          </b-table-column>

          <b-table-column field="title" label="제목" sortable>
            {{ props.row.title }}
          </b-table-column>

          <b-table-column field="openDate" label="오픈 시각" centered sortable>
            {{ convertDateTime(props.row.openDate) }}
          </b-table-column>

          <b-table-column field="closeDate" label="종료 시각" centered sortable >
            {{ convertDateTime(props.row.closeDate) }}
          </b-table-column>

          <b-table-column field="status" label="상태" centered sortable>
            <strong v-if="props.row.status === 1" class="tag is-danger">오픈</strong>
            <strong v-else-if="props.row.status === 2" class="tag is-warning">대기</strong>
            <strong v-else class="tag is-black">종료</strong>
          </b-table-column>
        </template>

        <template slot="empty">
          <section v-if="!$root.isLoading" class="section">
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
import request from '../../common/utils/http';
import EventBannerForm from '../components/EventBannerForm';

export default {
  name: 'EventBannerManagement',
  data() {
    return {
      disabled: {
        order: true,
      },
      openedBannerCount: 0,
      standbyBannerCount: 0,
      postList: [],
      checkedRows: [],
      draggingRow: null,
      draggingRowIndex: null,
      counts: {
        open: 0,
        close: 0,
        ready: 0,
      },
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
      if (this.draggingRow.status < 3) {
        payload.event.dataTransfer.dropEffect = 'copy';
        payload.event.target.closest('tr').classList.add('is-selected');
        payload.event.preventDefault();
      }
    },
    dragleave(payload) {
      if (this.draggingRow.status < 3) {
        payload.event.target.closest('tr').classList.remove('is-selected');
        payload.event.preventDefault();
      }
    },
    drop(payload) {
      payload.event.target.closest('tr').classList.remove('is-selected');
      if (payload.row.status > 2) {
        this.$root.showErrorToast('종료된 배너와 순서를 변경할 수 없습니다.', '');
        return;
      }
      if (this.draggingRow.status < 3) {
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
          if (el.status < 3) {
            el.order = i + 1;
          }
        });
        this.postList = Object.assign([], posts);
        this.disabled = false;
      } else {
        this.$root.showErrorToast('종료된 배너의 경우 순서를 변경할 수 없습니다.', '');
      }
    },
    updateOrder() {
      request.put('/api/posts', this.postList)
        .then((res) => {
          if (res.status === 200) {
            this.$root.showSuccessToast('순서를 정상적으로 저장하였습니다.');
          } else {
            this.$root.showErrorToast('순서를 저장하는데 실패하였습니다', res);
          }
        })
        .catch((err) => {
          this.$root.showErrorToast('순서를 저장하는데 실패하였습니다', err);
        });
    },
    getStatus(open, close) {
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
    convertDateTime(date) {
      return moment(date).format('YYYY-MM-DD (ddd) HH:mm:ss');
    },
    getAllPosts() {
      request.get('/api/posts')
        .then((res) => {
          this.postList = res.data.map(element => {
            element.status = this.getStatus(element.openDate, element.closeDate);

            if (element.status === 1) {
              this.counts.open = this.counts.open + 1;
            } else if (element.status === 2) {
              this.counts.ready = this.counts.ready + 1;
            } else {
              // 종료
              element.order = 99999;
              this.counts.close = this.counts.close + 1;
            }

            return element;
          }).sort((a, b) => a.closeDate > b.closeDate ? -1 : 1);

          this.checkedRows = [];
        })
        .catch((err) => {
          this.$root.showErrorToast('이벤트 배너 정보를 불러오는데 실패하였습니다.', err);
          this.checkedRows = [];
        });
    },
    remove() {
      if (confirm('삭제하시겠습니까?')) {
        const checkedIds = this.checkedRows.map(row => row._id);
        request.post('/api/posts/delete', checkedIds)
          .then((res) => {
            this.getAllPosts();
            this.checkedRows = [];
            this.$root.showSuccessToast(`${checkedIds.length} 개의 배너를 정상적으로 삭제하였습니다.`);
          })
          .catch((err) => {
            this.$root.showErrorToast('삭제에 실패하였습니다', err);
          });
      }
    },
    closeForm(refresh) {
      if (refresh) {
        this.getAllPosts();
      }
    },
    openForm(value, type) {
      this.$buefy.modal.open({
        parent: this,
        props: {
          value,
          type,
          counts: this.counts,
        },
        component: EventBannerForm,
        hasModalCard: true,
        trapFocus: true,
        canCancel: false,
        events: {
          close: (options) => { this.closeForm(options); },
        },
      });
    },
    showDetail(row) {
      this.openForm(row, 'modify');
    }
  },
};
</script>

<style scoped>
</style>
