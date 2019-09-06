<template>
  <div class="reward-item">
    <div class="box is-vertical">
      <b-field label="순서 (order) *">
        <b-input type="number" v-model="reward.order"/>
      </b-field>
      <b-field label="아이콘 (iconImageUrl) *">
        <b-input v-model="reward.iconImageUrl" placeholder="https://i.imgur.com/NBfLCwq.png"/>
      </b-field>
      <b-field label="제목 (title) *">
        <b-input v-model="reward.title" placeholder="테스트 성실상 (30명)"/>
      </b-field>
      <b-field label="내용 (content) *">
        <b-input v-model="reward.content" placeholder="문화상품권 1000원"/>
      </b-field>
      <br/>
      <b-button class="button is-fullwidth"
                type="is-danger"
                @click="$emit('remove-reward-item', reward.order)"
                outlined><b>삭제</b></b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RewardItem',
  props: ['reward'],
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<style scoped>
  .reward-item {
    width: 300px;
  }
</style>
