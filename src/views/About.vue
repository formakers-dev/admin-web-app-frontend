<template>
  <div class="about">
    <img src="../assets/formakers-meeting.jpg"/>
    <div class="bg-text">
      우리는 '포메이커스' 입니다! 😃
      <div class="sub-text">제품과 서비스를 만드는 사람들이 계속 도전하고 성장할 수 있는 사회를 만듭니다.</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'about',
};
</script>

<style scoped>
  body, html {
    height: 100%;
  }

  * {
    box-sizing: border-box;
  }

  img {
    filter: blur(2px);
    -webkit-filter: blur(2px);

    /* Full height */
    max-height: 100%;
    max-width: 100%;
  }

  .bg-text {
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
    color: white;
    font-weight: bold;
    font-size: 50px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    width: 100%;
    padding: 10px;
    text-align: center;
  }

  .bg-text .sub-text {
    font-size: 20px;
    font-weight: normal;
  }
</style>
