<template>
  <div class="modal-card award-record-detail-container" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">수상 정보 수정하기</p>
    </header>
    <div class="modal-card-body">
      <section style="width: 100%">
        <b-field label="userId" horizontal>
          {{ awardRecord.userId }}
        </b-field>

        <b-field label="닉네임" horizontal>
          {{ awardRecord.nickName }}
        </b-field>

        <div class="columns is-multiline">
          <div class="column">
            <b-field >
              <template slot="label">
                <span class="has-text-danger">*</span> 보상 유형
              </template>
              <b-select v-model="awardRecord.typeCode" expanded required>
                <option v-for="option in options.rewardTypes" :key="option.key" :value="option.value.typeCode">
                  {{ option.value.title }}
                </option>
              </b-select>
            </b-field>
          </div>
          <div class="column">
            <b-field>
              <template slot="label">
                <span class="has-text-danger">*</span> 보상 설명
              </template>
              <b-input v-model="awardRecord.reward.description" required></b-input>
            </b-field>
          </div>
          <div class="column">
            <b-field>
              <template slot="label">
                <span class="has-text-danger">*</span> 보상 가격
              </template>
              <b-input v-model="awardRecord.reward.price" required></b-input>
            </b-field>
          </div>
          <div class="column">
            <b-field>
              <template slot="label">
                <span class="has-text-danger">*</span> 보상 지급 유형
              </template>
              <div>
                <b-select v-model="awardRecord.reward.paymentType" required>
                  <option v-for="paymentType in options.paymentTypes"
                          :key="paymentType.key"
                          :value="paymentType.value">
                    {{ paymentType.text }}
                  </option>
                </b-select>
              </div>
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
          this.options.rewardList = value;
        },
        deep:true
      },
      'awardRecord.typeCode':{
        handler(value){
          console.log('watch', value);
          this.rewardList.forEach((e)=>{
            if(e.typeCode === value){
              this.awardRecord.reward.description = e.content;
              this.awardRecord.reward.price = e.price;
            }
          });
          this.awardRecord.typeCode = value;
          this.awardRecord.type = this.getRewardType(value);
        },
        deep:true
      },
    },
    data() {
      return {
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
    },
    methods: {
      validate() {
        return this.awardRecord.reward.description.trim().length > 0
         && this.awardRecord.reward.price.toString().trim().length > 0
         && (!!this.awardRecord.reward.paymentType && this.awardRecord.reward.paymentType.length > 0)
      },
      update(){
        if (!this.validate()) {
          this.$root.showErrorToast('필수 값들을 모두 입력해주세요', {});
          return;
        }

        httpRequest.put('/api/award-records/' + this.awardRecord._id, this.awardRecord)
          .then(res => {
            this.$root.showSuccessToast('수상 내역을 정상적으로 수정하였습니다.');
            this.$emit('close', true);
          })
          .catch(err => {
            this.$root.showErrorToast('수상 내역 수정에 실패하였습니다.', err);
          });
      },
      //리워드 관련 임시 처리 (추후 앱 크리티컬 업데이트 시 아래 내용 삭제 필요)
      getRewardType(typeCode) {
        switch (typeCode) {
          case 9000 :
            return "best";
          case 7000 :
            return "good";
          case 5000 :
            return "normal";
          case 3000 :
            return "participated";
          case 1000 :
            return "etc";
        }
      },
    },
  };
</script>

<style scoped>
</style>
