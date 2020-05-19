<template>
  <section class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">미션 완료자 관리</p>
    </header>
    <section class="modal-card-body">
      <div class="columns" style="width: 100%">
        <div class="column">
          <b-field style="width: 100% !important;">
            <b-field style="width: 100% !important;">
              <b-tooltip label="User ID를 쉼표(,)나 엔터로 구분해주세요."
                         position="is-bottom"
                         type="is-primary"
                         style="width: inherit;"
              >
                <b-input type="textarea"
                         v-model="userIds"
                         style="width: 100%"
                >
                </b-input>
              </b-tooltip>
              <p class="control">
                <button class="button is-primary"
                        style="height: 100%"
                        @click="regist"
                        :disabled="userIds.length === 0"
                >등록</button>
              </p>
            </b-field>
          </b-field>
          <b-table
            ref="betaTesterTable"
            :loading="isLoading"
            :data="betaTesters"
            :bordered="false"
            :hoverable="true"
            :paginated="true"
            per-page="10"
            default-sort="date"
            :default-sort-direction="'desc'"
            current-page.sync="1"
            :pagination-simple="false"
            pagination-position="both">
            <template slot-scope="props">
              <b-table-column field="userId" label="User ID" centered searchable>
                {{props.row.userId}}
              </b-table-column>
              <b-table-column field="date" label="Date" centered>
                {{ props.row.date }}
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
                  <p>미션에 참여한 사용자 정보가 없습니다.</p>
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
export default {
  name: 'Participants',
  props: {
    betaTestId:{
      type: String,
      default(){
        return null;
      }
    },
    missionId:{
      type: String,
      default(){
        return null;
      }
    }
  },
  data() {
    return {
      isLoading:false,
      userIds:[],
      betaTesters:[]
    };
  },
  mounted() {
  },
  methods: {
    getBetaTesters(){
      this.isLoading = true;
      request.get('/api/participants?type=mission').then(res=>{
        this.betaTesters = res.data;
        this.isLoading = false;
      }).catch(err=>{
        this.$root.showErrorToast('미션 참여 사용자 조회에 실패하였습니다.', err);
        this.isLoading = false;
      });
    },
    regist(){
      this.isLoading = true;
      const body = {
        ids : this.userIds,
        betaTestId : this.betaTestId,
        missionId: this.missionId
      };
      request.post('/api/participants', body).then(res=>{
        this.isLoading = false;
        this.getBetaTesters()
      }).catch(err=>{
        this.$root.showErrorToast('미션 참여 사용자 등록에 실패하였습니다.', err);
        this.isLoading = false;
      });
    }
  },
};
</script>

<style scoped>
  .order-wrapper{
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
