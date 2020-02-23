<template>
  <div>
    <header-nav></header-nav>
    <router-view class="container is-fluid"/>
  </div>
</template>

<script>
import Headers from './common/components/Headers.vue';

const packageJson = require('../package.json');

export default {
  components: {
    'header-nav': Headers,
  },
  data() {
    return {
      buildType: process.env.NODE_ENV,
      version: JSON.stringify(packageJson.version).replace(/"/g, ''),
    };
  },
};
</script>

<style>
  html{
    width: 100%;
    height: 100%;
    background-color : #f4f7fa !important;
    word-break: keep-all;
  }
  .container{
    margin: 0 auto !important;
    width: 85% !important;
  }
  .modal > .modal-background{
    background-color: transparent;
  }
  .modal > .animation-content{
    z-index: 99;
    height: 90%;
    width: 90%;
    box-shadow: 0px 0px 55px 0px rgba(0,0,0,0.6);
  }
  .message{
    margin : 10px 0;
  }

  .is-divider{
    height: 1px;
    margin: 20px 0;
  }
  .is-divider-vertical {
    width: 1px;
    background: lightgray;
    margin: 0 20px;
  }
  .datepicker{
    width: 290px;
  }
</style>

<style lang="scss">
  // Import Bulma's core
  @import "~bulma/sass/utilities/_all";

  // Set your colors
  $primary: #00BFBA;
  $primary-invert: findColorInvert($primary);
  $twitter: #4099FF;
  $twitter-invert: findColorInvert($twitter);

  // Setup $colors to use as bulma classes (e.g. 'is-twitter')
  $colors: (
    "white": ($white, $black),
    "black": ($black, $white),
    "light": ($light, $light-invert),
    "dark": ($dark, $dark-invert),
    "primary": ($primary, $primary-invert),
    "info": ($info, $info-invert),
    "success": ($success, $success-invert),
    "warning": ($warning, $warning-invert),
    "danger": ($danger, $danger-invert),
    "twitter": ($twitter, $twitter-invert)
  );

  // Links
  $link: $primary;
  $link-invert: $primary-invert;
  $link-focus-border: $primary;

  // Import Bulma and Buefy styles
  @import "~bulma";
  @import "~buefy/src/scss/buefy";
</style>
