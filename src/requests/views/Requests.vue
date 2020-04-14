<template>
  <div style="word-break: break-all;">
    <h1 class="title">의뢰 관리</h1>
    <section>
      <request-card-list :items="requests" @refresh="getRequests"></request-card-list>
    </section>
  </div>
</template>

<script>
import httpRequest from '../../common/utils/http';
import moment from 'moment';
import requestCardList from '../components/RequestsCardList';

export default {
  name: 'Requests',
  components: {
    requestCardList
  },
  data() {
    return {
      requests:[]
    };
  },
  watch:{

  },
  filters:{

  },
  created() {
    this.getRequests();
  },
  methods: {
    getRequests(){
      httpRequest.get('/api/requests')
        .then(res => {
          console.log(res.data);
          this.requests = res.data;
        })
        .catch(error => {
          this.$root.showErrorToast('의뢰 항목 조회에 실패하였습니다.', error);
        });
    }
  },
};
</script>

<style scoped>
  .large{
    font-size:large;
  }
</style>
