<template>
  <div class="navbar">
    <div class="logo">
      <!-- Logo on the left -->
      <img src="./../assets/systemomega-logo.png" alt="Logo" />
    </div>
    <div>
      <div class="borderForImg">
        <div class="images">
          <!-- Images on the right -->
          <div class="currentDay">hello {{ currentDay }}</div>
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
  /* justify-content: space-between; */
  flex-direction: column;
  /* align-items: center; */
  padding-top: 20px;
  border: 1px;
  height: 9vh;
  border-bottom: 2px solid #333;
}

/* Style for the logo */
.logo img {
  margin-left: 3%;
  height: 40px;
  margin-right: 10px;
}
.currentDay {
  background-color: black;
  height: 30px;
  color: white;
  /* z-index: 99; */
  width: 60px;
  border-radius: 10%;
  font-size: 10px;
}
/* Style for the images on the right */
.images {
  /* display: flex;
  align-items: flex-end;  */
width: 100%;
display: flex;
align-items: center;
justify-content: center;  
gap: 10%
/* background-color: black; */
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
/* Style for the border in the middle */
.borderForImg {
 margin-top: -30px;
}
</style>

