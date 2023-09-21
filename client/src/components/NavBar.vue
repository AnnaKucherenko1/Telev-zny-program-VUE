<template>
  <div class="navbar">
    <div class="logo">
      <img src="./../assets/systemomega-logo.png" alt="Logo" />
    </div>
    <div>
      <div class="borderForImg">
        <div class="images">
          <div class="currentDay">{{ currentDay }}</div>
      <img src="./../assets/jojka.png" alt="logo jojka" class="jojka"/>
      <img src="./../assets/markíza.png" alt="logo markiza" class="markiza"/>
      <img src="./../assets/jednotka.png" alt="logo jednotka" class="jednotka"/>
    </div>
   </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    currentDay: {
      type: String,
      default: 'dnes', 
    },
  }
};
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  display: flex;
  background-color: white;
  flex-direction: column;
  padding-top: 20px;
  border: 1px;
  height: 9vh; 
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.2)
}

.logo img {
  margin-left: 3%;
  height: 40px;
  margin-right: 10px;
}
.currentDay {
  background-color: black;
  height: 30px;
  color: white;
  width: 60px;
  border-radius: 10%;
  font-size: 10px;
}

.images {
width: 100%;
display: flex;
align-items: center;
justify-content: center;  
gap: 10%
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
.borderForImg {
 margin-top: -30px;
}
</style>

