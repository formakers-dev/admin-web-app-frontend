<template>
  <section style="margin-bottom: 10px">
    <div class="card">
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <b-button class="button"
                      style="position: absolute; right:20px"
                      type="is-danger"
                      size="is-small"
                      @click="$emit('remove-reward-item', reward.order)"
                      outlined :disabled="disabled"><b>삭제</b></b-button>
          </div>
        </div>
        <div class="content" style="margin-top: 40px">
          <span class="order-wrapper">{{reward.order}}</span>
          <b-field v-if="reward.typeCode" label="수상 유형">
            <b-select v-model="reward.typeCode" :disabled="disabled">
              <option v-for="type in options.types"
                      :key="type.key"
                      :value="type.key"
              >
                {{ type.value.title }}
              </option>
            </b-select>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 아이콘
            </template>
            <div class="block">
              <b-radio v-for="option in options.icons"
                       :key="option.key"
                       :native-value="option"
                       v-model="icon" :disabled="disabled">
                <img v-if="option.key != 'manual'" class="icon" :src="option.img">
                <p v-if="option.key === 'manual'">{{option.text}}</p>
              </b-radio>
            </div>
          </b-field>
          <b-field v-if="icon.key === 'manual'">
            <img v-if="icon.key === 'manual' && icon.img" class="icon" :src="icon.img" style="margin-right: 10px; filter: opacity(0.5) drop-shadow(0 0 0 black);">
            <b-tooltip type="is-dark"
                       label="PNG 파일의 경우 미리보기에서 색이 다르게 보여질 수 있습니다."
                       position="is-top"
                       multilined
                       style="width: 100%;"
            >
              <b-input ref="icon.img" v-model="icon.img" :readonly="icon.key !='manual'" expanded required :disabled="disabled"></b-input>
            </b-tooltip>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 제목
            </template>
            <b-input ref="reward.title" v-model="reward.title" placeholder="제목을 입력하세요." required :disabled="disabled"/>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 내용
            </template>
            <b-input ref="reward.content" v-model="reward.content" placeholder="내용을 입력하세요." required :disabled="disabled"/>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 가격
            </template>
            <b-input ref="reward.price" v-model.number="reward.price" placeholder="보상 가격을 입력하세요." required :disabled="disabled"/>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 인원
              <b-switch size="is-small" v-model="isForEveryone" :disabled="disabled">전체지급</b-switch>
            </template>
            <div>
              <b-numberinput v-if="!isForEveryone" :required="!isForEveryone"
                             min="1"
                             ref="reward.count"
                             v-model.number="reward.count" placeholder="인원 수를 입력하세요." :disabled="disabled"/>
            </div>
          </b-field>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'RewardItem',
  props: ['reward', 'rewardTypes', 'disabled'],
  data() {
    return {
      options:{
        icons: [
          {key:'gold', img:'https://i.imgur.com/ybuI732.png'},
          {key:'silver', img:'https://i.imgur.com/6RaZ7vI.png'},
          {key:'pencil', img:'https://i.imgur.com/btZZHRp.png'},
          {key:'manual', img:'', text:'직접입력'}
        ],
        types:[],
      },
      icon:{},
      type:{prev:'', current:''},
      isForEveryone: !!!this.reward.count || this.reward.count < 0,
    };
  },
  watch:{
    'icon':{
      handler(value){
        if(value.key === 'manual'){
          this.options.icons[3].img = value.img;
        }else{
          this.options.icons[3].img = '';
        }
        this.reward.iconImageUrl = value.img;
      },
      deep: true
    },
    'reward':{
      handler(value){
        this.initIcon();
      },
      deep: true
    },
    isForEveryone(newValue) {
      if (newValue) {
        this.reward.count = 0;
      } else {
        this.reward.count = 1;
      }
    }
  },
  created() {
    this.initIcon();
  },
  mounted() {
    this.options.types = this.rewardTypes;
  },
  methods: {
    initIcon(){
      let isExistedIcon = false;
      const imgUrl = this.reward.iconImageUrl;
      for(let index = 0; index< this.options.icons.length; index++){
        if(imgUrl === this.options.icons[index].img){
          this.icon = Object.assign({}, this.options.icons[index]);
          isExistedIcon = true;
          break;
        }
      }
      if(!isExistedIcon){
        this.icon = Object.assign({},{key:'manual', img: imgUrl, text:'직접입력'})
      }
    }
  },
};
</script>

<style scoped>
  .icon {
    width: 24px;
  }
  .order-wrapper{
    position: absolute;
    left: 0;
    top: 0;
    padding: 5px 10px;
    background-color: #00BFBA;
    font-weight: bold;
    color: white;
    width: 60px;
    text-align: center;
  }
</style>
