<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">수상 내역 정보</p>
    </header>
    <div class="modal-card-body">
      <section style="width: 100%">
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
              {{ convertedType(props.row.type) }}
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
          {key:'best', value:{type:'best', title:'테스트 수석', iconImageUrl:'https://i.imgur.com/ybuI732.png', content:'문화상품권 3만원', price: 30000, count: 1}},
          {key:'good', value:{type:'good', title:'테스트 차석', iconImageUrl:'https://i.imgur.com/6RaZ7vI.png', content:'문화상품권 5천원', price: 5000, count: 1}},
          {key:'normal', value:{type:'normal', title:'테스트 성실상', iconImageUrl:'https://i.imgur.com/btZZHRp.png', content:'문화상품권 1천원', price: 1000}},
          {key:'participated', value:{type:'participated', title:'참가상', iconImageUrl:'', content:''}},
          {key:'etc', value:{type:'etc', title:'기타', iconImageUrl:'', content:''}},
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
    convertedType(type){
      for(let i=0; i<this.options.rewardTypes.length; i++){
        if(this.options.rewardTypes[i].key === type){
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
