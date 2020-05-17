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
                      outlined><b>삭제</b></b-button>
          </div>
        </div>
        <div class="content" style="margin-top: 40px">
          <span class="order-wrapper">{{reward.order}}</span>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 아이콘
            </template>
            <div class="block">
              <b-radio v-for="option in options.icons"
                       :key="option.key"
                       :native-value="option"
                       v-model="icon">
                <img v-if="option.key != 'manual'" class="icon" :src="option.img">
                <p v-if="option.key === 'manual'">{{option.text}}</p>
              </b-radio>
            </div>
          </b-field>
          <b-field v-if="icon.key === 'manual'">
            <img v-if="icon.key === 'manual' && icon.img" class="icon" :src="icon.img" style="margin-right: 10px">
            <b-input ref="icon.img" v-model="icon.img" :readonly="icon.key !='manual'" expanded required></b-input>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 제목
            </template>
            <b-input ref="reward.title" v-model="reward.title" placeholder="제목을 입력하세요." required/>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 내용
            </template>
            <b-input ref="reward.content" v-model="reward.content" placeholder="내용을 입력하세요." required/>
          </b-field>
          <b-field>
            <template slot="label">
              <span class="has-text-danger">*</span> 가격
            </template>
            <b-input ref="reward.price" v-model.number="reward.price" placeholder="보상 가격을 입력하세요." required/>
          </b-field>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'RewardItem',
  props: ['reward'],
  data() {
    return {
      options:{
        icons: [
          {key:'pencil', img:'https://i.imgur.com/btZZHRp.png'},
          {key:'silver', img:'https://i.imgur.com/6RaZ7vI.png'},
          {key:'gold', img:'https://i.imgur.com/ybuI732.png'},
          {key:'manual', img:'', text:'직접입력'}
        ],
      },
      icon:{}
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
    }
  },
  created() {
    this.initIcon();
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
