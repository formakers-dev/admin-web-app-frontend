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

            <b-tooltip type="is-dark"
                       label="에필로그 클릭시에 수행될 액션입니다. Deeplink 포맷에 대한 자세한 내용은 클릭하여 도움말을 살펴보세요."
                       position="is-right"
                       multilined>
              <b-button class="is-white"
                        style="margin-left: -15px; background: transparent;"
                        rounded
                        tag="a"
                        href="https://www.notion.so/formakers/0x03_-_Deeplink_-619417f97b224fc4be4230cdcba4bea6"
                        target="_blank">
                <b-icon size="is-small" icon="help-circle-outline" ></b-icon>
              </b-button>
            </b-tooltip>
          </template>
          <b-input v-model="epilogue.deeplink"
                   ref="deeplink"
                   required></b-input>
        </b-field>
        <b-field horizontal>
          <template slot="label">
            <span class="has-text-danger">*</span> 게임사 이름
          </template>
          <b-input ref="companyName"
                   v-model="epilogue.companyName"
                   style="width: 100%"
                   required
          ></b-input>
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
        <b-field horizontal>
          <template slot="label">
            게임사 아이콘
            <b-tooltip type="is-dark" label="입력하지 않으면 포메스 기본 아이콘이 표시됩니다.">
              <b-icon size="is-small" icon="help-circle-outline"></b-icon>
            </b-tooltip>
          </template>
          <b-input v-model="epilogue.companyImageUrl"
                   ref="companyImageUrl"
                   placeholder="https://i.imgur.com/EgdSiW6.png"></b-input>
        </b-field>
        <b-field v-if="epilogue.companyImageUrl"  label="게임사 아이콘 Preview" horizontal>
          <img v-if="epilogue.companyImageUrl" style="width: 150px" :src="epilogue.companyImageUrl"/>
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
        deeplink:'',
        companySays:'',
        companyName:'',
        companyImageUrl:'',
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
      request.get('/api/beta-test/' + this.betaTestId + '/epilogue').then((res)=>{
        if(res.data){
          console.log(res.data);
          this.type='update';
          this.epilogue = res.data;
        }else{
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
      const body = this.epilogue;

      request.post('/api/beta-test/' + this.betaTestId + '/epilogue', body).then(res=>{
        this.$root.showSuccessToast('에필로그를 정상적으로 저장하였습니다.');
        this.$parent.close();
      }).catch(err => {
        this.$root.showErrorToast('에필로그 저장에 실패하였습니다.',err);
      });
    },
    deleteEpilogue(){
      request.delete('/api/beta-test/' + this.betaTestId + '/epilogue').then(res=>{
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
