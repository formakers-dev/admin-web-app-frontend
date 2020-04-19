<template>
  <div style="word-break: break-all;">
    <h1 class="title">의뢰 관리</h1>
    <section>
      <request-card-list></request-card-list>
    </section>
  </div>
</template>

<script>
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
  },
  methods: {
  },
};
</script>

<style scoped>
  .large{
    font-size:large;
  }
</style>
