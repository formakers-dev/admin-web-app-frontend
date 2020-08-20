<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">수상 내역 정보</p>
    </header>
    <div class="modal-card-body">
      <section style="width: 100%">
        <div class="columns">
          <div class="column">
            <div class="notification is-primary">
              <p class="title is-5">{{ convertedType(9000) }}</p>
              <p class="title is-4 has-text-right">
              {{ awardRecords.filter(awardRecord => awardRecord.typeCode === 9000).length }} 회
              </p>
            </div>
          </div>
          <div class="column">
            <div class="notification is-info">
              <p class="title is-5">{{ convertedType(7000) }}</p>
              <p class="title is-4 has-text-right">
                {{ awardRecords.filter(awardRecord => awardRecord.typeCode === 7000).length }} 회
              </p>
            </div>
          </div>
          <div class="column">
            <div class="notification is-warning">
              <strong>{{ convertedType(5000) }}</strong><br/>
              <strong>+ {{ convertedType(5001) }}</strong>
              <p class="title is-4 has-text-right">
                {{ awardRecords.filter(awardRecord => awardRecord.typeCode === 5000 || awardRecord.typeCode === 5001).length }} 회
              </p>
            </div>
          </div>
          <div class="column">
            <div class="notification is-black">
              <p class="title is-5">{{ convertedType(3000) }}</p>
              <p class="title is-4 has-text-right">
                {{ awardRecords.filter(awardRecord => awardRecord.typeCode === 3000).length }} 회
              </p>
            </div>
          </div>
        </div>
        <b-table
          ref="awardRecordsTableForUsers"
          :data="awardRecords"
          :bordered="false"
          :hoverable="true"
          :paginated="true"
          per-page="10"
          :pagination-simple="false"
          pagination-position="bottom"
        >
          <template slot-scope="props">
            <b-table-column field="userId" label="User ID">
              {{props.row.userId}}
            </b-table-column>
            <b-table-column field="nickName" label="닉네임">
              {{ props.row.nickName }}
            </b-table-column>
            <b-table-column field="type" label="게임 타이틀">
              {{ props.row.betaTest[0].title }}
            </b-table-column>
            <b-table-column field="type" label="수상 유형">
              {{ convertedType(props.row.typeCode) }}
            </b-table-column>
            <b-table-column field="reward.description" label="보상 설명">
              {{ props.row.reward.description }}
            </b-table-column>
            <b-table-column field="reward.price" label="보상 금액">
              {{ props.row.reward.price ? props.row.reward.price : '-'}}
            </b-table-column>
          </template>
        </b-table>
      </section>
    </div>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">닫기</button>
      <b-button type="is-success"
                icon-left="download"
                @click="exportAwardRecords"
                style="margin-left: 10px"
      >수상 내역 다운로드 (.xlsx)</b-button>
    </footer>
  </div>
</template>

<script>
  import XLSX from 'xlsx';
  import moment from 'moment';
export default {
  name: 'AwardRecords',
  props: {
    awardRecords: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      options:{
        rewardTypes:[
          {key:9000, value:{typeCode:9000, title:'테스트 수석'}},
          {key:7000, value:{typeCode:7000, title:'테스트 차석'}},
          {key:5001, value:{typeCode:5001, title:'성실 보너스'}},
          {key:5000, value:{typeCode:5000, title:'테스트 성실상'}},
          {key:3000, value:{typeCode:3000, title:'참가상'}},
          {key:1000, value:{typeCode:1000, title:'기타'}},
        ],
      }
    };
  },
  watch:{
  },
  created() {
  },
  mounted() {
    console.log(this.awardRecords)
  },
  methods: {
    convertedType(typeCode){
      for(let i=0; i<this.options.rewardTypes.length; i++){
        if(this.options.rewardTypes[i].key === typeCode){
          return this.options.rewardTypes[i].value.title;
        }
      }
    },
    exportAwardRecords(){
      const data = [];
      this.awardRecords.forEach((e)=>{
        data.push({
          userId: e.userId,
          nickName: e.nickName,
          type: e.type,
          typeCode: e.typeCode,
          description: e.reward.description,
          price: e.reward.price
        });
      });
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws);

      const date = moment(new Date()).format('YYYYMMDDHHmmss');
      const filename = this.awardRecords[0].nickName + '- 수상 내역정보('+date+').xlsx';
      XLSX.writeFile(wb, filename);
    },
  },
};
</script>

<style scoped>
</style>
