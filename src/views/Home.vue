<template>
  <div class="home">
    <div class="center">
      <div class="title">👩🏻‍🎨👩🏻‍💻👨🏻‍💻👨🏻‍💻</div>
      <div class="sub-title">
        <b style="color: #00BFBA">포메이커스</b>의
        <b style="color: #F8AB1C">운영</b>페이지</div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'home',
};
</script>

<style scoped>
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.title {
  font-size: 100px;
}

.sub-title {
  font-size: 20px;
}
</style>
