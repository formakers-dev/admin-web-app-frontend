<template>
  <section>
    <h1 class="title">🎉 {{betaTest.title}} 수상자 관리 🎉</h1>
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
            <option v-for="option in options.rewardTypes" :key="option.key" :value="option.value.typeCode">
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
      <b-message v-if="notMatchedMessage" type="is-danger">
        총 {{requestUsersCount}}명의 사용자 중 {{requestUsersCount - responseUsersCount}} 명의 사용자 정보조회를 실패하였습니다.
        <br>{{notMatchedUsers.join(' , ')}}
      </b-message>
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
          <b-table-column field="typeString" label="수상 유형" searchable>
            {{ props.row.typeString }}
          </b-table-column>
          <b-table-column field="reward.description" label="보상 설명" searchable>
            {{ props.row.reward.description }}
          </b-table-column>
          <b-table-column field="reward.price" label="보상 금액" searchable>
            {{ props.row.reward.price ? props.row.reward.price : '-'}}
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
  import AwardRecordDetailForm from '../components/AwardRecordDetailForm';
export default {
  name: 'AwardRecords',
  data() {
    return {
      type:'add',
      awardRecords:[],
      requestData:{
        key:'userId',
        betaTestId:null,
        users:[],
        typeCode:9000,
        reward:{
          description:'',
          price:null
        }
      },
      betaTest:{},
      testTitle:'',
      rewardType:0,
      values:'',
      checkedRows:[],
      rewardList:[],
      requestUsersCount:0,
      responseUsersCount:0,
      notMatchedMessage:false,
      notMatchedUsers:[],
      options:{
        userKeys:[
          {text:'이메일', value:'email'},
          {text:'닉네임', value:'nickName'},
          {text:'유저 아이디', value:'userId'}
        ],
        rewardTypes:[
          {key:9000, value:{typeCode:9000, title:'테스트 수석', iconImageUrl:'https://i.imgur.com/ybuI732.png', content:'문화상품권 3만원', price: 30000, count: 1}},
          {key:7000, value:{typeCode:7000, title:'테스트 차석', iconImageUrl:'https://i.imgur.com/6RaZ7vI.png', content:'문화상품권 5천원', price: 5000, count: 1}},
          {key:5000, value:{typeCode:5000, title:'테스트 성실상', iconImageUrl:'https://i.imgur.com/btZZHRp.png', content:'문화상품권 1천원', price: 1000}},
          {key:3000, value:{typeCode:3000, title:'참가상', iconImageUrl:'', content:''}},
          {key:1000, value:{typeCode:1000, title:'기타', iconImageUrl:'', content:''}},
        ],
      }
    };
  },
  watch:{
    'rewardList':{
      handler(value){
        this.options.rewardList = value;
        this.rewardType = value[0].typeCode ? value[0].typeCode : 9000;
      },
      deep:true
    },
    'rewardType':{
      handler(value){
        this.rewardList.forEach((e)=>{
          if(e.typeCode === value){
            this.requestData.reward.description = e.content;
            this.requestData.reward.price = e.price;
          }
        });
        this.requestData.typeCode = value;
      },
      deep:true
    },
  },
  created() {
    this.betaTestId = this.$route.query.betaTestId;
    this.getAwardRecords();
  },
  mounted() {
  },
  methods: {
    convertedType(typeCode){
      for(let i=0; i<this.options.rewardTypes.length; i++){
        if(this.options.rewardTypes[i].key === typeCode){
          return this.options.rewardTypes[i].value.title;
        }
      }
    },
    getAwardRecords(){
      request.get('/api/award-records?betaTestId='+this.betaTestId+'&path=beta-test').then((res)=>{
        this.awardRecords = res.data.awardRecords;
        this.awardRecords = this.awardRecords.map(awardRecord => {
          awardRecord.typeString = this.convertedType(awardRecord.typeCode);
          return awardRecord;
        });
        this.betaTest = res.data.betaTest;
        this.rewardList = res.data.betaTest.rewards.list;
      }).catch((err)=>{
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
        this.getAwardRecords();
      }
    },
    register(){
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
        return;
      }
      const body = {
        userKey: this.requestData.key,
        users: keywords,
        typeCode: this.requestData.typeCode,
        type: this.getRewardType(this.requestData.typeCode),  //리워드 관련 임시 처리 (추후 앱 크리티컬 업데이트 시 아래 내용 삭제 필요)
        betaTestId: this.betaTestId,
        reward:{
          description: this.requestData.reward.description,
          price: this.requestData.reward.price
        }
      };
      this.requestUsersCount = keywords.length;
      request.post('/api/award-records',body).then((res)=>{
        this.responseUsersCount = res.data.length;
        this.notMatchedMessage = (this.requestUsersCount-this.responseUsersCount) > 0;
        if(this.notMatchedMessage){
          this.checkNotMatchedUser(this.requestData.key, keywords, res.data);
        }
        this.getAwardRecords();
      }).catch(err=>{
        this.$root.showErrorToast('수상 내역 등록에 실패하였습니다.', err);
      });
    },
    //리워드 관련 임시 처리 (추후 앱 크리티컬 업데이트 시 아래 내용 삭제 필요)
    getRewardType(typeCode) {
      switch (typeCode) {
        case 9000 :
          return "best";
        case 7000 :
          return "good";
        case 5000 :
          return "normal";
        case 3000 :
          return "participated";
        case 1000 :
          return "etc";
      }
    },
    remove(){
      const checkedIds = this.checkedRows.map(row => row._id);
      request.post('/api/award-records/delete', checkedIds).then((res)=>{
        this.checkedRows = [];
        this.getAwardRecords();
      }).catch(err=>{
        this.$root.showErrorToast('수상 내역 삭제에 실패하였습니다.', err);
      });
    },
    exportAwardRecords(){
      const data = [];
      this.awardRecords.forEach((e)=>{
        data.push({
          userId: e.userId,
          nickName: e.nickName,
          type: this.convertedType(e.typeCode),
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
    },
    checkNotMatchedUser(type, req, res){
      const diff = req.length - res.length;
      for(let i = 0; i < req.length && this.notMatchedUsers.length < diff; i++){
        if(res.length === 0){
          this.notMatchedUsers.push(req[i]);
        }else{
          let isExisted = false;
          for(let j =0; j< res.length; j++){
            let value = res[j];
            if(req[i] === value[type]){
              isExisted = true;
              break;
            }
          }
          if(!isExisted){
            this.notMatchedUsers.push(req[i]);
          }
        }
      }
    }
  },
};
</script>

<style scoped>
</style>
