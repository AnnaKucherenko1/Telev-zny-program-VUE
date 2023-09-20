<template>
  <div class="tv-schedule">
    <div class="time-slots" v-for="timeSlot in timeSlots" :key="timeSlot">
      {{ timeSlot }}
    </div>

    <div v-for="(channelShows, index) in channels" :key="index">
      <div class="show-slot" v-for="show in channelShows" :key="show.id">
        <div class="show-details">
          <div class="show-title">{{ show.title }}</div>
          <div class="show-time">{{ show.time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getPrograms } from '../services/api';
export default {
  name: 'NavBar',
  // props: {
  //   currentDay: {
  //     type: String,
  //     default: 'dnes',
  //   },
  // }
  data() {
    return {
      timeSlots: [], 
      channels: [], 
    };
  },
  computed: {
    timeSlotsFunction() {
      const slots = [];
      const startTime = new Date().setHours(0, 0, 0, 0); 
      for (let i = 0; i < 24 * 12; i++) {
        const time = new Date(startTime + i * 5 * 60 * 1000);
        slots.push(
          time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        );
      }
      return slots;
    },
  },
  created() {
    this.fetchStations().then((response) => {
      console.log(response, 'getprograms');
      if (response === null) {
        this.toggleSnackbar();
        return;
      } else {
        const jojka =
          response['module:com_playground/tv/tv/getProgram#1'].result;
        const markiza =
          response['module:com_playground/tv/tv/getProgram#2'].result;
        const jednotka =
          response['module:com_playground/tv/tv/getProgram#3'].result;
        this.channels.push(jojka, markiza, jednotka);
        console.log(this.channels, 'this chnanels')
        console.log(jojka, markiza, 'lll')
        
      }
    });
  },
  methods: {
    toggleSnackbar() {
      this.snackbar = !this.snackbar;
    },
    async fetchStations() {
      return await getPrograms();
    },
  },
};
</script>

<style scoped>
.tv-schedule {
  display: grid;
  grid-template-columns: auto repeat(3, 1fr); /* 3 channels */
  grid-gap: 10px;
  font-family: Arial, sans-serif;
  padding: 20px;
}

/* Style time slots on the left */
.time-slots {
  grid-column: 1;
  text-align: right;
  font-weight: bold;
  padding-right: 10px;
}

/* Style channel names and show slots */
.channel-name {
  font-weight: bold;
  text-align: center;
}

.show-slot {
  grid-column: span 1; /* Show slot spans 1 column */
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  padding: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.show-slot:hover {
  background-color: #e0e0e0;
}
</style>
