<template>
  <section>
  <div class="card"
       v-for="result in details"
       :key="result.userId"
       style="margin-bottom: 10px"
  >
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <p class="title is-4">{{result.nickName}}
            <b-button size="is-small" type="is-dark" @click="$root.copy(result.nickName)">복사</b-button>
          </p>
          <p class="subtitle is-6" style="color:gray">
            {{result.email}}
            <b-button size="is-small" type="is-dark" @click="$root.copy(result.email)">복사</b-button>
          </p>
        </div>
      </div>
      <br>
      <div class="content">
        <div class="columns">
          <div class="column is-one-quarter">
            <p><strong class="large">User ID</strong><br>{{result.userId}}</p>
          </div>
          <div class="column is-one-quarter">
            <p><strong class="large">Name</strong><br>{{result.name}}</p>
          </div>
          <div class="column is-one-quarter">
            <p><strong class="large">Birthday</strong><br>{{result.birthday | convertBirthDay}}</p>
          </div>
          <div class="column is-one-quarter">
            <p><strong class="large">Gender</strong><br>{{result.gender | convertGender}}</p>
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter">
            <p><strong class="large">Job</strong><br>{{result.job}}</p>
          </div>
          <div class="column is-one-quarter">
            <p><strong class="large">Provider</strong><br>
              {{result.provider}}
            </p>
          </div>
          <div class="column is-one-quarter">
            <p><strong class="large">Provider ID</strong><br>{{result.providerId}}</p>
          </div>
          <div class="column is-one-quarter">
            <p><strong class="large">Last Stats Update Time</strong><br>{{result.lastStatsUpdateTime | convertDatetime}}</p>
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter">
            <p><strong class="large">Sign Up Time</strong><br>{{result.signUpTime | convertDatetime}}</p>
          </div>
          <div class="column is-one-quarter">
            <p><strong class="large">Activated Date</strong><br>{{result.activatedDate | convertDatetime}}</p>
          </div>
          <div class="column is-one-quarter">
            <p><strong class="large">App Version</strong><br>{{result.appVersion}}</p>
          </div>
          <div class="column is-one-quarter">
            <p><strong class="large">Device Menufacturer</strong><br>{{result.device ? result.device.manufacturer : ''}}</p>
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter">
            <p><strong class="large">Device Model</strong><br>{{result.device ? result.device.model : ''}}</p>
          </div>
          <div class="column is-one-quarter">
            <p><strong class="large">Device OS Version</strong><br>{{result.device ? result.device.osVersion : ''}}</p>
          </div>
          <div class="column is-one-quarter">
            <p><strong class="large">Registration Token</strong><br>{{result.registrationToken ? result.registrationToken : ''}}</p>
          </div>
          <div class="column is-one-quarter">
            <p><strong class="large">Life Apps</strong><br>
              <b-taglist>
                <b-tag type="is-primary"
                       v-for="lifeApp in result.lifeApps"
                       :key="lifeApp"
                >{{lifeApp}}</b-tag>
              </b-taglist>
            </p>
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-quarter">
            <p><strong class="large">Wish List</strong><br>
              <b-taglist>
                <b-tag type="is-primary"
                       v-for="wish in result.wishList"
                       :key="wish"
                >{{wish}}</b-tag>
              </b-taglist>
            </p>
          </div>
          <div class="column is-one-quarter">
            <p><strong class="large">Award Records</strong><br>
              <b-button type="is-primary" @click="showAwardRecords(result.userId)">수상내역 조회</b-button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  </section>
</template>

<script>
  import moment from 'moment';
  import request from '../../common/utils/http';
  import AwardRecords from './AwardRecords';
  export default {
    name: 'UserDetail.vue',
    props:{
      users:{
        type: Array,
        default() {
          return [];
        },
      },
      user:{
        type: Object,
        default() {
          return null
        }
      },
    },
    data(){
      return{
        details:[]
      }
    },
    watch:{
      users:{
        handler(value){
          this.details = [];
          this.details = value;
        },
        deep: true
      }
    },
    mounted() {
      if(this.user){
        this.details.push(this.user);
      }else{
        this.details = this.users;
      }
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
        const age = new Date().getFullYear() - value;
        return '만 ' + age + "세(" + value + ")"
      }
    },
    methods:{
      showAwardRecords(id){
        request.get('/api/award-records/user/' + id).then((res)=>{
          if(res.data.awardRecords.length === 0){
            this.$root.showToast('수상 내역이 존재하지 않습니다.', 'is-primary');
          }else{
            this.$buefy.modal.open({
              parent: this,
              props: {
                awardRecords: res.data.awardRecords
              },
              component: AwardRecords,
              hasModalCard: true,
              trapFocus: true,
              canCancel: false,
              events: {
              }})
          }
        }).catch((err)=>{
          this.$root.showErrorToast('수상 내역 조회에 실패하였습니다.', err);
        });
      }
    }
  };
</script>

<style scoped>
</style>
