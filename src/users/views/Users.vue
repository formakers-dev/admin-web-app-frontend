<template>
  <div style="word-break: break-all;">
    <h1 class="title">사용자 정보 조회</h1>
    <section>
      <b-tabs v-model="activeTab" type="is-boxed" :animated="false">
        <b-tab-item label="한 명 조회하기">
          <div class="level">
            <div class="level-left">
              <div class="level-item">
                <b-field grouped>
                    <b-field>
                      <b-select v-model="search.type">
                        <option v-for="option in search.option.types" :key="option.value" :value="option.value">
                          {{ option.text }}
                        </option>
                      </b-select>
                      <b-input type="search"
                               v-model="search.keyword"
                               style="width: 380px"
                               @keyup.native.enter="getUser"
                               required>
                      </b-input>
                      <p class="control">
                        <button class="button is-primary" @click="getUser">조회</button>
                      </p>
                    </b-field>
                </b-field>
              </div>
            </div>
          </div>
          <user-detail :users="result.getUser"></user-detail>
        </b-tab-item>
        <b-tab-item label="여러명 조회하기">
          <section style="margin-bottom: 10px">
            <p><strong>이메일을 1개 이상 입력해주세요.</strong></p>
              <b-field grouped style="width: 100%">
                <b-field style="width: 100%">
                  <b-input type="textarea"
                           v-model="emails"
                           style="width: 100%"
                           placeholder="각 이메일들은 쉼표(,)나 엔터로 구분해주세요."
                  >
                  </b-input>
                  <p class="control">
                    <button class="button is-primary"
                            style="height: 100%"
                            @click="getUsers">조회</button>
                  </p>
                </b-field>
              </b-field>
          </section>
          <div class="level" style="margin-bottom: 10px;">
            <div class="level-left">
            </div>
            <div class="level-right">
              <div class="level-item">
                <b-button type="is-success"
                          size="is-medium"
                          icon-left="download"
                          @click="showExcelDownloadModal"
                          :disabled="result.getUsers.length === 0"
                >Download</b-button>
              </div>
            </div>
          </div>
          <b-message v-if="showErrorMessage" type="is-danger">
            총 {{requestUsersCount}}명의 사용자 중 {{requestUsersCount - responseUsersCount}} 명의 사용자 정보조회를 실패하였습니다.
          </b-message>
          <section style="margin-bottom: 10px">
            <b-table
              ref="usersTable"
              :data="result.getUsers"
              :loading="isLoading"
              :bordered="false"
              :hoverable="true"
              :show-detail-icon="false"
              :checked-rows.sync="checkedResult"
              default-sort="userId"
              sticky-header
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
                <b-table-column field="provider" label="Provider">
                  {{props.row.provider}}
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
                <section v-if="!isLoading" class="section">
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
            <user-detail :users="checkedResult"></user-detail>
          </section>
        </b-tab-item>
      </b-tabs>
    </section>
  </div>
</template>

<script>
import request from '../../common/utils/http';
import moment from 'moment';
import UserDetail from '../components/UserDetail'
import ExcelDownloadForm from '../components/ExcelDownloadModal';
export default {
  name: 'Users',
  components: {
    UserDetail,
  },
  data() {
    return {
      search:{
        type:'email',
        keyword:'',
        option:{
          types:[{text:'Email', value:'email'}, {text:'Nickname', value:'nickName'}, {text:'User ID', value:'userId'}],
        }
      },
      checkedResult:[],
      result:{
        getUser:[],
        getUsers:[]
      },
      activeTab:0,
      emails: '',
      isLoading: false,
      requestUsersCount:0,
      responseUsersCount:0,
      showErrorMessage: false,
    };
  },
  filters:{
    convertAgeRange: function(value){
      const age = new Date().getFullYear() - value + 1;
      return Math.floor(age/10)*10 +'대';
    },
    convertGender: function(value){
      return value === 'male' ? "남성" : "여성";
    },
    convertDatetime: function(value){
      return moment(value).format('YYYY-MM-DD (ddd) HH:mm:ss');
    },
    convertBirthDay: function(value){
      const age = new Date().getFullYear() - value + 1;
      return age + "세(" + value + ")"
    }
  },
  methods: {
    validation(path){
      if(path === 'user'){
        return this.search.type && this.search.keyword;
      }else{
        return this.emails.length > 0;
      }
    },
    getFaviconUrl(url){
      return 'http://www.google.com/s2/favicons?domain=' + url;
    },
    getUsers(){
      this.showErrorMessage = false;
      if(this.validation('users')) {
        this.isLoading = true;
        const keywords = this.emails ? this.emails.split(/[,\s\n]+/) : [];
        const body = {
          keywords: keywords
        };
        this.requestUsersCount = keywords.length;
        request.post('/users/search', body)
          .then(res => {
            this.checkedResult = [];
            this.result.getUsers = res.data;
            this.isLoading = false;
            this.responseUsersCount = this.result.getUsers.length;
            this.showErrorMessage = (this.requestUsersCount-this.responseUsersCount) > 0;
          })
          .catch(error => {
            this.isLoading = false;
            this.showErrorToast('회원 조회에 실패하였습니다.', error);
          });
      }else{
        this.showErrorToast('이메일을 1개이상 입력해주세요.', '');
      }
    },
    getUser(){
      if(!this.validation('user')){
        return;
      }
      const params = {
        type : this.search.type,
        keyword : this.search.keyword
      }
      request.get('/users',{params}).then(res=>{
        this.result.getUser = res.data;
        console.log(res);
        if( this.result.getUser.length === 0){
          this.showSuccessToast('사용자가 존재하지 않습니다.');
        }
      }).catch(error => {
        this.showErrorToast('회원 조회에 실패하였습니다.', error);
      });
    },
    showSuccessToast(message) {
      this.$buefy.toast.open({
        message: message,
        type: 'is-success',
      });
    },
    showErrorToast(message, error) {
      this.$buefy.toast.open({
        message: message,
        type: 'is-danger',
      });
      console.log(error);
    },
    showExcelDownloadModal(){
      this.$buefy.modal.open({
        parent: this,
        props: {
          users: this.result.getUsers,
          checkedUsers: this.checkedResult
        },
        component: ExcelDownloadForm,
        hasModalCard: true,
        trapFocus: true,
        canCancel: ['escape','outside'],
      });
    }
  },
};
</script>

<style scoped>
  .large{
    font-size:large;
  }
</style>
