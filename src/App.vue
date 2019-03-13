<template>
  <div id="app">
    <div id="nav">
      <div id="title"><b>운영 페이지</b> - {{ buildType }}</div>
      <router-link to="/">Admin Home</router-link> |
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
