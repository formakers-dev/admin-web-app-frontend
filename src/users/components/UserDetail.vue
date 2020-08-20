<template>
  <section>
  <div class="card"
       v-for="result in details"
       :key="result.userId"
       style="margin-bottom: 10px"
  >
    <div class="card-content">
      <div>
        <p class="title is-4">
          {{result.nickName}}
          <b-button size="is-small is-rounded" type="is-gray" @click="$root.copy(result.nickName)">
            복사
          </b-button>
        </p>
        <div class="subtitle is-6" style="color:gray">
          <div>
            {{result.email}}
            <b-button size="is-small is-rounded" type="is-gray" @click="$root.copy(result.email)">복사
            </b-button>
          </div>
          <div>
            {{result.userId}}
            <b-button size="is-small is-rounded" type="is-gray" @click="$root.copy(result.userId)">
              복사
            </b-button>
          </div>
        </div>
      </div>
      <br>
      <div class="content">
        <div class="columns">
          <div class="column is-one-quarter">
            <p><strong class="large">이름</strong><br>{{result.name}}</p>
          </div>
          <div class="column is-one-quarter">
            <p><strong class="large">출생연도</strong><br>{{result.birthday | convertBirthDay}}</p>
          </div>
          <div class="column is-one-quarter">
            <p><strong class="large">성별</strong><br>{{result.gender | convertGender}}</p>
          </div>
          <div class="column is-one-quarter">
            <p><strong class="large">직업</strong><br>{{result.job}}</p>
          </div>
        </div>
        <div class="box">
          <b-field label="🏃‍♀️포메스 활동 데이터"></b-field>
          <div class="columns">
            <div class="column is-one-quarter">
              <p><strong class="large">인생 게임</strong><br>
                <b-taglist>
                  <b-tag type="is-primary"
                         v-for="lifeApp in result.lifeApps"
                         :key="lifeApp"
                  >{{lifeApp}}
                  </b-tag>
                </b-taglist>
              </p>
            </div>
            <div class="column is-one-quarter">
              <p><strong class="large">즐겨찾는 게임 (포메스 > 추천게임)</strong><br>
                <b-taglist>
                  <b-tag type="is-primary"
                         v-for="wish in result.wishList"
                         :key="wish"
                  >{{wish}}
                  </b-tag>
                </b-taglist>
              </p>
            </div>
            <div class="column is-one-quarter">
              <p><strong class="large">역대 수상 내역</strong><br>
                <b-button type="is-primary" @click="showAwardRecords(result.userId)">조회</b-button>
              </p>
            </div>
          </div>
        </div>
        <div class="box">
        <b-field label="📃포메스 앱 관련 데이터"/>
          <div class="columns">
            <div class="column is-one-quarter">
              <p><strong class="large">가입일자</strong><br>{{result.signUpTime | convertDatetime}}</p>
            </div>
            <div class="column is-one-quarter">
              <p><strong class="large">활성 시각</strong><br>{{result.activatedDate | convertDatetime}}</p>
            </div>
            <div class="column is-one-quarter">
              <p><strong class="large">마지막 데이터 전송 시각</strong><br>{{result.lastStatsUpdateTime |
                convertDatetime}}</p>
            </div>
            <div class="column is-one-quarter">
              <p><strong class="large">포메스 앱 버전</strong><br>{{result.appVersion}}</p>
            </div>
          </div>
        </div>
        <div class="box">
          <b-field label="📱디바이스 정보"/>
          <div class="columns">
            <div class="column">
              <p><strong class="large">제조사</strong> {{result.device ? result.device.manufacturer
                : ''}}</p>
            </div>
            <div class="column">
              <p><strong class="large">모델명</strong> {{result.device ? result.device.model : ''}}
              </p>
            </div>
            <div class="column">
              <p><strong class="large">OS버전</strong> {{result.device ? result.device.osVersion :
                ''}}</p>
            </div>
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
  import usersUtil from '../../common/utils/users';
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
        return usersUtil.convertBirthDayToAgeRange(value);
      },
      convertGender: function(value){
        return usersUtil.convertGenderToString(value);
      },
      convertDatetime: function(value){
        return moment(value).format('YYYY-MM-DD (ddd) HH:mm:ss');
      },
      convertBirthDay: function(value){
        return usersUtil.convertBirthDayToAge(value);
      },
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
