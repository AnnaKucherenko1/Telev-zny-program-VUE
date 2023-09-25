<template>
  <div>
    <NavBar :currentDay="currentDay" />
    <ErrorSnackBar v-model:snackbar="snackbar" :text="text" />
    <div class="wrapper">
      <ProgramTV 
        v-if="stationIds.length"
        @fetchError="toggleSnackbar" 
        @dayChange="setCurrentDay" 
        :stationdIds="stations.map((station) => station.id)"
      />
      <div class="loader" v-if="!stationIds.length">
        <TvScheduleLoader />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ErrorSnackBar from './components/ErrorSnackBar.vue';
import TvScheduleLoader from './components/TvScheduleLoader.vue';
import NavBar from './components/NavBar.vue';
import ProgramTV from './components/ProgramTV.vue';
import { getStations } from './services/api';
import { Station, StationResult } from "./services/interfaces";

export default defineComponent({
  name: 'App',
  components: {
    NavBar,
    ErrorSnackBar,
    ProgramTV,
    TvScheduleLoader,
  },
  created() {
    this.fetchStations().then((response: StationResult | null) => {
      if (response === null || !response?.status || !response?.result?.length) {
        this.toggleSnackbar();
        return;
      }
      const stations = response.result;
      this.setStations(stations);
      this.setStationIdsFromStations(stations);
    });
  },
  data() {
    return {
      snackbar: false as boolean,
      text: `Ooops, something went wrong. Failed to fetch data, please refresh the page.` as string,
      currentDay: 'Dnes' as string,
      stations: [] as Station[],
      stationIds: [] as number[],
    };
  },
  methods: {
    toggleSnackbar() {
      this.snackbar = !this.snackbar;
    },
    setCurrentDay(day: string) {
      this.currentDay = day;
    },
    setStations(stations: Station[]) {
      this.stations = stations;
    },
    async fetchStations() {
      return await getStations();
    },
    setStationIdsFromStations(stations: Station[]) {
      this.stationIds = stations.map((station) => station.id);
    },
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  width: 50%;
  height: 7200px;
}
</style>