<template>
  <div class="tv-schedule">
    <div class="time-table" v-if="timeSlots">
      <div
        class="time-slot"
        :style="calculateSlotStyle(i)"
        v-for="(timeSlot, i) in this.timeSlots"
        :key="timeSlot"
      >
        <span v-if="i % this.numOfIntervals === 0 && timeSlot !== this.zeroTimeString">{{ timeSlot }}</span>
        <span v-else-if="i === 1">{{ this.zeroTimeString }}</span>
        <hr v-else-if="i % 10 === 0 && i % this.numOfIntervals !== 0" />
      </div>
    </div>
    <div
      class="channel-column"
      v-for="(channelSchedule, j) in channels"
      :key="j"
    >
      <div
        class="show-slot"
        v-for="(show, k) in channelSchedule"
        :key="show.id"
        :style="
          calculateShowStyle(
            show,
            channelSchedule[k + 1]?.time || null,
            j,
            channelSchedule.length
          )
        "
      >
        <div class="show-details">
          <div class="showTime" v-if="!show.isFromYesterday">{{ show.time }}</div>
          <strong>{{ show.title }}</strong>
          <img :src="channelData[j].imageSrc" alt="Channel Image" />
          <div class="info">{{ channelData[j].info }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { channelData } from '../channelData';

export default {
  name: 'TvSchedule',
  props: {
    channels: {
      type: [],
      default: [],
    },
  },
  data() {
    return {
      timeSlots: [],
      timeFrameHeight: 5,
      hoursPerDay: 24,
      intervalLengthMinutes: 1,
      minutesInHour: 60,
      milSecondsInSecond: 1000,
      channelData: channelData,
      midnightString: '24:00',
      numOfIntervals: 60,
      zeroTimeString: "00:00",
      exceptionHack: "04:50"
    };
  },
  computed: {
    timeSlotsFunction() {
      // calculates timeframe time slots
      const slots = [];
      const startTime = new Date().setHours(0, 0, 0, 0);
      for (let i = 0; i < this.hoursPerDay * this.numOfIntervals; i++) {
        const time = new Date(
          startTime +
            i *
              this.intervalLengthMinutes *
              this.minutesInHour *
              this.milSecondsInSecond
        );
        // formats the time
        const hours = time.getHours().toString().padStart(2, '0');
        const minutes = time.getMinutes().toString().padStart(2, '0');
        slots.push(`${hours}:${minutes}`);
      }
      return slots;
    },
  },
  mounted() {
    this.timeSlots = this.timeSlotsFunction;
    console.log("channels here: ", this.channels.target)
  },
  methods: {
    calculateShowStyle(show, endTime) {
      const startTime = show.time;
      const endTimeStr = endTime === null ? this.midnightString : endTime;

      const [startTimeHours, startTimeMinutes] = startTime.split(':');
      const [endTimeHours, endTimeMinutes] = endTimeStr.split(':');
      const startTimeTotalMinutes =
        parseInt(startTimeHours) * this.minutesInHour + parseInt(startTimeMinutes);
      const endTimeTotalMinutes =
        parseInt(endTimeHours) * this.minutesInHour + parseInt(endTimeMinutes);
      const gridRowStart = startTimeTotalMinutes / this.intervalLengthMinutes;

      // if 0 add + 1 because grid starts at row 1, not 0
      return {
        'grid-row-start': `${gridRowStart === 0 ? gridRowStart + 1 : gridRowStart}`,
        'grid-row-end': `${endTimeTotalMinutes / this.intervalLengthMinutes}`,
      };
    },
    calculateSlotStyle(index) {
      return {
        'grid-row-start': `${index - 1}`,
        'grid-row-end': `${index}`,
      };
    },
  }
};
</script>
<style scoped>
.tv-schedule {
  display: grid;
  background-color: #e7e7e7;
  width: 50%;
  grid-template-columns: auto repeat(3, 1fr);
  height: 7200px;
  /* grid-template-rows: repeat(288, 1fr);  */
  gap: 1px;
  font-family: Arial, sans-serif;
  padding-right: 5px;
}

.time-table {
  display: grid;
  height: 7200px;
  background-color: #ffffff;
  grid-template-rows: repeat(288, 5px);
  grid-template-columns: 1fr;
  text-align: right;
  padding-right: 10px;
}

.time-slot {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-size: 10px;
  height: 5px;
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

.channel-column {
  display: grid;
  grid-template-rows: repeat(288, 5px);
  grid-template-columns: 1fr;
}
.show-details {
  display: flex; flex-direction: column;
  gap: 2px; padding: 10px;
  font-size: 12px; 
}
.info {
  font-size: 8px;
}

.show-details img {
  width: 100%;
  height: 20%;
}
</style>
