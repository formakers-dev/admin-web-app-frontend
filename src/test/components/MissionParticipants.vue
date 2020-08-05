<template>
  <section class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">미션 완료자 추가/관리</p>
    </header>
    <section class="modal-card-body">
      <div class="columns" style="width: 100%">
        <div class="column">
          <b-field>
            <b-select v-model="key">
              <option v-for="option in options.types" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </b-select>
            <b-select v-model="status" style="margin-left:10px">
              <option v-for="option in options.status" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </b-select>
          </b-field>
          <b-field style="width: 100% !important;">
            <b-field style="width: 100% !important;">
              <b-tooltip label="쉼표(,)나 엔터로 구분해주세요."
                         position="is-bottom"
                         type="is-primary"
                         style="width: inherit;"
              >
                <b-input type="textarea"
                         v-model="values"
                         style="width: 100%"
                >
                </b-input>
              </b-tooltip>
              <p class="control">
                <button class="button is-primary"
                        style="height: 100%"
                        @click="register"
                        :disabled="values.length === 0"
                >등록</button>
              </p>
            </b-field>
          </b-field>
          <b-message title="삭제 시 유의사항" type="is-warning" aria-close-label="Close message">
            ⚠️&nbsp;️&nbsp;미션 완료자 삭제 시, 수상자 목록에서도 해당 유저를 삭제하셔야 합니다!!
          </b-message>
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
              <b-table-column field="userId" label="User ID" searchable>
                {{props.row.userId}}
              </b-table-column>
              <b-table-column field="status" label="Status" sortable>
                {{ props.row.status }}
              </b-table-column>
              <b-table-column field="date" label="Date" centered sortable>
                {{ convertDateTime(props.row.date) }}
              </b-table-column>
              <b-table-column field="" label="Actions" centered sortable>
                <b-button type='is-danger' size="is-small" @click="deleteInfo(props.row._id)">Delete</b-button>
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
  import moment from 'moment';
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
      values:'',
      key:'userId',
      status:'complete',
      participants:[],
      options:{
        types:[
          {text:'유저 아이디', value:'userId'},
          {text:'이메일', value:'email'}
        ],
        status:[
          {text:'완료', value:'complete'}
        ]
      }
    };
  },
  mounted() {
    this.getParticipants()
  },
  methods: {
    getParticipants(){
      const params = {
        type: 'mission',
        betaTestId: this.betaTestId,
        missionId: this.missionId
      };
      request.get('/api/participants',{params:params}).then(res=>{
        this.participants = res.data;
      }).catch(err=>{
        this.$root.showErrorToast('미션 참여 사용자 조회에 실패하였습니다.', err);
      });
    },
    deleteInfo(id){
      request.delete('/api/participants/'+id).then(res=>{
        this.$root.showSuccessToast('미션 참여 사용자를 정상적으로 삭제하였습니다.');
        this.getParticipants();
      }).catch(err => {
        this.$root.showErrorToast('미션 참여 사용자 삭제에 실패하였습니다.', err);
      });
    },
    register(){
      const splitedValues = this.values ? this.values.split(/[,\s\n]+/) : [];
      const ids = [];
      splitedValues.forEach(value => {
        const id = value.replace(/(\s*)/g, "");
        if(id.length > 0){
          ids.push(id);
        }
      });
      if(ids.length === 0){
        this.$root.showToast('is-danger', '사용자 정보를 1개이상 입력해주세요.');
        return;
      }
      const body = {
        userKey: this.key,
        ids : ids,
        betaTestId : this.betaTestId,
        missionId: this.missionId,
        status: this.status,
        type:'mission'
      };
      request.post('/api/participants', body).then(res=>{
        this.getParticipants()
      }).catch(err=>{
        this.$root.showErrorToast('미션 참여 사용자 등록에 실패하였습니다.', err);
      });
    },
    convertDateTime(date){
      return moment(date).format('YYYY-MM-DD (ddd) HH:mm:ss');
    },
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
