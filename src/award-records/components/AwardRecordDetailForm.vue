<template>
  <div class="modal-card award-detail-container" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">수상자 정보 수정하기</p>
    </header>
    <div class="modal-card-body">
      <section>
        <div class="columns">
          <div class="column is-one-third">
            <b-field label="보상 유형">
              <b-select v-model="rewardType">
                <option v-for="option in options.rewardTypes" :key="option.key" :value="option.value.type">
                  {{ option.value.title }}
                </option>
              </b-select>
            </b-field>
          </div>
          <div class="column is-one-third">
            <b-field>
              <template slot="label">
                <span class="has-text-danger">*</span> 보상 설명
              </template>
              <b-input v-model="awardRecord.reward.description"></b-input>
            </b-field>
          </div>
          <div class="column is-one-third">
            <b-field label="보상 가격">
              <b-input v-model="awardRecord.reward.price"></b-input>
            </b-field>
          </div>
        </div>
      </section>
    </div>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$emit('close', false)">닫기</button>
      <button class="button is-primary" @click="update"><b>저장</b></button>
    </footer>
  </div>
</template>

<script>
  import httpRequest from '../../common/utils/http';
  export default {
    name: 'AwardRecordDetailForm',
    components: {},
    props:['value','options','rewardList'],
    watch:{
      'rewardList':{
        handler(value){
          this.rewardType = value[0].type ? value[0].type : 'best';
          this.options.rewardList = value;
        },
        deep:true
      },
      'rewardType':{
        handler(value){
          this.rewardList.forEach((e)=>{
            if(e.type === value){
              this.awardRecord.reward.description = e.content;
              this.awardRecord.reward.price = e.price;
            }
          })
          this.awardRecord.type = value;
        },
        deep:true
      },
    },
    data() {
      return {
        rewardType:'best',
        awardRecord:{
          _id: '',
          nickName:'',
          betaTestId:'',
          reward:{
            description:'',
            price:null
          }
        },
      };
    },
    created() {
    },
    mounted() {
      this.awardRecord = Object.assign({}, this.value);
      this.rewardType = this.awardRecord.type;
    },
    methods: {
      validate() {
        return this.awardRecord.reward.description.trim().length > 0;
      },
      update(){
        if(this.validate()){
          httpRequest.put('/api/award-records/'+this.awardRecord._id, this.awardRecord).then(res=>{
            this.$root.showSuccessToast('수상 내역을 정상적으로 수정하였습니다.');
            this.$emit('close', true);
          }).catch(err=>{
            this.$root.showErrorToast('수상 내역 수정에 실패하였습니다.', err);
          })
        }
      },
    },
  };
</script>

<style scoped>
  .award-detail-container{

  }
</style>
