<template>
  <section>
    <section>
      <b-field grouped>
        <b-field label="User ID 타입">
          <b-select v-model="requestData.key">
            <option v-for="option in options.userKeys" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </b-select>
        </b-field>
        <b-field label="보상 유형">
          <b-select v-model="rewardType">
            <option v-for="option in options.rewardTypes" :key="option.key" :value="option.value.type">
              {{ option.value.title }}
            </option>
          </b-select>
        </b-field>
        <b-field>
          <template slot="label">
            <span class="has-text-danger">*</span> 보상 설명
          </template>
          <b-input v-model="requestData.reward.description"></b-input>
        </b-field>
        <b-field label="보상 가격">
          <b-input v-model="requestData.reward.price"></b-input>
        </b-field>
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
                    :disabled="values.length === 0 || requestData.reward.description.trim().length === 0"
            >등록</button>
          </p>
        </b-field>
      </b-field>
      <div class="level" style="margin-bottom: 10px;">
        <div class="level-left">
          <div class="level-item">
            <b-button type="is-danger"
                      :disabled="!checkedRows.length"
                      @click="remove"
                      icon-left="delete"
            >
              {{ checkedRows.length > 0 ? checkedRows.length + '개' : '' }} 삭제
            </b-button>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <b-button type="is-success"
                      icon-left="download"
                      @click="exportAwardRecords"
                      :disabled="awardRecords.length === 0"
                      style="margin-left: 10px"
            >수상자 내역 다운로드 (.xlsx)</b-button>
          </div>
        </div>
      </div>
      <b-table
        ref="awardRecordsTable"
        :data="awardRecords"
        :loading="isLoading"
        :bordered="false"
        :hoverable="true"
        :paginated="true"
        per-page="10"
        :pagination-simple="false"
        pagination-position="both"
        @select="showDetail"
        :checked-rows.sync="checkedRows"
        selectable
        checkable
      >
        <template slot-scope="props">
          <b-table-column field="userId" label="User ID" searchable>
            {{props.row.userId}}
          </b-table-column>
          <b-table-column field="nickName" label="닉네임" searchable>
            {{ props.row.nickName }}
          </b-table-column>
          <b-table-column field="type" label="수상 유형">
            {{ props.row.type }}
          </b-table-column>
          <b-table-column field="reward.description" label="보상 설명">
            {{ props.row.reward.description }}
          </b-table-column>
          <b-table-column field="reward.price" label="보상 금액">
            {{ props.row.reward.price ? props.row.reward.price : '-'}}
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
              <p>등록된 수상자가 없습니다.</p>
            </div>
          </section>
        </template>
      </b-table>
    </section>
  </section>
</template>

<script>
  import request from '../../common/utils/http';
  import XLSX from 'xlsx';
  import moment from 'moment';
  import AwardRecordDetailForm from './AwardRecordDetailForm';
export default {
  name: 'AwardRecords',
  props:['betaTestTitle','betaTestId','data','rewardTypes','rewardList'],
  data() {
    return {
      type:'add',
      awardRecords:[],
      requestData:{
        key:'userId',
        betaTestId:null,
        users:[],
        type:'best',
        reward:{
          description:'',
          price:null
        }
      },
      testTitle:'',
      rewardType:'best',
      values:'',
      isLoading:false,
      checkedRows:[],
      options:{
        userKeys:[
          {text:'이메일', value:'email'},
          {text:'닉네임', value:'nickName'},
          {text:'유저 아이디', value:'userId'}
        ],
        rewardTypes:[],
      }
    };
  },
  watch:{
    'betaTestId':{
      handler(value){
        this.getAwardRecords(value);
        this.requestData.betaTestId = value;
      },
      deep:true
    },
    'data':{
      handler(value){
        this.type = 'update'
      },
      deep:true
    },
    'rewardList':{
      handler(value){
        this.rewardType = value[0].type ? value[0].type : 'best';
        this.options.rewardList = value;
      },
      deep:true
    },
    'rewardType':{
      handler(value){
        this.rewardList.forEach((e)=>{
          if(e.type === value){
            this.requestData.reward.description = e.content;
            this.requestData.reward.price = e.price;
          }
        })
        this.requestData.type = value;
      },
      deep:true
    },
    'betaTestTitle':{
      handler(value){
        this.testTitle = value;
      },
      deep:true
    }
  },
  mounted() {
    this.options.rewardTypes = this.rewardTypes;
  },
  methods: {
    getAwardRecords(betaTestId){
      this.isLoading = true;
      request.get('/api/award-records?betaTestId='+betaTestId).then((res)=>{
        this.awardRecords = res.data;
        this.isLoading = false;
      }).catch((err)=>{
        this.isLoading = false;
        this.$root.showErrorToast('수상 내역 조회에 실패하였습니다.', err);
      });
    },
    showDetail(row){
      console.log(row);
      this.$buefy.modal.open({
        parent: this,
        props: {
          value: row,
          options: this.options,
          rewardList: this.rewardList,
        },
        component: AwardRecordDetailForm,
        hasModalCard: true,
        trapFocus: true,
        canCancel: false,
        events: {
          close: (options) => { this.closeForm(options); },
        }})
    },
    closeForm(refresh){
      if(refresh){
        this.getAwardRecords(this.betaTestId);
      }
    },
    register(){
      this.isLoading = true;
      const splitedKeywords = this.values ? this.values.split(/[,\s\n]+/) : [];
      const keywords = [];
      splitedKeywords.forEach(value => {
        const keyword = value.replace(/(\s*)/g, "");
        if(keyword.length > 0){
          keywords.push(keyword);
        }
      });
      if(keywords.length === 0){
        const text = this.getSearchTypeText(this.requestData.type);
        this.$root.showErrorToast(text + '을 1개이상 입력해주세요.', '');
        this.isLoading = false;
        return;
      }
      const body = {
        userKey: this.requestData.key,
        users: keywords,
        type: this.requestData.type,
        betaTestId: this.betaTestId,
        reward:{
          description: this.requestData.reward.description,
          price: this.requestData.reward.price
        }
      };
      request.post('/api/award-records',body).then((res)=>{
        this.isLoading = false;
        this.getAwardRecords(this.betaTestId);
      }).catch(err=>{
        this.isLoading = false;
        this.$root.showErrorToast('수상 내역 등록에 실패하였습니다.', err);
      });

    },
    remove(){
      this.isLoading = true;
      const checkedIds = this.checkedRows.map(row => row._id);
      request.post('/api/award-records/delete', checkedIds).then((res)=>{
        this.checkedRows = [];
        this.isLoading = false;
        this.getAwardRecords(this.betaTestId);
      }).catch(err=>{
        this.isLoading = false;
        this.$root.showErrorToast('수상 내역 삭제에 실패하였습니다.', err);
      });
    },
    exportAwardRecords(){
      const data = [];
      this.awardRecords.forEach((e)=>{
        data.push({
          userId: e.userId,
          nickName: e.nickName,
          type: e.type,
          description: e.reward.description,
          price: e.reward.price
        });
      });
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws);

      const date = moment(new Date()).format('YYYYMMDDHHmmss');
      const filename = this.testTitle + '-수상자 내역정보('+date+').xlsx';
      XLSX.writeFile(wb, filename);
    }
  },
};
</script>

<style scoped>
</style>
