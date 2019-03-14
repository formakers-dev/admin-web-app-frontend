<template>
  <div id="app">
    <div id="nav">
      <div id="title">ADMIN <b>{{ buildType.toUpperCase() }}</b></div>
      <router-link to="/">홈</router-link> |
      <router-link to="/noti-sender">알림 보내기</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
const config = require('../config');

export default {
  data() {
    return {
      buildType: config.env,
    };
  },
};
</script>

<style>
* { margin: 0 !important; }

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #505050;
}

#nav {
  padding: 10px;
  background-color: #505050;
}

#nav #title {
  font-size: 30px;
  color: #ffffff;
}

#nav a {
  font-weight: bold;
  color: #808080;
}

#nav a.router-link-exact-active {
  color: #00BFBA;
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
