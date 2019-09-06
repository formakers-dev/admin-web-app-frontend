<template>
  <div class="mission">
    <div class="box is-vertical">
      <b-field label="순서 (order) *">
        <b-input type="number" v-model="mission.order"/>
      </b-field>
      <b-field label="타입 (type) *">
        <b-select v-model="display.mission.item.type"
                  v-on:input="setMissionItemType">
          <option
            v-for="type in missionItemTypes"
            :value="type"
            :key="type">
            {{ type }}
          </option>
        </b-select>
      </b-field>
      <b-field label="제목 아이콘 (iconImageUrl) *">
        <b-input v-model="mission.iconImageUrl" placeholder="https://i.imgur.com/NBfLCwq.png"/>
      </b-field>
      <img v-if="mission.iconImageUrl.length > 0"
        style="width: 150px" v-bind:src="mission.iconImageUrl"/>
      <b-field label="제목 (title) *">
        <b-input v-model="mission.title" placeholder="1단계 미션"/>
      </b-field>
      <b-field label="내용 (description) *">
        <b-input type="textarea" v-model="mission.description"
                 placeholder="[2048] 에 대한 구체적인 의견을 작성해주세요.]"/>
      </b-field>
      <b-field label="내용 이미지 (descriptionImageUrl)">
        <b-input v-model="mission.descriptionImageUrl"
                 placeholder="https://i.imgur.com/NBfLCwq.png"/>
      </b-field>
      <b-field label="가이드 문구 (guide) *">
        <b-input type="textarea" v-model="mission.guide"
                 v-bind:placeholder="display.mission.guide"/>
      </b-field>
      <img v-if="mission.descriptionImageUrl.length > 0"
        style="width: 500px" v-bind:src="mission.descriptionImageUrl"/>
      <b-field label="아이템 제목 (item.title) *">
        <b-input v-model="mission.item.title" placeholder="의견을 작성하라!"/>
      </b-field>
      <b-field label="액션 타입 (item.actionType)">
        <b-input v-model="mission.item.actionType" placeholder="link"/>
      </b-field>
      <b-field label="액션 (item.action) *">
        <b-input
          v-model="mission.item.action"
          placeholder="https://docs.google.com/forms/d/e/1FAIpQLSdxI2s694nLTVk4i7RMkkrtr-K_0s7pSKfUnRusr7348nQpJg/viewform?usp=pp_url&internal_web=true&entry.1042588232={email}"/>
      </b-field>
      <b-field label="옵션 (option)">
        <b-taginput
          v-model="mission.item.option"
          :data="missionItemOptionsSamples"
          autocomplete
          field="user.first_name"
          icon="label"
          placeholder="Add a option">
        </b-taginput>
      </b-field>
      <br/>
      <b-button class="button is-fullwidth"
                type="is-danger"
                @click="$emit('remove-mission', mission.order)"
                outlined><b>삭제</b></b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Mission',
  props: ['mission'],
  data() {
    return {
      display: {
        mission: {
          item: {
            type: '',
          },
        },
      },
      missionItemOptionsSamples: ['mandatory', 'repeatable'],
      missionItemTypes: ['default', 'play', 'hidden'],
    };
  },
  methods: {
    setMissionItemType(selected) {
      console.log('setMissionItemType : ', selected);
      if (selected === 'default') {
        delete this.mission.item.type;
      } else {
        this.mission.item.type = selected;
      }
      console.log(this.mission);
    },
  },
};
</script>

<style scoped>
  .mission {
    width: 500px;
  }
</style>
