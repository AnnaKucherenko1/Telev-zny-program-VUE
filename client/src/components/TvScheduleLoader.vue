<template>
  <div class="shimmerBG">
  </div>
</template>

<script>
export default {
  name: 'TvScheduleLoader',
};
</script>
<style scoped>
  .loader {
    width: 50%;
    height: 2500px;
  }

  .shimmerBG {
    width: 100%; height: 100%;
    animation-duration: 2.2s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: shimmer;
    animation-timing-function: linear;
    background: grey;
    background: linear-gradient(to right, #F6F6F6 8%, #F0F0F0 18%, #F6F6F6 33%);
    background-size: 1200px 100%;
  }

  @-webkit-keyframes shimmer {
    0% {
        background-position: -100% 0;
    }
    100% {
        background-position: 100% 0;
    }
  }

  @keyframes shimmer {
      0% {
          background-position: -1200px 0;
      }
      100% {
          background-position: 1200px 0;
      }
  }
</style>