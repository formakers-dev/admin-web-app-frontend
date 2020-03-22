<template>
  <div class="test-list">
    <h1 class="title">🎮 게임 테스트 히스토리 확인하기 (개발중)</h1>
    <h2 class="subtitle">
      역대 테스트 히스토리를 확인하는 리스트입니다!
    </h2>
    <br/>

    <div class="box">
      <h2 class="title">💁🏻‍♀️ 테스트 리스트</h2>
      <b-table
        :data="allBetaTests"
        :loading="isLoading"
        detailed>

        <template slot-scope="props">
          <b-table-column field="openDate" label="오픈 날짜">
            {{ props.row.openDateDisplay }}
          </b-table-column>

          <b-table-column field="closeDate" label="종료 날짜">
            {{ props.row.closeDateDisplay }}
          </b-table-column>

          <b-table-column field="title" label="제목" style="width: 60%">
            {{ props.row.title }}
          </b-table-column>

        </template>

        <template slot="detail" slot-scope="props">
          <article class="media">
            <div class="media-content">
              <div class="content">
                <button class="button is-black"
                        v-on:click="alertRowData(props.row)">
                  Row Data 확인해보기
                </button>
                <button class="button is-info" disabled>
                  수정하기
                </button>
<!--            등록 레이아웃을 컴포넌트로 분리시킨 다음에 여기에 연결해서 아래 코드를 대체하자 -->
                <br/>
                <br/>
                <strong>- 오픈 날짜 (openDate) : </strong>{{ props.row.openDateDisplay }}<br/>
                <strong>- 종료 날짜 (closeDate) : </strong>{{ props.row.closeDateDisplay }}<br/>
                <strong>- 제목 (title) : </strong>{{ props.row.title }}<br/>
                <div v-if="props.row.description">
                  <strong>- 설명 (description) : </strong>{{ props.row.description }}<br/>
                </div>
                <strong>- 태그 (tags) : </strong>{{ props.row.tags }}<br/>
                <div v-if="props.row.purpose">
                  <strong>- 목적 (purposes) : </strong>{{ props.row.purpose }}<br/>
                </div>
                <div v-if="props.row.bueReport">
                  <strong>- 버그리포트 설문 (bugReport.url) : </strong>{{ props.bueReport.url }}<br/>
                </div>
                <strong>- 대표 이미지 URL (coverImageUrl) : </strong>
                <a v-bind:href="props.row.coverImageUrl">
                  {{ props.row.coverImageUrl }}
                </a>
                <br/>
                <div style="width: 500px">
                  <img v-bind:src="props.row.coverImageUrl"/>
                </div>
                <strong>- 앱 아이콘 (iconImageUrl) : </strong>
                <a v-bind:href="props.row.iconImageUrl">
                  {{ props.row.iconImageUrl }}
                </a>
                <br/>
                <div style="width: 100px">
                  <img v-bind:src="props.row.iconImageUrl"/>
                </div>
                <br/>
              </div>
            </div>
          </article>
        </template>
      </b-table>
    </div>

    <br/>
    <b-field v-if="result" label="Log">
      <b-message class="white-space-pre">{{ JSON.stringify(result, null, ' ') }}</b-message>
    </b-field>
  </div>
</template>

<script>
import moment from 'moment';
import request from '../common/utils/http';

export default {
  name: 'TestList',
  data() {
    return {
      allBetaTests: [],
      openedBetaTests: [],
      closedBetaTests: [],
      isLoading: true,
      result: null,
    };
  },
  created() {
    this.getAllBetaTests();
  },
  methods: {
    getAllBetaTests() {
      request.get('/beta-test/all')
        .then((res) => {
          if (res.status === 200) {
            this.allBetaTests = res.data.map((betaTest) => {
              const result = betaTest;
              result.openDateDisplay = moment(betaTest.openDate).format('YYYY-MM-DD (ddd) HH:mm:ss');
              result.closeDateDisplay = moment(betaTest.closeDate).format('YYYY-MM-DD (ddd) HH:mm:ss');
              return result;
            });
          } else {
            this.showErrorToast();
          }
          this.isLoading = false;
        })
        .catch((err) => {
          this.result = err;
          this.showErrorToast();
        });
    },
    alertRowData(rowData) {
      const msg = '<textarea class="box" style="width: 100%; height: 400px; resize: none;" readonly>'
        .concat(JSON.stringify(rowData, null, 4))
        .concat('</textarea>');
      console.log(msg);
      this.$dialog.alert({
        title: 'Row Data 확인해보기',
        message: msg,
        confirmText: '닫기',
      });
    },
    showSuccessToast(toastMessage) {
      this.$toast.open({
        duration: 4000,
        message: toastMessage,
        type: 'is-success',
      });
    },
    showErrorToast() {
      this.$toast.open({
        duration: 4000,
        message: '실패! 로그를 확인하시오!',
        type: 'is-danger',
      });
    },
  },
};
</script>

<style scoped>
  .test-list {
    text-align: start;
    padding: 30px;
  }
</style>
