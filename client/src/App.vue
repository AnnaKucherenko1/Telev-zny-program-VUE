<template>
  <NavBar :currentDay="currentDay" />
  <ErrorSnackBar v-model:snackbar="snackbar" :text="text" />
  <ProgramTV @errorEvent="toggleSnackbar"/>
</template>

<script>
import ErrorSnackBar from './components/ErrorSnackBar.vue';
import NavBar from './components/NavBar.vue';
import ProgramTV from './components/ProgramTV.vue';
import { getStations } from './services/api';

export default {
  name: 'App',
  components: {
    NavBar,
    ErrorSnackBar,
    ProgramTV,
  },
  created() {
    this.fetchStations().then((response) => {
      if (response === null || !response?.status || !response.result) {
        this.toggleSnackbar();
        return;
      }
      this.setStations(response.result);
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
  methods: {
    toggleSnackbar() {
      this.snackbar = !this.snackbar;
    },
    setStations(stations) {
      this.stations = stations;
    },
    async fetchStations() {
      return await getStations();
    },
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
