<template>
  <section class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">테스트 참여자 목록</p>
    </header>
    <section class="modal-card-body">
      <div class="columns" style="width: 100%">
        <div class="column">
          <b-table
            ref="participantsTable"
            :data="participants"
            :bordered="false"
            :hoverable="true"
            :paginated="true"
            per-page="10"
            default-sort="date"
            :default-sort-direction="'desc'"
            current-page.sync="1"
            :pagination-simple="false"
            pagination-position="top">
            <template slot-scope="props">
              <b-table-column field="userId" label="유저 아이디" searchable>
                {{ props.row.userId }}
              </b-table-column>
              <b-table-column field="nickName" label="닉네임" sortable>
                {{ props.row.nickName }}
              </b-table-column>
              <b-table-column field="date" label="참여일시" centered sortable>
                {{ convertDateTime(props.row.date) }}
              </b-table-column>
              <b-table-column field="" label="" centered sortable>
                <b-button type='is-danger' size="is-small" @click="deleteInfo(props.row.betaTestId, props.row.userId)">참여기록 삭제</b-button>
              </b-table-column>
            </template>
            <template slot="footer">
              <div class="has-text-right">
                Total: {{participants.length}}
              </div>
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
                  <p>테스트 참여자 정보가 없습니다.</p>
                </div>
              </section>
            </template>
          </b-table>
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <b-button @click="$emit('close', false)">닫기</b-button>
    </footer>
  </section>
</template>

<script>
  import request from '../../common/utils/http';
  import moment from 'moment';

  export default {
    name: 'BetaTestParticipants',
    props: {
      betaTestId: {
        type: String,
        default() {
          return null;
        }
      }
    },
    data() {
      return {
        values: '',
        key: 'userId',
        status: 'attend',
        participants: []
      };
    },
    mounted() {
      this.getParticipants();
    },
    methods: {
      getParticipants() {
        let participantsResult;

        const params = {
          type: 'beta-test',
          betaTestId: this.betaTestId,
          status: this.status
        };

        request.get('/api/participants', { params: params })
          .then(res => {
            participantsResult = res.data;

            const keywords = [];
            participantsResult.forEach(participant => keywords.push(participant.userId));

            return request.post('/api/users/search', {
              type: 'userId',
              keywords: keywords
            });
          })
          .then(res => {
            const users = res.data;

            participantsResult.forEach(participant => {
              participant.nickName = users.filter(user => user.userId === participant.userId)[0].nickName;
            });

            this.participants = participantsResult;
          })
          .catch(err => {
            this.$root.showErrorToast('테스트 참여자 조회에 실패하였습니다.', err);
          });
      },
      deleteInfo(betaTestId, userId) {
        request.delete('/api/participants/beta-test/' + betaTestId + "/user/" + userId)
          .then(() => {
            this.$root.showSuccessToast('테스트 참여자를 정상적으로 삭제하였습니다.');
            this.getParticipants();
          })
          .catch(err => {
            this.$root.showErrorToast('테스트 참여자 삭제에 실패하였습니다.', err);
          });
      },
      convertDateTime(date) {
        return moment(date)
          .format('YYYY-MM-DD (ddd) HH:mm:ss');
      },
    },
  };
</script>

<style scoped>
  .order-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    padding: 5px 10px;
    background-color: #00BFBA;
    font-weight: bold;
    color: white;
    width: 60px;
    text-align: center;
  }
</style>
