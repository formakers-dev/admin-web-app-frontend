<template>
  <div>
    <div class="head">
      <div class="contents">
        <img v-if="betaTest.iconImageUrl" style="width: 70px" :src="betaTest.iconImageUrl"/>
        <div>
          <h1 class="title" style="margin-top: 10px; display: inline">
            {{ this.betaTest.title }}
            - {{ mission.title }}
            <div class="has-text-primary" style="display: inline">응답 집계</div>
          </h1>
          <b-tooltip v-if="isTargetToFomesMembers"
                     position="is-right"
                     sizr="is-small"
                     style="width: inherit;"
                     label="해당 테스트가 포메스 관리자들에게만 보여지는 모드입니다."
                     multilined>
            <b-tag class="has-text-weight-bold" type="is-primary"
                   style="margin-left: 10px;"
                   v-model="isTargetToFomesMembers">테스트모드
            </b-tag>
          </b-tooltip>
        </div>
      </div>
    </div>
    <div class="contents full-width">
      <b-table
        :data="result.answers"
        :columns="result.headerKeys"
        :sticky-header="true"
        style="height: 65vh"
      ></b-table>
    </div>
  </div>
</template>

<script>
import request from '../../common/utils/http';

export default {
  name: 'TestFeedbackAggregation',
  components: {
  },
  props:[
    'betaTestId',
    'missionId',
    'betaTest',
    'mission',
  ],
  computed: {
    isTargetToFomesMembers: function() {
      return this.betaTest.status === 'test';
    }
  },
  data() {
    return {
      result: {
        headers: [],
        headerKeys: [],
        answers: [],
      }
    };
  },
  created() {
    console.log('[TestFeedbackAggregation] created')
    request.get('/api/beta-test/' + this.betaTestId + '/mission/' + this.missionId + '/feedback')
    .then(res => {
      console.log(res.data);
      this.result.answers = res.data.answers;
      this.result.headerKeys = ["order"].concat(res.data.headerKeys)
        .map(question => {
          return {
            field: question,
            label: question,
            sticky: true
        }
      })
      console.log(this.result);
    }).catch(err => {
      this.$root.showErrorToast('조회하는데 실패하였습니다.', err);
    })
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style scoped>
.container {
  margin: 0 auto !important;
  width: 100% !important;
}
.head {
  background: white;
  padding: 1.5rem;
  margin-bottom: 1rem;
  margin-bottom: 1.5rem;
}
.contents {
  margin: 0 auto !important;
  width: 85% !important;
}
.full-width {
  width: 95% !important;
}
</style>
