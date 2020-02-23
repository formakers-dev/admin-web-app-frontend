<template>
  <div class="reward-item">
    <div class="box is-vertical">
      <b-field class="padding-bottom-10" label="순서 (order) *">
        <b-input type="number" v-model="reward.order"/>
      </b-field>
      <b-field class="padding-bottom-10" label="아이콘 (iconImageUrl) *">
        <div>
          <div class="padding-bottom-10 columns">
            sample : <img class="padding-right-10 icon cursor-pointer"
                 v-for="icon in Object.values(icons)"
                 v-bind:key="icon"
                 v-bind:src="icon"
                 v-on:click="onClickIconSample"/>
          </div>
          <div class="columns">
            <b-input class="padding-right-10" v-model="reward.iconImageUrl" placeholder="https://i.imgur.com/NBfLCwq.png"/>
            <img class="padding-right-10 icon" v-bind:src="reward.iconImageUrl"/>
          </div>
        </div>
      </b-field>
      <b-field class="padding-bottom-10" label="제목 (title) *">
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
      icons: {
        pencil: 'https://i.imgur.com/btZZHRp.png',
        silver: 'https://i.imgur.com/6RaZ7vI.png',
        gold: 'https://i.imgur.com/ybuI732.png',
      },
    };
  },
  methods: {
    onClickIconSample(value) {
      console.log(value.srcElement.src);
      this.reward.iconImageUrl = value.srcElement.src;
    },
  },
};
</script>

<style scoped>
  .reward-item {
    width: 300px;
  }
  .padding-0 {
    padding: 0;
  }
  .padding-left-10 {
    padding-left: 10px;
  }
  .padding-right-10 {
    padding-right: 10px;
  }
  .padding-bottom-10 {
    padding-bottom: 10px;
  }
  .icon {
    width: 30px;
  }
  .cursor-pointer {
    cursor: pointer;
  }
</style>
