<template>
  <section>
    <nav class="level">
      <div class="level-left">
      </div>
      <div class="level-right">
        <div class="level-item">
          <b-field grouped>
            <b-field>
              <b-select v-model="filterOptions.searchType">
                <option v-for="searchOption in options.searchInResult"
                        :key="searchOption.key"
                        :value="searchOption.key"
                >
                  {{searchOption.text}}
                </option>
              </b-select>
              <b-input v-model="filterOptions.keyword"
                       type="search"
                       style="width: 350px"
                       placeholder="결과내 검색하기" expanded>
              </b-input>
            </b-field>
          </b-field>
        </div>
        <div class="level-item">
          <b-button type='is-primary'
                    @click="openDialog('add', null)">의뢰 등록</b-button>
        </div>
        <div class="level-item">
          <b-button type='is-primary'
                    icon-left="refresh"
                    @click="init">의뢰 정보 새로 불러오기</b-button>
        </div>
      </div>
    </nav>
  <nav class="level">
    <div class="level-left"></div>
    <div class="level-right">
      <div class="level-item">
        <b-field>
          <b-radio-button v-model="filterOptions.status"
                          v-for="status in options.status"
                          :key="status.key"
                          :type="status.color"
                          :native-value="status.key"
                          size="is-small"
          >
            {{status.text}}({{ getItemCount(status.key)}})
          </b-radio-button>
        </b-field>
      </div>
      <div class="level-item">
        <b-field>
          <b-radio-button v-model="filterOptions.sortBy"
                          v-for="sortBy in options.sortBy"
                          :native-value="sortBy.value"
                          :key="sortBy.value"
                          size="is-small"
          >
            {{sortBy.text}}
          </b-radio-button>
        </b-field>
      </div>
      <div class="level-item">
        <b-field>
          <b-checkbox
            v-model="filterOptions.showCanceledItem"
            size="is-small"
          >의뢰취소된 항목만 보기</b-checkbox>
        </b-field>
      </div>
    </div>
  </nav>
  <div class="card request-card"
       v-for="request in filteredRequests"
       :key="request._id"
       style="margin-bottom: 10px"
       @click="showDetail(request._id)"
  >
    <div class="card-content">
      <div class="media">
        <div class="media-content">
          <div v-if="!request.isCancelled" style="position: absolute; right: 20px">
            <b-button class="is-small" type="is-danger" outlined @click.stop="cancelRequest(request._id)">의뢰 취소</b-button>
          </div>
          <p class="title is-4">{{request.game.title}}
            <b-tag :type="getStatus(request.status).color">{{getStatus(request.status).text}}</b-tag>
            <b-tag v-if="request.isCancelled" type="is-danger" style="margin-left:10px">의뢰 취소</b-tag>
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
            <p><strong class="has-text-primary">개발 진행 단계</strong><br>{{getDevProcess(request.game.devProcess).text}}</p>
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
  import RequestDetail from '../views/RequestDetail';

  export default {
    name: 'requestCardList.vue',
    props:{
    },
    data(){
      return{
        options:{
          sortBy:[
            {value:'{"key":"date", "value":"desc"}', text:'등록일 최신순'},
            {value:'{"key":"date", "value":"asc"}', text:'등록일 오래된 순'},
            {value:'{"key":"openDate", "value":"asc"}', text:'시작일 빠른 순'},
            {value:'{"key":"openDate", "value":"desc"}', text:'시작일 느린 순'}
          ],
          searchInResult:[
            {key:'gameTitle',text:'게임 타이틀'},
            {key:'operatorName',text:'운영 담당자'},
            {key:'plan',text:'플랜'},
            {key:'company',text:'게임 회사'},
          ],
          status:[
            {key: 'total', color:'is-primary', text:'전체'},
            {key: 'received', color:'is-info', text:'의뢰 접수'},
            {key: 'confirming', color:'is-info', text:'의뢰 확인중'},
            {key: 'preparing', color:'is-success', text:'테스트 준비중'},
            {key: 'ready', color:'is-success', text:'테스트 오픈 대기'},
            {key: 'open', color:'is-success', text:'테스트 진행'},
            {key: 'gathering', color:'is-warning', text:'결과 취합중'},
            {key: 'reported', color:'is-warning', text:'결과서 전달'},
            {key: 'awarding', color:'is-link', text:'시상식 준비중'},
            {key: 'completed', color:'is-dark', text:'완료'}
          ],
          devProcess:[
            {key:1000, text: '기획 & 컨셉 정의'},
            {key:2000, text: '프로토 타입'},
            {key:3000, text: '출시 전'},
            {key:4000, text: '베타 출시'},
            {key:5000, text: '정식 출시'}
          ],
          plan:[
            {key:'trial', text:'Trial'},
            {key:'starter', text:'Starter'},
            {key:'lite', text:'Lite'},
            {key:'simple', text:'Simple'},
            {key:'standard', text:'Standard'},
          ],
        },
        requests:[],
        filteredRequests:[],
        filterOptions:{
          sortBy: '{"key":"date", "value":"desc"}',
          status:'total',
          keyword:'',
          searchType:'gameTitle',
          showCanceledItem: false
        },
        defaultCount:{
          total:0,
          received : 0,
          confirming: 0,
          preparing: 0,
          ready: 0,
          open: 0,
          gathering: 0,
          reported: 0,
          awarding: 0,
          completed: 0,
          cancel: 0
        },
        counts:{
          active:{},
          cancel:{}
        },

      }
    },
    watch:{
      filterOptions:{
        handler(obj){
          const options = obj;
          this.filtered(options.status, this.requests, options.showCanceledItem);
        },
        deep:true
      }
    },
    created() {
      this.init();
    },
    methods:{
      initCounts(){
        this.counts.active = Object.assign({}, this.defaultCount);
        this.counts.cancel = Object.assign({}, this.defaultCount);
      },
      init(){
        this.initCounts();
        httpRequest.get('/api/requests')
          .then(res => {
            res.data.forEach((item)=>{
              const stat = item.isCancelled ? 'cancel' : 'active';
              this.counts[stat][item.status] = this.counts[stat][item.status] + 1;
              this.counts[stat].total = this.counts[stat].total + 1;
            });
            this.requests = res.data;
            this.filtered('total', this.requests, false);
          })
          .catch(error => {
            this.$root.showErrorToast('의뢰 항목 조회에 실패하였습니다.', error);
          });
      },
      getStatus(value){
        return this.options.status.filter(s => s.key === value)[0];
      },
      getDevProcess(value){
        const devProcess =  this.options.devProcess.filter(s => s.key === value);
        return devProcess.length ? devProcess[0] : value;
      },
      getItemCount(key){
        const stat = this.filterOptions.showCanceledItem ? 'cancel' : 'active'
        return this.counts[stat][key] ? this.counts[stat][key] : 0;
      },
      filtered(status, items, onlyCancelled){
       if(!items){
          items = this.requests;
        }
       if(onlyCancelled){
         items = items.filter(i=> i.isCancelled);
       }
        this.filterOptions.status = status;
        const sortBy = JSON.parse(this.filterOptions.sortBy);
        const type = this.filterOptions.searchType;
        const keyword =  this.filterOptions.keyword;
        items.sort((a,b)=>{
          if(sortBy.value === 'asc'){
            return this.sortByAsc(a,b,sortBy.key);
          }else{
            return this.sortByDesc(a,b,sortBy.key);
          }
        });
        if(this.filterOptions.status  === 'total'){
          this.filteredRequests = items.filter((item)=>{
            return this.checkKeyword(type, keyword, item);
          });
        }else{
          this.filteredRequests = items.filter((item) => item.status === status).filter((item)=>{
            return this.checkKeyword(type, keyword, item);
          });
        }
      },
      checkKeyword(type, keyword, item){
        if(keyword.length === 0){
          return true;
        }
        if(type === 'gameTitle'){
          return item.game.title.includes(keyword);
        }else if(type === 'company'){
          return item.company.name.includes(keyword);
        }else{
          return item[type].includes(keyword);
        }
      },
      sortByAsc(a, b, key){
        if(key.toLowerCase().indexOf('date') > -1){
          const convertedA = new Date(a[key]).getTime();
          const convertedB = new Date(b[key]).getTime();
          return convertedA < convertedB ? -1 : convertedA > convertedB ? 1 : 0;
        }
        return a[key] < b[key];
      },
      sortByDesc(a, b, key){
        if(key.toLowerCase().indexOf('date') > -1){
          const convertedA = new Date(a[key]).getTime();
          const convertedB = new Date(b[key]).getTime();
          return convertedA > convertedB ? -1 : convertedA < convertedB ? 1 : 0;
        }
        return a[key] > b[key];
      },
      openDialog(type, value){
        this.$buefy.modal.open({
          parent: this,
          props: {
            value,
            type,
            options: this.options
          },
          component: RequestDetailForm,
          hasModalCard: true,
          trapFocus: true,
          fullScreen: true,
          canCancel: false,
          events: {
            close: (options) => { this.closeForm(options); },
          },
        });
      },
      showDetail(id) {
        const url = '/api/requests/' + id;
        httpRequest.get(url)
          .then(res => {
            const value = res.data;
            value.openDate = new Date(value.openDate);
            value.date = new Date(value.date);
            this.openDialog('modify', value);
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
      },
      closeForm(refresh){
        if(refresh){
          this.init();
        }
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
