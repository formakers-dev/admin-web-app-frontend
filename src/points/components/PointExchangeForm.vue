<template>
<div class="modal-card point-exchange-container">
  <header class="modal-card-head">
    <p class="modal-card-title">포인트 교환 요청 정보</p>
    <p><font color="red">필수 값 *</font></p>
  </header>
  <section class="modal-card-body">
    <div class="columns" style="width: 100%; height: max-content">
      <div class="column" style="overflow-y: auto">
        <b-field v-if="pointRecord._id" label="포인트 교환 요청 아이디" horizontal
                 style="background: #f5f5f5; padding: 10px">
          {{pointRecord._id}}
        </b-field>

        <b-field label="유저 아이디" horizontal>
          {{ pointRecord.userId }}
        </b-field>

        <b-field label="유저 전화번호" horizontal>
          {{ pointRecord.phoneNumber }}
        </b-field>

        <b-field label="교환 요청 금액" horizontal
                 style="background: #f5f5f5; padding: 10px">
          <strong>{{ pointRecord.point * -1 }}</strong>
          <a href="http://gift.cultureland.co.kr/" target="_blank"><u>교환하러 가기</u></a>
        </b-field>

        <div class="box">

          <div class="columns">
            <div class="column">
              <b-field>
                <template slot="label">
                  담당자
                </template>
                <b-select v-model="pointRecord.operationData.operatorAccount">
                  <option v-for="option in options.operators"
                          :key="option.key"
                          :value="option.value"
                  >
                    {{option.text}}
                  </option>
                </b-select>
              </b-field>
            </div>

            <div class="column">
              <b-field>
                <template slot="label">
                  처리 상태
                </template>
                <b-select v-model="pointRecord.operationData.status">
                  <option v-for="status in options.operationStatus"
                          :key="status.key"
                          :value="status.value"
                  >
                    {{status.text}}
                  </option>
                </b-select>
              </b-field>
            </div>
          </div>

          <b-field>
            <template slot="label">
              비고
            </template>
            <b-input type="textarea"
                     v-model="pointRecord.operationData.memo"
            ></b-input>
          </b-field>

        </div>
      </div>
    </div>
  </section>
  <footer class="modal-card-foot">
    <button class="button" type="button" @click="close">닫기</button>
    <button class="button  is-primary" type="button" @click="submit">저장</button>
  </footer>
</div>
</template>

<script>
import request from '../../common/utils/http';

export default {
  name: 'PointExchangeForm.vue',
  components: {
  },
  props: {
    pointRecord: {
      type: Object,
      default() {
        return null;
      },
    },
    operators: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      options: {
        operators: [],
        operationStatus: [
          {key: 10, value: 10, text: "요청"},
          {key: 99, value: 99, text: "완료"},
          {key: -1, value: -1, text: "실패"}
        ]
      }
    };
  },
  created() {
    this.options.operators = this.operators;
  },
  mounted() {
    console.log("pointRecord:", this.pointRecord);
    console.log("operators:", this.operators);

    if(!!!this.pointRecord.operationData) {
      this.pointRecord.operationData = {}
    }
  },
  methods: {
    submit() {
      request.put('/api/points/' + this.pointRecord._id + '/exchange', {
        operationStatus: this.pointRecord.operationData.status,
        operatorAccount: this.pointRecord.operationData.operatorAccount,
        memo: this.pointRecord.operationData.memo,
      }).then(() => {
        this.$root.showToast('is-success', '정보가 성공적으로 저장되었습니다!');
        this.close();
      })
        .catch(err => {
          this.$root.showToast('is-danger', '정보 저장에 실패하였습니다');
          console.error(err.message);
        });
    },
    close() {
      this.$emit('close', false);
    },
  },
};
</script>

<style scoped>
  .point-exchange-container {
    width: auto;
  }
  .point-exchange-container .field{
    margin-bottom:1rem;
  }
  .point-exchange-container{
    display: flex;
    align-content: center;
    justify-content: center;
  }
</style>
