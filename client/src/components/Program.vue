<template>
    <div class="tv-schedule">
      <div class="time-table" v-if="timeSlots">
        <div class="time-slot" :style="calculateSlotStyle(index)" v-for="(timeSlot, index) in this.timeSlots" :key="timeSlot">
          <span v-if="index % 12 === 0">{{ timeSlot }}</span>
          <hr v-else>
        </div>
      </div>
      <div class="channel-column" v-for="(channelShows, index) in channels" :key="index">
        <div class="show-slot" :style="calculateShowStyle(show, channelShows[j +1]?.time || null, j, channelShows.length)" v-for="(show, j) in channelShows" :key="show.id">
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
  data() {
    return {
      channels: [],
      timeSlots: [],
      timeFrameHeigh: 25,
    };
  },
  computed: {
    timeSlotsFunction() {
      const slots = [];
      // TODO: Get rid of magic numbers
      const startTime = new Date().setHours(0, 0, 0, 0); 
      for (let i = 0; i < 24 * 12; i++) {
        const time = new Date(startTime + i * 5 * 60 * 1000);
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        slots.push(`${hours}:${minutes}`);
      }
      return slots;
    }
  },
  mounted() {
    this.timeSlots = this.timeSlotsFunction;
  },
  created() {
    this.fetchPrograms().then((response) => {
      console.log(response, 'getprograms');
      if (response === null) {
        this.toggleSnackbar();
        return;
      } else {
        const jojka =
          response['module:com_playground/tv/tv/getProgram#1']?.result;
        const markiza =
          response['module:com_playground/tv/tv/getProgram#2']?.result;
        const jednotka =
          response['module:com_playground/tv/tv/getProgram#3']?.result;

        if (jojka === null || markiza === null || jednotka === null) {
          this.toggleSnackbar();
          return;
        }

        this.channels.push(
          jojka.sort(this.compareTimeStrings), 
          markiza.sort(this.compareTimeStrings), 
          jednotka.sort(this.compareTimeStrings)
        );
        console.log(this.channels, 'this chnanels')
        console.log(jojka, markiza, jednotka, 'lll')
        
      }
    });
  },
  methods: {
    calculateShowStyle(show, endTime) {
      const startTime = show.time; 
      const endTimeStr = endTime === null ? "24:00" : endTime;

      const [startTimeHours, startTimeMinutes] = startTime.split(":");
      const [endTimeHours, endTimeMinutes]     = endTimeStr.split(":");
      const startTimeTotalMinutes              = parseInt(startTimeHours) * 60 + parseInt(startTimeMinutes);
      const endTimeTotalMinutes                = parseInt(endTimeHours) * 60 + parseInt(endTimeMinutes);

      return {
        'grid-row-start': `${(startTimeTotalMinutes / 5)}`,
        'grid-row-end': `${(endTimeTotalMinutes / 5)}`,
      };
    },
    calculateSlotStyle(index) {
      return {
        'grid-row-start': `${index - 1}`,
        'grid-row-end': `${index}`,
      };
    },
    toggleSnackbar() {
      this.snackbar = !this.snackbar;
    },
    compareTimeStrings(a, b) {
      const [hoursA, minutesA] = a.time.split(":").map(Number);
      const [hoursB, minutesB] = b.time.split(":").map(Number);

      if (hoursA === hoursB) {
        return minutesA - minutesB;
      }

      return hoursA - hoursB;
    },
    async fetchPrograms() {
      return await getPrograms();
    },
  },
};
</script>

<style scoped>

.wrapper {
  display: flex;
  flex-direction: column;
  height: auto;
}
.tv-schedule {
  display: grid;
  grid-template-columns: auto repeat(3, 1fr); 
  grid-template-rows: repeat(288, 1fr); 
  gap: 5px;
  font-family: Arial, sans-serif;
  padding: 20px;
}

.channel-column {
  display: grid; 
  grid-template-rows: repeat(288, 25px); 
  grid-template-columns: 1fr;
  border-top: solid 1px red;
}

.time-table {
  display: grid; 
  grid-template-rows: repeat(288, 25px); 
  grid-template-columns: 1fr;
  text-align: right;
  padding-right: 10px;
}

.time-slot {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-size: 10px;
  height: 25px;
  width: 50px;
}

.channel-name {
  font-weight: bold;
  text-align: center;
}

.show-slot {
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  padding: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.show-slot:hover {
  background-color: #e0e0e0;
}
</style>
