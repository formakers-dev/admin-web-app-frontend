<template>
  <section>
    <header-nav></header-nav>
    <p class="version">
      {{buildType}}-v{{version}}
    </p>
    <router-view class="container is-fluid" style="padding-top: 30px"/>
  </section>
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
    overflow-y: auto !important;
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
    height: auto;
    width: 90%;
    max-width: 1000px !important;
    box-shadow: 0px 0px 55px 0px rgba(0,0,0,0.6);
  }
  .version{
    margin-right:10px;
    margin-top:-20px;
    font-size: 11px;
    text-align: right;
    color:darkgray;
  }
  .message{
    margin : 10px 0;
  }

  .is-divider{
    height: 1px;
    margin: 20px 0;
  }
  .is-vertical-divider {
    width: 1px;
    background: lightgray;
    margin: 0 20px;
  }
  .datepicker{
    width: 290px;
  }
  .modal-card {
    width: auto;
  }
  .white-space-pre {
    white-space: pre-wrap;
  }
  .modal-card .field{
    margin-bottom:1rem;
  }
  .modal-card-body{
    display: flex;
    align-content: center;
    justify-content: center;
  }
  .table td, .table th{
    vertical-align: middle !important;
  }
  .tabs.is-boxed li.is-active a{
    font-weight: bold;
    border-color: #12121c !important;
    background-color: #12121c !important;
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
