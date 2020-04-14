<template>
  <section>
  <div class="card request-card"
       v-for="request in requests"
       :key="request._id"
       style="margin-bottom: 10px"
       @click="showDetail(request._id)"
  >
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <div v-if="request.status != 'cancel'" style="position: absolute; right: 20px">
            <b-button class="is-small" type="is-danger" outlined @click.stop="cancelRequest(request._id)">의뢰 취소</b-button>
          </div>
          <p class="title is-4">{{request.game.title}}
            <b-tag :type="getStatusColor(request.status)">{{convertStatus(request.status)}}</b-tag>
          </p>
          <p v-if="request.operatorName" class="subtitle is-6" style="color:gray" >
            <strong>운영 담당자</strong> {{request.operatorName}}
          </p>
        </div>
      </div>
      <br>
      <div class="content">
        <div class="columns">
          <div class="column is-one-fifth">
            <p><strong class="has-text-primary">의뢰 날짜</strong><br>{{request.date | convertDatetime}}</p>
          </div>
          <div class="column is-one-fifth">
            <p><strong class="has-text-primary">의뢰 희망 테스터 인원 수</strong><br>{{request.numberOfTester}} 명</p>
          </div>
          <div class="column is-one-fifth">
            <p><strong class="has-text-primary">플랜</strong><br>{{convertPlan(request.plan)}}</p>
          </div>
          <div class="column is-one-fifth">
            <p><strong class="has-text-primary">시작일</strong><br>{{request.openDate | convertDatetime}}</p>
          </div>
          <div class="column is-one-fifth">
            <p><strong class="has-text-primary">테스트 진행 일 수</strong><br>{{request.duration}} 일</p>
          </div>
        </div>
        <div class="columns">
          <div class="column is-one-fifth">
            <p><strong class="has-text-primary">유저정보 구매 여부</strong><br>{{request.isIncludedUserData ? '네' : '아니요'}}</p>
          </div>
          <div class="column is-one-fifth">
            <p><strong class="has-text-primary">커스터마이징 구매 여부</strong><br>{{request.isIncludedCustomizing ? '네' : '아니요'}}</p>
          </div>
          <div class="column is-one-fifth">
            <p><strong class="has-text-primary">개발 진행 단계</strong><br>{{convertDevProcess(request.game.devProcess)}}</p>
          </div>
          <div class="column is-one-fifth">
            <p><strong class="has-text-primary">게임회사</strong><br>{{request.company.name}}</p>
          </div>
          <div class="column is-one-fifth">
            <p><strong class="has-text-primary">게임회사 규모</strong><br>{{request.company.numberOfEmployee}} 명</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  </section>
</template>

<script>
  import moment from 'moment';
  import httpRequest from '../../common/utils/http';
  import RequestDetailForm from '../components/RequestDetailForm';

  export default {
    name: 'requestCardList.vue',
    props:{
      items:{
        type: Array,
        default() {
          return [];
        },
      },
    },
    data(){
      return{
        requests:[],
        options:{
          status:{
            received: {color:'is-danger', text:'접수'},
            processing: {color:'is-primary', text:'처리중'},
            completed: {color:'is-warning', text:'종료'},
            cancel: {color:'is-dark', text:'취소'}
          },

          devProcess:{
            '1000': '기획 & 컨셉 정의',
            '2000': '프로토 타입',
            '3000': '출시 전',
            '4000': '베타 출시',
            '5000': '정식 출시'
          }
        }
      }
    },
    watch:{
      items:{
        handler(value){
          this.requests = [];
          this.requests = value;
        },
        deep: true
      }
    },
    mounted() {
      this.requests = this.items;
    },
    methods:{
      convertStatus(value){
        return this.options.status[value] ? this.options.status[value].text : value;
      },
      convertDevProcess(value){
        return this.options.devProcess[value] ? this.options.devProcess[value] : value;
      },
      getStatusColor(value){
        return this.options.status[value] ? this.options.status[value].color : 'is-info';
      },
      showDetail(id) {
        const url = '/api/requests/' + id;
        httpRequest.get(url)
          .then(res => {
            const value = res.data;
            value.openDate = new Date(value.openDate);
            value.date = new Date(value.date);
            this.$buefy.modal.open({
              parent: this,
              props: {
                value,
                type: 'modify'
              },
              component: RequestDetailForm,
              hasModalCard: true,
              trapFocus: true,
              canCancel: false,
              events: {
                close : () => this.$emit('refresh')
              },
            });
          })
          .catch(error => {
            this.$root.showErrorToast('의뢰 상세 조회에 실패하였습니다.', error);
        });
      },
      cancelRequest(id){
        const url = '/api/requests/'+id;
        httpRequest.delete(url).then(res=>{
          this.$root.showSuccessToast('정상적으로 의뢰 취소하였습니다.');
          this.$emit('refresh');
        }).catch(error=>{
          this.$root.showErrorToast('의뢰 취소에 실패하였습니다.', error);
        });
      },
      convertPlan(value){
        let plan = "";
        for(let i = 0; i < value.length; i++){
          if(i === 0){
            plan += value[i].toUpperCase();
          }else{
            plan += value[i];
          }
        }
        return plan;
      }
    },
    filters:{
      convertDatetime: function(value){
        return moment(value).format('YYYY-MM-DD (ddd) HH:mm:ss');
      }
    },
  };
</script>

<style scoped>
  .request-card:hover{
    box-shadow: 0 0 11px rgba(0,0,0,.5);
    cursor: pointer;
  }
</style>
