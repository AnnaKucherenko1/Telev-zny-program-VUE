<template>
  <div
    class="wrapper"
    v-for="(channels, index) in channelsAllDays"
    :key="index"
    @autoscroll.prevent
  >
    <div class="tv-schedule">
      <div class="time-table" v-if="timeSlots">
        <div
          class="time-slot"
          :style="calculateSlotStyle(index)"
          v-for="(timeSlot, index) in this.timeSlots"
          :key="timeSlot"
        >
          <span v-if="index % 12 === 0">{{ timeSlot }}</span>
          <hr id="hr" v-else />
        </div>
      </div>
      <div
        class="channel-column"
        v-for="(channelShows, index) in channels"
        :key="index"
      >
        <div
          class="show-slot"
          :style="
            calculateShowStyle(
              show,
              channelShows[j + 1]?.time || null,
              j,
              channelShows.length
            )
          "
          v-for="(show, j) in channelShows"
          :key="show.id"
        >
          <div class="show-details">
            <div class="showTime">{{ show.time }}</div>
            <strong>{{ show.title }}</strong>
            <img :src="channelData[index].imageSrc" alt="Channel Image" />
            <div class="info">{{ channelData[index].info }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getPrograms } from '../services/api';
import { channelData } from '../channelData'

export default {
  name: 'NavBar',
  data() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    return {
      channelsAllDays: [],
      timeSlots: [],
      timeFrameHeigh: 25,
      date: formattedDate,
      hasRun: false,
      yesterday: false,
      channelData: channelData,
      
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
    },
  },
  mounted() {
    this.timeSlots = this.timeSlotsFunction;
    document.addEventListener('scroll', this.handleScroll);
    document.addEventListener('wheel', this.handleWheel);
  },
  beforeUnmount() {
    document.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('wheel', this.handleWheel);
  },
  created() {
    this.fetchPrograms().then(this.fetchProgramCallback);
  },
  methods: {
    calculateShowStyle(show, endTime) {
      const startTime = show.time;
      const endTimeStr = endTime === null ? '24:00' : endTime;

      const [startTimeHours, startTimeMinutes] = startTime.split(':');
      const [endTimeHours, endTimeMinutes] = endTimeStr.split(':');
      const startTimeTotalMinutes =
        parseInt(startTimeHours) * 60 + parseInt(startTimeMinutes);
      const endTimeTotalMinutes =
        parseInt(endTimeHours) * 60 + parseInt(endTimeMinutes);

      return {
        'grid-row-start': `${startTimeTotalMinutes / 5}`,
        'grid-row-end': `${endTimeTotalMinutes / 5}`,
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
      const [hoursA, minutesA] = a.time.split(':').map(Number);
      const [hoursB, minutesB] = b.time.split(':').map(Number);

      if (hoursA === hoursB) {
        return minutesA - minutesB;
      }

      return hoursA - hoursB;
    },
    async fetchPrograms() {
      return await getPrograms(this.date, 'abc002');
    },
    async fetchTomorrowPrograms() {
      return await getPrograms('2023-09-22', 'abc003');
    },
    async fetchYesterdayPrograms() {
      return await getPrograms('2023-09-20', 'abc004');
    },
    fetchProgramCallback (response, isYesterday = false) {
      if (response === null) {
        this.toggleSnackbar();
        return;
      } 

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

      if (isYesterday) {
        this.channelsAllDays.unshift(
          [jojka?.sort(this.compareTimeStrings),
          markiza?.sort(this.compareTimeStrings),
          jednotka?.sort(this.compareTimeStrings)]
        );
      } else {
        this.channelsAllDays.push(
          [jojka?.sort(this.compareTimeStrings),
          markiza?.sort(this.compareTimeStrings),
          jednotka?.sort(this.compareTimeStrings)]
        );
      }
    },
    handleWheel(event) {
      const scrollY = window.scrollY;
      if (scrollY <= 0 && event.deltaY <= 0 && !this.yesterday) {
        console.log("fetching again on scroll");
        this.yesterday = true;
        this.fetchYesterdayPrograms().then((response) => 
          this.fetchProgramCallback(response, true));
      }
    },
    handleScroll() {
      const containerHeightMin = 6400;
      const containerHeightMax = 6500
      const scrollHeight = Math.round(window.scrollY);
      if (scrollHeight > containerHeightMin && scrollHeight < containerHeightMax && !this.hasRun) {
        console.log('heu');
        this.hasRun = true;
        this.fetchTomorrowPrograms().then(this.fetchProgramCallback);
      }
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
}
.tv-schedule {
  display: grid;
  background-color: #e7e7e7;
  width: 50%;
  grid-template-columns: auto repeat(3, 1fr);
  /* grid-template-rows: repeat(288, 1fr);  */
  gap: 1px;
  font-family: Arial, sans-serif;
  padding-right: 5px;
}

.channel-column {
  display: grid;
  grid-template-rows: repeat(288, 25px);
  grid-template-columns: 1fr;
}
.show-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px;
  font-size: 12px;
}
.info {
  font-size: 8px;
}

.show-details img {
  width: 100%;
  height: 20%;
}
.time-table {
  display: grid;
  background-color: #ffffff;
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
  width: 80px;
}

.show-slot {
  border: 1px solid #ccc;
  background-color: #ffffff;
  border-radius: 10px;
  /* padding: 5px; */
  cursor: pointer;
  transition: background-color 0.3s;
}


.show-slot:hover {
  background-color: #e0e0e0;
}

</style>
