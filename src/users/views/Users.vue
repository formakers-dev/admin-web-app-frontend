<template>
  <div style="word-break: break-all;">
    <h1 class="title">사용자 정보 조회</h1>
    <section>
      <b-tabs v-model="activeTab" type="is-boxed" :animated="false">
        <b-tab-item label="여러명 조회하기">
          <section style="margin-bottom: 10px">
            <b-select v-model="search.multiple.type">
              <option v-for="option in search.option.types" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </b-select>
            <b-field style="width: 100%">
              <b-field style="width: 100%">
                <b-tooltip label="쉼표(,)나 엔터로 구분해주세요."
                           position="is-top"
                           type="is-primary"
                           style="width: inherit;"
                >
                  <b-input type="textarea"
                           v-model="search.multiple.keyword"
                           style="width: 100%"
                  >
                  </b-input>
                </b-tooltip>
                <p class="control">
                  <button class="button is-primary"
                          style="height: 100%"
                          @click="getUsers"
                          :disabled="search.multiple.keyword.length === 0"
                  >조회</button>
                </p>
              </b-field>
            </b-field>
          </section>
          <div class="level" style="margin-bottom: 10px;">
            <div class="level-left">
            </div>
            <div class="level-right">
              <div class="level-item">
                <b-button type="is-info"
                          size="is-medium"
                          icon-left="download"
                          @click="showExcelDownloadModal('selected')"
                          :disabled="checkedResult.byMultiple.length === 0"
                >선택된 항목 다운로드 (.xlsx)</b-button>
                <b-button type="is-success"
                          size="is-medium"
                          icon-left="download"
                          @click="showExcelDownloadModal('all')"
                          :disabled="result.getUsers.length === 0"
                          style="margin-left: 10px"
                >전체 항목 다운로드 (.xlsx)</b-button>
              </div>
            </div>
          </div>
          <b-message v-if="showErrorMessage" type="is-danger">
            총 {{requestUsersCount}}명의 사용자 중 {{requestUsersCount - responseUsersCount}} 명의 사용자 정보조회를 실패하였습니다.
            <br>{{notMatchedUsers.join(' , ')}}
          </b-message>
          <section style="margin-bottom: 10px">
            <b-table
              ref="usersTable"
              :data="result.getUsers"
              :bordered="false"
              :hoverable="true"
              :show-detail-icon="false"
              :checked-rows.sync="checkedResult.byMultiple"
              :paginated="true"
              per-page="10"
              current-page.sync="1"
              :pagination-simple="false"
              default-sort="userId"
              checkable
              detailed
              selectable
            >
              <template slot-scope="props">
                <b-table-column field="email" label="Email" searchable>
                  <img :src="getFaviconUrl('google.com')"/> {{ props.row.email}}
                </b-table-column>
                <b-table-column field="nickName" label="Nickname" searchable>
                  {{props.row.nickName}}
                </b-table-column>
                <b-table-column field="birthday" label="Age">
                  {{props.row.birthday | convertAgeRange}}
                </b-table-column>
                <b-table-column field="gender" label="Gender">
                  {{props.row.gender | convertGender}}
                </b-table-column>
                <b-table-column field="activatedDate" label="Activated Date">
                  {{props.row.activatedDate | convertDatetime}}
                </b-table-column>
                <b-table-column field="appVersion" label="App Version">
                  {{props.row.appVersion}}
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
                    <p>사용자 정보가 없습니다.</p>
                  </div>
                </section>
              </template>
            </b-table>
          </section>
          <section style="margin-bottom: 10px;">
            <user-detail :users="checkedResult.byMultiple"></user-detail>
          </section>
        </b-tab-item>
        <b-tab-item label="전체 사용자 조회하기">
          <div class="level" style="margin-bottom: 10px;">
            <div class="level-left">
              <button class="button is-primary"
                      style="height: 100%"
                      @click="getAllUsers"
              >사용자 정보 새로 불러오기</button>
            </div>
            <div class="level-right">
              <div class="level-item">
                <p><strong>Total : {{result.getAllUsers.length | numberComma}}</strong></p>
              </div>
            </div>
          </div>
          <section style="margin-bottom: 10px">
            <b-table
              ref="allUsersTable"
              :data="result.getAllUsers"
              :bordered="false"
              :hoverable="true"
              :paginated="true"
              detail-key="userId"
              per-page="10"
              current-page.sync="1"
              :pagination-simple="false"
              default-sort="userId"
              detailed
              selectable
              show-detail-icon
            >
              <template slot-scope="props">
                <b-table-column field="email" label="Email" searchable>
                  <img :src="getFaviconUrl('google.com')"/> {{ props.row.email}}
                </b-table-column>
                <b-table-column field="nickName" label="Nickname" searchable>
                  {{props.row.nickName}}
                </b-table-column>
                <b-table-column field="birthday" label="Age">
                  {{props.row.birthday | convertAgeRange}}
                </b-table-column>
                <b-table-column field="gender" label="Gender">
                  {{props.row.gender | convertGender}}
                </b-table-column>
                <b-table-column field="activatedDate" label="Activated Date">
                  {{props.row.activatedDate | convertDatetime}}
                </b-table-column>
                <b-table-column field="appVersion" label="App Version">
                  {{props.row.appVersion}}
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
                    <p>사용자 정보가 없습니다.</p>
                  </div>
                </section>
              </template>
              <template slot="detail" slot-scope="props">
                <user-detail :user="props.row"></user-detail>
              </template>
            </b-table>
          </section>
        </b-tab-item>
        <b-tab-item label="사용자 통계">
          <section style="margin-bottom: 10px">
            <Statistics v-if="activeTab === 2"></Statistics>
          </section>
        </b-tab-item>
      </b-tabs>
    </section>
  </div>
</template>

<script>
import request from '../../common/utils/http';
import usersUtil from '../../common/utils/users';
import moment from 'moment';
import UserDetail from '../components/UserDetail'
import ExcelDownloadForm from '../components/ExcelDownloadModal';
import Statistics from '../components/Statistics';
export default {
  name: 'Users',
  components: {
    UserDetail,
    Statistics
  },
  data() {
    return {
      search:{
        one:{
          type:'email',
          keyword:'',
        },
        multiple:{
          type:'email',
          keyword:'',
        },
        option:{
          types:[
            {text:'이메일', value:'email'},
            {text:'닉네임', value:'nickName'},
            {text:'유저 아이디', value:'userId'}
            ],
        }
      },
      checkedResult:{
        byAllUsers:[],
        byMultiple:[]
      },
      result:{
        getUser:[],
        getUsers:[],
        getAllUsers:[]
      },
      activeTab:0,
      emails: '',
      requestUsersCount:0,
      responseUsersCount:0,
      showErrorMessage: false,
      notMatchedUsers:[],
    };
  },
  watch:{
    'activeTab':{
      handler(value){
        if(value === 0 || value === 2){
          //active all Users
          this.getAllUsers();
        }
      },
      deep:true
    }
  },
  created() {
    this.getAllUsers();
  },
  filters:{
    convertAgeRange: function(value){
      return usersUtil.convertBirthDayToAgeRange(value);
    },
    convertGender: function(value){
      return usersUtil.convertGenderToString(value);
    },
    convertDatetime: function(value){
      return moment(value).format('YYYY-MM-DD(ddd) HH:mm:ss');
    },
    convertBirthDay: function(value){
      return usersUtil.convertBirthDayToAge(value);
    },
    convertJob: function(value) {
      return usersUtil.convertJobToString(value);
    },
    numberComma: function(value){
      return value ? value.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,") : '0';
    }
  },
  methods: {
    getSearchTypeText(value){
      let text = '';
      this.search.option.types.forEach(type => {
        if(type.value === value){
          text = type.text;
        }
      });
      return text;
    },
    validation(path){
      if(path === 'user'){
        return this.search.one.type && this.search.one.keyword;
      }else{
        return this.search.multiple.keyword.length > 0;
      }
    },
    getFaviconUrl(url){
      return 'http://www.google.com/s2/favicons?domain=' + url;
    },
    getAllUsers(){
      request.get('/api/users')
        .then(res => {
          this.checkedResult.byAllUsers = [];
          this.result.getAllUsers = res.data;
        })
        .catch(error => {
          this.$root.showErrorToast('회원 조회에 실패하였습니다.', error);
        });
    },
    getUsers(){
      this.showErrorMessage = false;
      this.notMatchedUsers = [];
      if(this.validation('users')) {
        const splitedKeywords = this.search.multiple.keyword ? this.search.multiple.keyword.split(/[,\s\n]+/) : [];
        const keywords = [];
        splitedKeywords.forEach(value => {
          const keyword = value.replace(/(\s*)/g, "");
          if(keyword.length > 0){
            keywords.push(keyword);
          }
        });
        if(keywords.length === 0){
          const text = this.getSearchTypeText(this.search.multiple.type);
          this.$root.showErrorToast(text + '을 1개이상 입력해주세요.', '');
          return;
        }
        const body = {
          type: this.search.multiple.type,
          keywords: keywords
        };
        this.requestUsersCount = keywords.length;
        request.post('/api/users/search', body)
          .then(res => {
            this.checkedResult.byMultiple = [];
            this.result.getUsers = res.data;
            this.responseUsersCount = this.result.getUsers.length;
            this.showErrorMessage = (this.requestUsersCount-this.responseUsersCount) > 0;
            if(this.showErrorMessage){
              console.log(keywords, res.data);
              this.checkNotMatchedUser(this.search.multiple.type, keywords, res.data)
            }
          })
          .catch(error => {
            this.$root.showErrorToast('회원 조회에 실패하였습니다.', error);
          });
      }else{
        this.$root.showErrorToast('이메일을 1개이상 입력해주세요.', '');
      }
    },
    getUser(){
      if(!this.validation('user')){
        return;
      }
      const params = {
        type : this.search.one.type,
        keyword : this.search.one.keyword
      }
      request.get('/api/users',{params}).then(res=>{
        this.result.getUser = res.data;
        console.log(res);
        if( this.result.getUser.length === 0){
          this.$root.showSuccessToast('사용자가 존재하지 않습니다.');
        }
      }).catch(error => {
        this.$root.showErrorToast('회원 조회에 실패하였습니다.', error);
      });
    },
    showExcelDownloadModal(type){
      const users = type === 'all' ? this.result.getUsers : this.checkedResult.byMultiple
      this.$buefy.modal.open({
        parent: this,
        props: {
          users: users
        },
        component: ExcelDownloadForm,
        hasModalCard: true,
        trapFocus: true,
        canCancel: ['escape','outside'],
      });
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
  .large{
    font-size:large;
  }
</style>
