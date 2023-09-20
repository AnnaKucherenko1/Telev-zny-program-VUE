<template>
  <NavBar :currentDay="currentDay"/>
  <ErrorSnackBar v-model:snackbar="snackbar" :text="text" />
  <!-- <div v-for="(station, index) in stations" :key="index">
    {{ station.title }}
  </div> -->
  <Program />
</template>

<script>
  import ErrorSnackBar from './components/ErrorSnackBar.vue';
import NavBar from './components/NavBar.vue';
import Program from './components/Program.vue';
  import { getStations } from './services/api'; 

  export default {
    name: 'App',
    components: {
    NavBar,
    ErrorSnackBar,
    Program
},
    created() {
      this.fetchStations()
      .then((response) => {
        console.log(response);
        if (response === null || !response?.status || !response.result) {
          this.toggleSnackbar();
          return;
        }
        this.setStations(response.result);
        console.log("fetched: ", response);
      });
    },
    data() {
      return {
        snackbar: false,
        text: `Ooops, something went wrong. Failed to fetch data, please refresh the page.`,
        currentDay: 'dnes',
        stations: [],
      };
    },
    mounted() {
      window.addEventListener('scroll', this.updateCurrentDay);
    },
    beforeUnmount() {
      window.removeEventListener('scroll', this.updateCurrentDay);
    },
    
    methods: {
      updateCurrentDay() {
        const scrollPosition = window.scrollY;
        if (scrollPosition < 500) {
          this.currentDay = 'dnes'; 
        } else if (scrollPosition < 1000) {
          this.currentDay = 'včera'; 
        } else if (scrollPosition < 1500) {
          this.currentDay = 'zajtra'; 
        } else {
          this.currentDay = 'pozajtra'; 
        }
      },
      toggleSnackbar() {
        this.snackbar = !this.snackbar;
      },
      setStations(stations) {
        this.stations = stations;
      },
      async fetchStations() {
        return await getStations();
      }
    },
  };
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
