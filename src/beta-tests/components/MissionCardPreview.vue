<template>
  <section class="box mission-card">
    <div class="columns is-gapless is-multiline is-centered">
      <div class="column is-1">
        <span class="image is-24x24">
          <img :src="getIcon(mission.type)"/>
        </span>
      </div>
      <div class="column is-3 mission-order">
        <b>{{mission.order}}단계 미션</b>
      </div>
      <div class="column mission-title">
        {{mission.title}}
      </div>
      <div class="column is-full">
        <div class="mission-description">{{mission.description}}</div>
      </div>

      <div class="column is-full">
        <hr class="mission-divider"/>
      </div>

      <div v-if="mission.descriptionImageUrl" class="column is-full">
        <img :src="mission.descriptionImageUrl"/>
      </div>

      <div v-if="mission.guide" class="column is-full">
        <span class="mission-guide">{{mission.guide}}</span>
      </div>

      <div class="column is-full">
        <div class="mission-button"><b-button :class="mission.action? 'is-primary' : 'is-danger'"
                                              @click="showActionLinkPopup(mission.action)"
                                              expanded
        >{{getActionButtonTitle(mission.type)}}</b-button></div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'MissionCardPreview',
  props: ['mission'],
  data() {
    return {
      options: {
        icons: [
          {key:'install', img:'https://i.imgur.com/rjQSzgp.png'},
          {key:'play', img:'https://i.imgur.com/o8kAhPM.png'},
          {key:'survey', img:'https://i.imgur.com/o8kAhPM.png'},
        ],
        actionButtons: [
          {key:'install', title:'설치하러 가기'},
          {key:'play', title:'플레이 인증하러가기'},
          {key:'survey', title:'참여하기'},
        ],
      }
    };
  },
  watch:{
  },
  created() {
  },
  mounted() {
  },
  methods: {
    getIcon(missionType) {
      return this.options.icons.filter(el => el.key === missionType)[0].img;
    },
    getActionButtonTitle(missionType) {
      return this.options.actionButtons.filter(el => el.key === missionType)[0].title;
    },
    showActionLinkPopup(action) {
      if (action) {
        window.open(action, '_blank');
      }

      return false;
    }
  },
};
</script>

<style scoped>
  .mission-card {
    background-color: #454647;
    border: 1px #575859;
  }
  .mission-order {
    color: #ffffff;
    font-size: small;
  }
  .mission-title {
    color: #ffffff;
    font-size: small;
  }

  .mission-description {
    color: #9b9b9b;
    font-size: small;
  }

  .mission-divider {
    background-color: #9b9b9b;
    border: solid 0px #9b9b9b;
  }

  .mission-guide {
    color: #00bfba;
    font-size: small;
  }

  .mission-button {
    margin-top: 20px;
  }
</style>
