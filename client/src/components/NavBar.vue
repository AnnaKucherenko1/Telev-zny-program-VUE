<template>
  <div class="navbar">
    <div>
      <div class="border-for-img">
        <div class="elements-wrapper">
          <div class="current-day">{{ currentDay }}</div>
          <div class="images-div">
            <img src="./../assets/jojka.png" alt="logo jojka" class="jojka" />
            <img src="./../assets/markíza.png" alt="logo markiza" class="markiza" />
            <img src="./../assets/jednotka.png" alt="logo jednotka" class="jednotka" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from "vue";
export default defineComponent({
  name: 'NavBar',
  props: {
    currentDay: {
      type: String,
      default: 'dnes',
    },
  },
});
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  display: flex;
  background-color: white;
  flex-direction: column;
  padding-top: 35px;
  border: 1px;
  height: 9vh;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2);
  z-index: 5;
}

.current-day {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  height: 30px;
  width: 60px;
  color: white;
  font-size: 10px;
  border-radius: 30px;
  margin-top: -10px;
}

.elements-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11%
}

.jojka {
  height: 70px;
  width: 60px
}

.jednotka {
  height: 70px;
  width: 70px
}

.markiza {
  background-color: rgb(36, 36, 177);
  width: 130px;
  padding: 5px;
  border-radius: 10px;

}

.images-div {
  width: 45%;
  gap: 20%;
  justify-content: center;
  margin-right: 9%;
  display: flex;
  align-items: center;
}

.border-for-img {
  top: calc(0% - 150px);
}
</style>
