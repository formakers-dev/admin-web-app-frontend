<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p v-if="type==='update'" class="modal-card-title">에필로그 정보 수정하기</p>
      <p v-if="type==='add'" class="modal-card-title">에필로그 정보 등록하기</p>
    </header>
    <div class="modal-card-body">
      <section style="width: 100%">
        <b-field horizontal>
          <template slot="label">
            <span class="has-text-danger">*</span> 딥링크
          </template>
          <b-input v-model="epilogue.deeplink"
                   ref="deeplink"
                   required></b-input>
        </b-field>
        <b-field horizontal>
          <template slot="label">
            <span class="has-text-danger">*</span> 게임사 소감
          </template>
          <b-input type="textarea"
                   ref="companySays"
                   v-model="epilogue.companySays"
                   style="width: 100%"
                   required
          ></b-input>
        </b-field>
      </section>
    </div>
    <footer class="modal-card-foot">
      <b-button  type="is-light" @click="$parent.close()">닫기</b-button>
      <b-button  type='is-primary'
                 style="margin-right: 5px"
                 @click="upsertEpilogue"
      >저장</b-button>
      <b-button  v-if="type==='update'"
                 type='is-danger'
                 @click="deleteEpilogue"
      >삭제</b-button>
    </footer>
  </div>
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
  },
  created() {
  },
  mounted() {
    this.getEpilogue();
  },
  methods: {
    getEpilogue(){
      request.get('/api/epilogues?betaTestId='+ this.betaTestId).then((res)=>{
        if(res.data){
          this.type='update';
          this.epilogue = Object.assign({}, res.data);
        }else{
          this.epilogue.betaTestId = this.betaTestId;
          this.type='add';
        }
      }).catch(err=>{
        this.$root.showErrorToast('에필로그를 불러오는데 실패하였습니다.',err);
      });
    },
    upsertEpilogue(){
      if(!this.validation()){
        this.$root.showToast('is-danger', '필수 입력값을 확인해주세요.');
        return;
      }
      const body = Object.assign({}, this.epilogue);
      if(this.type === 'add'){
        body.betaTestId = this.betaTestId;
      }
      request.post('/api/epilogues', body).then(res=>{
        this.$root.showSuccessToast('에필로그를 정상적으로 저장하였습니다.');
        this.$parent.close();
      }).catch(err => {
        this.$root.showErrorToast('에필로그 저장에 실패하였습니다.',err);
      });
    },
    deleteEpilogue(){
      request.delete('/api/epilogues/'+this.epilogue._id).then(res=>{
        this.$root.showSuccessToast('에필로그를 정상적으로 삭제하였습니다.');
        this.$parent.close();
      }).catch((err)=>{
        this.$root.showErrorToast('에필로그 삭제 실패하였습니다.',err);
      });
    },
    validation(){
      let isValid = true;
      for (let ref in this.$refs) {
        if(this.$refs[ref]){
          let checkValidity = this.$refs[ref].checkHtml5Validity();
          if(!checkValidity){
            isValid = false;
          }
        }
      }
      return isValid;
    }
  },
};
</script>

<style scoped>
</style>
