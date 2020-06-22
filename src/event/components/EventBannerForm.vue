<template>
<div class="modal-card event-bannner-container">
  <header class="modal-card-head">
    <p class="modal-card-title">이벤트 배너 정보 {{type === 'modify'? "수정하기" : "등록하기"}}</p>
    <p><font color="red">필수 값 *</font></p>
  </header>
  <section class="modal-card-body">
    <div class="columns" style="width: 100%; height: max-content">
      <div class="column" style="overflow-y: auto">
        <b-field v-if="data._id" label="이벤트 배너 아이디" horizontal
                 style="background: #f5f5f5; padding: 10px">
          {{data._id}}
        </b-field>
        <div class="columns" style="width: 100%; height: max-content">
          <div class="column" style="overflow-y: auto">
            <img v-if='data.coverImageUrl' :src="data.coverImageUrl" alt="커버 이미지가 보여집니다"/>
            <div v-else class="preview-container">
              <strong>커버 이미지 URL을 입력해주세요.</strong>
            </div>
            <div v-if="contentType==='deeplink'" class="preview-container"
                 style="min-height: 500px">
              <strong>Deeplink는 미리보기를 할 수 없습니다.</strong><br>
              <a
                href="https://www.notion.so/formakers/5b0a7915bc7a4417a1d1e414eb3fd229?v=5a411dfdb0904d7da7e5e1582db290e7"
                target="_blank">* Deeplink 스펙보러가기</a>
            </div>
            <div v-else-if="data.contents && contentType==='html'" v-html="data.contents"></div>
            <div v-else-if="data.contents && contentType==='url'">
              <strong>아래의 링크를 클릭하여 확인해주세요.</strong><br>
              <a :href="data.contents" target="_blank">{{data.contents}}</a>
            </div>
            <div v-else-if="data.contents && contentType==='image'">
              <img :src="data.contents"/>
            </div>
            <div v-else class="preview-container" style="min-height: 500px">
              <strong>내용을 입력해주세요.</strong>
            </div>
          </div>
          <div class="column">
            <b-field>
              <template slot="label">
                <span class="has-text-danger">*</span> 오픈 시각
              </template>
              <b-datetimepicker v-model="data.openDate"
                                rounded
                                icon="calendar-today"
                                placeholder="오픈할 시각를 선택해주세요.">
              </b-datetimepicker>
            </b-field>
            <b-field>
              <template slot="label">
                <span class="has-text-danger">*</span> 종료 시각
              </template>
              <b-datetimepicker v-model="data.closeDate"
                                rounded
                                icon="calendar-today"
                                placeholder="종료할 시각를 선택해주세요.">
              </b-datetimepicker>
            </b-field>
            <b-field>
              <template slot="label">
                <span class="has-text-danger">*</span> 제목
              </template>
              <b-input v-model="data.title"
                       validation-message="필수 입력 값입니다."
                       required
              ></b-input>
            </b-field>
            <b-field>
              <template slot="label">
                <span class="has-text-danger">*</span> 커버 이미지 URL
                <b-tooltip type="is-dark"
                           label="메인화면에서 보여지는 커버 이미지입니다."
                           position="is-right"
                >
                  <b-button class="is-white"
                            style="margin-left: -15px; background: transparent;"
                            rounded>
                    <b-icon size="is-small" icon="help-circle-outline"></b-icon>
                  </b-button>
                </b-tooltip>
              </template>
              <b-input v-model="data.coverImageUrl"
                       validation-message="필수 입력 값입니다."
                       required
              ></b-input>
            </b-field>
            <b-field>
              <template slot="label">
                <span class="has-text-danger">*</span> 내용
                <b-tooltip type="is-dark"
                           label="배너 클릭시 보여질 디테일 화면 입니다."
                           position="is-right"
                           multilined>
                  <b-button class="is-white"
                            style="margin-left: -15px; background: transparent;"
                            rounded>
                    <b-icon size="is-small" icon="help-circle-outline"></b-icon>
                  </b-button>
                </b-tooltip>
              </template>
              <b-field>
                <b-radio-button v-for="type in contentTypes"
                                :key="type.value"
                                v-model="contentType"
                                :native-value="type.value" required>
                  <span>{{type.text}}</span>
                </b-radio-button>
              </b-field>
            </b-field>
            <b-field v-if="contentType === 'url'">
              <b-checkbox v-model="checkedExternalBrowser">
                외부 브라우져로 띄우기
              </b-checkbox>
            </b-field>
            <b-field v-if="contentType != 'deeplink'">
           <textarea v-if="contentType === 'html'"
                     v-model="data.contents"
                     style="margin: 0px; height: 270px; width: 415px; resize: vertical;"
           ></textarea>
              <b-input v-else v-model="data.contents"
                       validation-message="필수 입력 값입니다."
                       required
              ></b-input>
            </b-field>
            <b-field v-else>
              <b-input v-model="data.deeplink"
                       validation-message="필수 입력 값입니다."
                       required
              ></b-input>
            </b-field>
            <strong v-if="contentType==='url'" class="has-text-danger">* 이미지 파일의 경우 Image URL 을
              선택해주세요.</strong>
          </div>
        </div>
      </div>
    </div>
  </section>
  <footer class="modal-card-foot">
    <button class="button" type="button" @click="close">닫기</button>
    <button v-if="type==='add'" class="button  is-primary" type="button" @click="submit">이벤트 배너 추가</button>
    <button v-else class="button  is-primary" type="button" @click="submit">이벤트 배너 수정</button>
  </footer>
</div>
</template>

<script>
import moment from 'moment';
import request from '../../common/utils/http';

export default {
  name: 'EventBannerForm.vue',
  components: {
  },
  props: {
    value: {
      type: Object,
      default() {
        return null;
      },
    },
    type: {
      type: String,
      default() {
        return 'add';
      },
    },
    counts: {
      type: Object,
      default() {
        return Object.assign({}, { open: 0, close: 0, ready: 0 });
      },
    },
  },
  data() {
    return {
      disabled: false,
      contentTypes: [
        { text: 'Image URL', value: 'image' },
        { text: 'HTML', value: 'html' },
        { text: 'URL', value: 'url' },
        { text: 'Deeplink', value: 'deeplink' },
      ],
      contentType: 'image',
      checkedExternalBrowser: false,
      data: {
        _id: '',
        order: 0,
        title: '',
        coverImageUrl: '',
        contents: '',
        deeplink: '',
        openDate: new Date(),
        closeDate: new Date(),
      },
    };
  },
  mounted() {
    // modal type
    if (this.type === 'modify') {
      if (this.value.deeplink) {
        if (this.value.deeplink.toLocaleLowerCase().startsWith('fomes://web/external?url=')) {
          this.value.contents = this.value.deeplink;
          this.contentType = 'url';
          this.checkedExternalBrowser = true;
          this.value.deeplink = null;
        } else {
          this.contentType = 'deeplink';
        }
      } else if (this.value.contents.startsWith('<img')) {
        this.contentType = 'image';
      } else if (this.value.contents.toLocaleLowerCase().startsWith('http')) {
        this.contentType = 'url';
      } else if (this.value.contents.startsWith('<')) {
        this.contentType = 'html';
      }
      this.data = Object.assign({}, this.value);
      this.data.openDate = new Date(this.value.openDate);
      this.data.closeDate = new Date(this.value.closeDate);
      if (this.contentType === 'image') {
        this.data.contents = this.getImageUrl(this.data.contents);
      } else if (this.checkedExternalBrowser) {
        this.data.contents = this.getExternalBrowserUrl(this.data.contents);
      }
    } else {
      this.data.order = this.length + 1;
    }
  },
  methods: {
    getImageUrl(value) {
      const firstIndex = value.indexOf("src='") + 5;
      const lastIndex = value.indexOf("'", firstIndex);
      return value.substring(firstIndex, lastIndex);
    },
    getExternalBrowserUrl(value) {
      const str = 'fomes://web/external?url=';
      const firstIndex = value.indexOf(str) + str.length;
      return value.substring(firstIndex, value.length);
    },
    mergeWithHtml(imageUrl) {
      return `<img style='width: 100%; object-fit: contain' src='${imageUrl}' title='source: imgur.com' />`;
    },
    validate() {
      if (this.data.coverImageUrl && this.data.title) {
        if (this.contentType === 'deeplink' && this.data.deeplink) {
          return true;
        }
        if (this.checkedExternalBrowser && this.data.contents) {
          return true;
        }
        if (this.contentType !== 'deeplink' && this.data.contents) {
          return true;
        }
      }
      const open = moment(this.data.openDate);
      const close = moment(this.data.closeDate);
      if (!open.isSameOrBefore(close)) {
        this.$root.showErrorToast('오픈 시각과 종료 시각을 다시 한번 확인해주세요.', '');
      } else {
        return true;
      }
      return false;
    },
    close() {
      this.$emit('close', false);
    },
    submit() {
      if (!this.validate()) {
        this.$root.showErrorToast('입력 값들을 다시 한번 확인해주세요.', '필수 값을 입력해주세요');
        return;
      }
      const status = this.getStatus(this.data.openDate, this.data.closeDate);
      if (this.type === 'add') {
        if (status === 1) {
          this.data.order = this.counts.open + 1;
        } else if (status === 2) {
          this.data.order = this.counts.open + this.counts.close + 1;
        } else {
          this.data.order = 99999;
        }
      }
      const body = {
        order: this.data.order,
        openDate: this.data.openDate,
        closeDate: this.data.closeDate,
        title: this.data.title,
        coverImageUrl: this.data.coverImageUrl,
      };
      if (this.type === 'modify') {
        body._id = this.data._id;
      }
      if (this.contentType === 'image') {
        body.contents = this.mergeWithHtml(this.data.contents);
      } else if (this.contentType === 'html') {
        body.contents = this.data.contents;
      } else if (this.contentType === 'deeplink') {
        body.deeplink = this.data.deeplink;
      } else if (this.contentType === 'url') {
        if (this.checkedExternalBrowser) {
          body.deeplink = `fomes://web/external?url=${this.data.contents}`;
        } else {
          body.contents = this.data.contents;
        }
      } else {
        this.$root.showErrorToast('잘못된 내용 입니다.', '');
        return;
      }
      const url = this.type === 'modify' ? `/api/posts/${this.data._id}` : '/api/posts';
      request({
        url,
        method: this.type === 'modify' ? 'put' : 'post',
        data: body,
      }).then((res) => {
        this.$root.showSuccessToast('이벤트 배너를 정상적으로 등록하였습니다.');
        this.$emit('close', true);
      }).catch((err) => {
        this.$root.showErrorToast('이벤트 배너 등록에 실패하였습니다.', err);
      });
    },
    getStatus(openDate, closeDate) {
      const current = moment();
      if (current.isBetween(openDate, closeDate)) {
        return 1; // open
      }
      if (current.isBefore(openDate)) {
        return 2; // ready
      }
      return 3; // close
    },
  },
};
</script>

<style scoped>
  .event-bannner-container {
    width: auto;
  }
  .white-space-pre {
    white-space: pre-wrap;
  }
  .event-bannner-container .field{
    margin-bottom:1rem;
  }
  .event-bannner-container{
    display: flex;
    align-content: center;
    justify-content: center;
  }
  .preview-container{
    height: 187px;
    border: 3px #00BFBA dashed;
    text-align: center;
    margin-bottom: 10px;
  }
  .iframe-url{
    height: 500px !important;
    width: 100% !important;
  }
</style>
