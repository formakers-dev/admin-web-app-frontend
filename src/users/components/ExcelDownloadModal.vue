<template>
  <div class="modal-card noti-info-container">
    <header class="modal-card-head">
      <p class="modal-card-title">엑셀 파일 다운로드 정보</p>
    </header>
    <section class="modal-card-body">
      <section>
        <p><strong>선택한 컬럼만 출력 됩니다.</strong></p>
        <div class="columns is-multiline" style="margin-top:10px">
          <div class="column is-one-quarter"
               v-for="column in columns"
               :key="column.value"
          >
          <b-checkbox v-model="selectedColumn"
                      :native-value="column.value">
            {{column.text}}
          </b-checkbox>
        </div>
          <div class="column is-one-quarter">
            <b-checkbox v-model="checkedTotal">
              전체
            </b-checkbox>
          </div>
        </div>
      </section>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$emit('close')">닫기</button>
      <button class="button is-primary"
              @click="download">다운로드</button>
    </footer>
  </div>
</template>

<script>
  import XLSX from 'xlsx';
  import moment from 'moment';

  export default {
    name: 'ExcelDownloadModal',
    components: {
    },
    props: {
      users: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data() {
      return {
        usersForDownload:[],
        columns:[
          {text:'Email', value:'email'},
          {text:'Nickname', value:'nickName'},
          {text:'User ID', value:'userId'},
          {text:'Provider', value:'provider'},
          {text:'Provider ID', value:'providerId'},
          {text:'Registration Token', value:'registrationToken'},
          {text:'Sign Up Time', value:'signUpTime'},
          {text:'Birthday', value:'birthday'},
          {text:'Gender', value:'gender'},
          {text:'Life Apps', value:'lifeApps'},
          {text:'Last stats Update Time', value:'lastStatsUpdateTime'},
          {text:'Wish List', value:'wishList'},
          {text:'Activated Date', value:'activatedDate'},
          {text:'App Version', value:'appVersion'},
          {text:'Device Manufacturer', value:'manufacturer'},
          {text:'Device Model', value:'model'},
          {text:'Device OS Version', value:'osVersion'},
        ],
        selectedColumn:['email','nickName'],
        totalColumn:[
          'email','nickName','provider','providerId','registrationToken','signUpTime',
          'birthday','gender','lifeApps','lastStatsUpdateTime','wishList','activatedDate',
          'appVersion','manufacturer','model','osVersion','userId'
        ],
        tempSelectedColumn:['email','nickName'],
        checkedTotal:false,
      };
    },
    mounted() {
      this.usersForDownload = this.users;
    },
    watch:{
      checkedTotal:function(value){
        if(value){
          this.tempSelectedColumn = this.selectedColumn;
          this.selectedColumn = this.totalColumn;
        }else{
          this.selectedColumn = this.tempSelectedColumn;
        }
      }
    },
    methods: {
      download(){
        const filteredData = [];
        this.usersForDownload.forEach(user => {
          const filtered = {};
          this.selectedColumn.forEach(col => {
            if(col === 'manufacturer' || col === 'model' || col === 'osVersion'){
              filtered[col] = user['device'][col];
            }else if(col === 'wishList' || col === 'lifeApps'){
              filtered[col] = user[col].join(',');
            }else{
              filtered[col] = user[col];
            }
          });
          filteredData.push(filtered);
        });
        this.export(filteredData);
        this.$emit('close');
      },
      export(data){
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws);

        const date = moment(new Date()).format('YYYYMMDDHHmmss');
        const filename = '사용자정보조회('+date+').xlsx';
        XLSX.writeFile(wb, filename);
      },
    },
  };
</script>

<style scoped>
  .noti-info-container {
    width: auto;
  }
</style>
