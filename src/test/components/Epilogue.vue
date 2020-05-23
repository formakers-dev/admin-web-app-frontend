<template>
  <section>
    <div class="level">
      <div class="level-left">
      </div>
      <div class="level-right">
        <div class="level-item">
          <b-button  type='is-info'
                     style="margin-right: 5px"
                     @click="upsertEpilogue"
                     size="is-small">저장</b-button>
          <b-button  v-if="type==='update'"
                     type='is-danger'
                     @click="deleteEpilogue"
                     size="is-small">삭제</b-button>
        </div>
      </div>
    </div>
    <section>
      <b-field horizontal>
        <template slot="label">
          <span class="has-text-danger">*</span> 딥링크
        </template>
        <b-input v-model="epilogue.deeplink"
                 required></b-input>
      </b-field>
      <b-field horizontal>
        <template slot="label">
          <span class="has-text-danger">*</span> 게임사 소감
        </template>
        <b-input type="textarea"
                 v-model="epilogue.companySays"
                 style="width: 100%"
                 required
        ></b-input>
      </b-field>
    </section>
  </section>
</template>

<script>
  import request from '../../common/utils/http';
export default {
  name: 'Epilogue',
  props: {
    betaTestId:{
      type: String,
      default(){
        return null;
      }
    },
    data:{
      type: Object,
      default(){
        return null;
      }
    }
  },
  data() {
    return {
      type:'add',
      epilogue: {
        companySays:'',
        deeplink:'',
        betaTestId:''
      }
    };
  },
  watch:{
    'betaTestId':{
      handler(value){
        this.epilogue.betaTestId = value;
      },
      deep:true
    },
    'data':{
      handler(value){
        this.epilogue = Object.assign({}, value);
        this.type = 'update'
      },
      deep:true
    },
  },
  mounted() {
  },
  methods: {
    upsertEpilogue(){
      if(!this.validation()){
        this.$root.showToast('is-danger', '필수 입력값을 확인해주세요.');
        return;
      }
      const body = Object.assign({}, this.epilogue);
      if(this.type === 'add'){
        body.betaTestId = this.betaTestId;
      }
      console.log(body);
      request.post('/api/epilogues', body).then(res=>{
        this.$root.showSuccessToast('에필로그를 정상적으로 저장하였습니다.');
        this.type='update';
      }).catch(err => {
        this.$root.showErrorToast('에필로그 저장에 실패하였습니다.',err);
      });
    },
    deleteEpilogue(){
      request.delete('/api/epilogues/'+this.epilogue._id).then(res=>{
        this.$root.showSuccessToast('에필로그를 정상적으로 삭제하였습니다.');
        this.type='add';
        this.epilogue = Object.assign({
          companySays:'',
          deeplink:'',
          betaTestId:this.betaTestId
        });
      }).catch((err)=>{
        this.$root.showErrorToast('에필로그 삭제 실패하였습니다.',err);
      });
    },
    validation(){
      return this.epilogue.deeplink.trim().length > 0 && this.epilogue.companySays.trim().length > 0
    }
  },
};
</script>

<style scoped>
</style>
