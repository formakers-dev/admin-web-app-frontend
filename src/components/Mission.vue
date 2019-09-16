<template>
  <div class="mission">
    <div class="box is-vertical">
      <b-field class="columns padding-bottom-10">
        <b-field class="column padding-0" label="순서 (order) *">
          <b-input type="number" v-model="mission.order" v-on:input="onInputOrder"/>
        </b-field>
        <b-field class="column padding-0 padding-left-10" label="타입 (type) *">
          <b-select v-model="type"
                    v-on:input="setMissionItemType">
            <option
              v-for="type in missionItemTypes"
              :value="type"
              :key="type">
              {{ type }}
            </option>
          </b-select>
        </b-field>
      </b-field>
      <b-field class="padding-bottom-10" label="제목 아이콘 (iconImageUrl) *">
        <div>
          <div class="padding-bottom-10 columns">
            sample : <img class="icon padding-left-10 padding-right-10 cursor-pointer"
                          v-for="icon in Object.values(icons)"
                          v-bind:key="icon"
                          v-bind:src="icon"
                          v-on:click="onClickIconSample"/>
          </div>
          <div class="columns">
            <b-input class="padding-right-10" style="width:300px" v-model="mission.iconImageUrl" placeholder="https://i.imgur.com/NBfLCwq.png"/>
            preview : <img v-if="mission.iconImageUrl.length > 0"
                 class="icon padding-left-10 padding-right-10"
                 v-bind:src="mission.iconImageUrl"/>
          </div>
        </div>
      </b-field>
      <b-field class="padding-bottom-10" label="제목 (title) *">
        <div>
          <b-switch v-model="isDependencyWithOrder">
            순서와 연동 (order + "번째 미션")
          </b-switch>
          <b-input v-model="mission.title" placeholder="1단계 미션"/>
        </div>
      </b-field>
      <b-field class="padding-bottom-10" label="아이템 제목 (item.title) *">
        <b-input v-model="mission.item.title" placeholder="의견을 작성하라!"/>
      </b-field>
      <b-field class="padding-bottom-10" label="내용 (description) *">
        <b-input type="textarea" v-model="mission.description"
                 placeholder="[2048] 에 대한 구체적인 의견을 작성해주세요."/>
      </b-field>
      <b-field class="padding-bottom-10" label="내용 이미지 (descriptionImageUrl)">
        <b-input v-model="mission.descriptionImageUrl"
                 placeholder="https://i.imgur.com/NBfLCwq.png"/>
      </b-field>
      <b-field class="padding-bottom-10" label="가이드 문구 (guide) *">
        <b-input type="textarea" v-model="mission.guide"/>
      </b-field>
      <img v-if="mission.descriptionImageUrl.length > 0"
        style="width: 500px" v-bind:src="mission.descriptionImageUrl"/>
      <b-field class="padding-bottom-10" label="액션 타입 (item.actionType)">
        <b-select v-model="actionType"
                  v-on:input="setMissionItemActionType">
          <option
            v-for="type in missionItemActionTypes"
            :value="type"
            :key="type">
            {{ type }}
          </option>
        </b-select>
      </b-field>
      <b-field class="padding-bottom-10" label="액션 (item.action) *">
        <b-input
          v-model="mission.item.action"
          placeholder="https://docs.google.com/forms/d/e/1FAIpQLSdxI2s694nLTVk4i7RMkkrtr-K_0s7pSKfUnRusr7348nQpJg/viewform?usp=pp_url&internal_web=true&entry.1042588232={email}"/>
      </b-field>
      <b-field label="옵션 (options)">
        <b-taginput
          v-model="mission.item.options"
          :data="missionItemOptions"
          autocomplete
          icon="label"
          placeholder="미션 아이템의 옵션을 추가해주세요">
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
      isDependencyWithOrder: true,
      actionType: this.mission.item.actionType.length > 0 ? this.mission.item.actionType : 'default',
      type: this.mission.item.type.length > 0 ? this.mission.item.type : 'default',
      missionItemOptions: ['mandatory', 'repeatable'],
      missionItemTypes: ['default', 'play', 'hidden'],
      missionItemActionTypes: ['default', 'internal_web'],
      icons: {
        survey: 'https://i.imgur.com/o8kAhPM.png',
        play: 'https://i.imgur.com/rjQSzgp.png',
      },
    };
  },
  created() {
    this.setMissionItemType(this.mission.item.type || 'default');
    this.onInputOrder(this.mission.order);
  },
  methods: {
    setMissionItemType(selected) {
      console.log('setMissionItemType : ', selected);
      if (selected === 'default') {
        delete this.mission.item.type;
        this.mission.iconImageUrl = this.icons.survey;
      } else {
        this.mission.item.type = selected;
        if (selected === 'play') {
          this.mission.iconImageUrl = this.icons.play;
        } else {
          delete this.mission.iconImageUrl;
        }
      }
      console.log(this.mission);
    },
    setMissionItemActionType(selected) {
      console.log('setMissionItemActionType : ', selected);
      if (selected === 'default') {
        delete this.mission.item.actionType;
      } else {
        this.mission.item.actionType = selected;
      }
      console.log(this.mission);
    },
    onInputOrder(order) {
      console.log(this.isDependencyWithOrder);
      if (this.isDependencyWithOrder) {
        this.$emit('update-mission-title', {
          order,
          title: `${order}번째 미션`,
        });
      }
    },
    onClickIconSample(value) {
      console.log(value.srcElement.src);
      this.mission.iconImageUrl = value.srcElement.src;
    },
  },
};
</script>

<style scoped>
  .mission {
    width: 500px;
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
    width: 50px;
    height: 30px;
    background: black;
  }
  .cursor-pointer {
    cursor: pointer;
  }
</style>
