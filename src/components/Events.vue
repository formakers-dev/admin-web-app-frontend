<template>
  <div class="events">
    <h1 class="title">🎉 이벤트 배너 등록하기 🎉</h1>
    <h2 class="subtitle">
      이벤트 배너를 좀 더 편하게 등록하고 싶은 모두의 염원이 만들어낸 페이지 🤗
    </h2>
    <br/>

    <b-field label="오픈 날짜 (openDate) *"/>
    <b-field style="padding-left: 10px; align-items: center">
      <b-datepicker v-model="openDate"
                    style="padding-right: 10px"
                    placeholder="오픈할 날짜를 선택하세요"
                    icon="calendar-today"
                    mobile-native="true"
                    editable>
      </b-datepicker>
      <b-timepicker v-model="openDate"
                    style="padding-right: 10px"
                    placeholder="오픈할 시각을 선택하세요"
                    icon="clock"
                    mobile-native="true"
                    editable>
      </b-timepicker>
    </b-field>

    <br/>

    <b-field label="종료 날짜 (closeDate) *"/>
    <b-field style="padding-left: 10px; align-items: center">
      <b-datepicker v-model="closeDate"
                    style="padding-right: 10px"
                    placeholder="오픈할 날짜를 선택하세요"
                    icon="calendar-today"
                    mobile-native="true"
                    editable>
      </b-datepicker>
      <b-timepicker v-model="closeDate"
                    style="padding-right: 10px"
                    placeholder="오픈할 시각을 선택하세요"
                    icon="clock"
                    mobile-native="true"
                    editable>
      </b-timepicker>
    </b-field>

    <br/>
    <b-field label="순서 (order) *">
      이벤트 배너가 게시되는 순서
      <b-input v-model="order" min="0"></b-input>
    </b-field>

    <br/>
    <b-field label="제목 (title) *">
      <b-input v-model="title"></b-input>
    </b-field>

    <br/>
    <div class="columns box">
      <b-field class="column" label="커버 이미지 URL (coverImageUrl) *">
        <p>
          메인화면에서 보여지는 커버 이미지 입니다.
          <b-input v-model="coverImageUrl"></b-input>
          <img v-bind:src="coverImageUrl" alt="커버 이미지가 보여집니다"/>
        </p>
      </b-field>

      <b-field class="column" label="내용 (contents) *">
        <p>
          배너 클릭시 보여질 디테일 화면 입니다.
          <b-field style="padding-bottom: 20px">
            <b-radio-button v-model="contentType"
                            native-value="image"
                            type="is-black">
              <span>Image URL</span>
            </b-radio-button>
            <b-radio-button v-model="contentType"
                            native-value="url"
                            type="is-black">
              <span>URL</span>
            </b-radio-button>
            <b-radio-button v-model="contentType"
                            native-value="html"
                            type="is-black">
              <span>HTML</span>
            </b-radio-button>
            <b-radio-button v-model="contentType"
                            native-value="deeplink"
                            type="is-black">
              <span>DeepLink</span>
            </b-radio-button>
          </b-field>
          <span v-if="contentType ==='image'">
            아래의 이미지가 앱 내에서 로딩됩니다 :
            <b-input v-model="contents"
                     placeholder="https://i.imgur.com/NBfLCwq.png"></b-input>
          </span>
          <span v-else-if="contentType ==='html'">
            아래의 HTML이 앱 내에서 로딩됩니다 :
            <b-input v-model="htmlContents" type="textarea"
                     placeholder="<html><body>......</body></html>"></b-input>
          </span>
          <span v-else-if="contentType ==='deeplink'">
            아래의 URL이 외부 브라우저로 로딩됩니다 :
            <b-input v-model="deeplink"
                     placeholder="https://www.notion.so/formakers/in-PlayX4-98aa3653d83843ecb96f55a5993c7987"></b-input>
          </span>
          <span v-else>
            아래의 URL이 앱 내에서 로딩됩니다 :
            <b-input v-model="contents"
                     placeholder="https://www.notion.so/formakers/in-PlayX4-98aa3653d83843ecb96f55a5993c7987"></b-input>
          </span>
          Preview:
          <br/>
          <span v-if="contentType ==='image'" v-html="mergeWithHtml(contents)"></span>
          <span v-else-if="contentType === 'html'" v-html="htmlContents"></span>
          <a v-else-if="contentType === 'deeplink'" v-bind:href="deeplink">
            이 링크가 외부 브라우저로 보여집니다 : {{deeplink}}</a>
          <a v-else v-bind:href="contents">{{contents}}</a>
        </p>
      </b-field>
    </div>

    <br/>
    <div class="buttons are-large">
      <button class="button is-primary is-fullwidth"
              v-on:click="registerEvent"><b>이벤트 등록</b></button>
    </div>

    <br/>
    <b-field v-if="result" label="Log">
      <b-message class="white-space-pre">{{ JSON.stringify(result, null, ' ') }}</b-message>
    </b-field>
  </div>
</template>

<script>
import request from '../common/http';

export default {
  name: 'Events',
  data() {
    return {
      order: 0,
      openDate: null,
      closeDate: null,
      title: '',
      coverImageUrl: '',
      contents: '',
      htmlContents: "<html><body><font size='10'>안녕하세요!<br/>이것은 링크가 아니라<br/><b>HTML코드가 하드코딩</b>되어있는 페이지에요<br/></font></body></html>",
      deeplink: '',
      result: null,
      contentType: 'image',
    };
  },
  methods: {
    mergeWithHtml(imageUrl) {
      return `<img style='width: 100%; object-fit: contain' src='${imageUrl}' title='source: imgur.com' />`;
    },
    registerEvent() {
      const body = {
        order: this.order,
        openDate: this.openDate,
        closeDate: this.closeDate,
        title: this.title,
        coverImageUrl: this.coverImageUrl,
      };

      if (this.contentType === 'image') {
        body.contents = this.mergeWithHtml(this.contents);
      } else if (this.contentType === 'html') {
        body.contents = this.htmlContents;
      } else if (this.contentType === 'deeplink') {
        body.deeplink = this.deeplink;
      } else {
        body.contents = this.contents;
      }

      request.post('/posts', body)
        .then((result) => {
          this.result = result;

          const toastMessage = '등록 성공!';

          if (result.status === 200) {
            this.showSuccessToast(toastMessage);
          } else {
            this.showErrorToast();
          }
        })
        .catch((err) => {
          this.result = err;
          this.showErrorToast();
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
  .events {
    text-align: start;
    padding: 30px;
  }

  .white-space-pre {
    white-space: pre-wrap;
  }
</style>
