<template>
  <div class="tv-schedule">
    <div class="time-table" v-if="timeSlots">
      <div
        class="time-slot"
        :style="calculateSlotStyle(i)"
        v-for="(timeSlot, i) in this.timeSlots"
        :key="timeSlot"
      >
        <span class="time-slot-span" v-if="i % this.numOfIntervals === 0 && timeSlot !== this.zeroTimeString">
          <div class="time">
            {{ timeSlot }}
          </div>
        </span>
        <span class="time-slot-span" v-else-if="i === 1">
          <div class="time new-day">
            {{ this.zeroTimeString }}
          </div>
        </span>
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
        :key="(show.id)"
        :style="
          calculateShowStyle(
            show,
            channelSchedule[k + 1]?.time || null,
            k === 0,
            k === channelSchedule.length - 1
          )
        "
      >
        <div class="show-details">
          <div class="showTime" v-if="!show.isFromYesterday">{{ show.time }}</div>
          <strong v-if="k !== channelSchedule.length - 1">{{ show.title }}</strong>
          <img class="show-image" v-if="k !== channelSchedule.length - 1" :src="showDetails[j].imageSrc" alt="Show Image" />
          <div class="info" v-if="k !== channelSchedule.length - 1">{{ showDetails[j].info }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ShowDetails, showDetails } from '../showDetails';
import { defineComponent } from "vue";
import { Program } from '../services/interfaces';

export default defineComponent({
  name: 'TvSchedule',
  props: {
    channels: {
      type: Array<Program>,
      default: [],
    },
  },
  data() {
    return {
      timeSlots: [] as string[],
      timeFrameHeight: 5 as number,
      hoursPerDay: 24 as number,
      intervalLengthMinutes: 1 as number,
      minutesInHour: 60 as number,
      milSecondsInSecond: 1000 as number,
      showDetails: showDetails as ShowDetails[],
      midnightString: '24:00' as string,
      numOfIntervals: 60 as number,
      zeroTimeString: "00:00" as string,
      exceptionHack: "04:50" as string,
    };
  },
  mounted() {
    this.timeSlots = this.timeSlotsFunction();
  },
  methods: {
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
    calculateShowStyle(show: Program, endTime: string, isFirst: boolean, isLast: boolean) {
      const startTime = show.time;
      const endTimeStr = endTime === null ? this.midnightString : endTime;

      const [startTimeHours, startTimeMinutes] = startTime.split(':');
      const [endTimeHours, endTimeMinutes] = endTimeStr.split(':');
      const startTimeTotalMinutes =
        parseInt(startTimeHours) * this.minutesInHour + parseInt(startTimeMinutes);
      const endTimeTotalMinutes =
        parseInt(endTimeHours) * this.minutesInHour + parseInt(endTimeMinutes);
      const gridRowStart = startTimeTotalMinutes / this.intervalLengthMinutes;
      const gridRowEnd = endTimeTotalMinutes / this.intervalLengthMinutes;

      // if 0 add + 1 because grid starts at row 1, not 0
      return {
        'border-top-left-radius': `${isFirst ? '0px' : '10px'}`,
        'border-top-right-radius': `${isFirst ? '0px' : '10px'}`,
        'border-bottom-left-radius': `${isLast ? '0px' : '10px'}`,
        'border-bottom-right-radius': `${isLast ? '0px' : '10px'}`,
        'border-top': `${isFirst ? 'none' : '1px solid #ccc'}`,
        'border-bottom': `${isLast ? 'none' : '1px solid #ccc'}`,
        'grid-row-start': `${gridRowStart === 0 ? gridRowStart + 1 : gridRowStart}`,
        'grid-row-end': `${endTimeStr === this.midnightString ? gridRowEnd + 1 : gridRowEnd}`,
      };
    },
    calculateSlotStyle(i: number) {
      return {
        'grid-row-start': `${i - 1}`,
        'grid-row-end': `${i}`,
      };
    },
  }
});
</script>
<style scoped>
.tv-schedule {
  display: grid;
  background-color: #e7e7e7;
  width: 50%;
  grid-template-columns: auto repeat(3, 1fr);
  height: 7200px;
  gap: 1px;
  font-family: Arial, sans-serif;
  padding-right: 5px;
}

.show-image {
  border-radius: 10px;
}

.time-slot-span {
  display: flex;
  justify-content: flex-end;
}

.time {
  position: relative;
  top: calc(0% - 12.5px);
  display: flex;
  justify-content: center; align-items: center;
  margin-bottom: px;
  height: 25px; width: 80%;
  border-radius: 20px;
  background-color: rgb(147, 142, 142);
}

.new-day {
  background-color: rgb(233, 15, 97);
}

.time-table {
  display: grid;
  height: 7200px;
  background-color: #ffffff;
  grid-template-rows: repeat(1440, 5px);
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
  cursor: pointer;
  transition: background-color 0.3s;
}

.show-slot:hover {
  background-color: #e0e0e0;
}

.channel-column {
  display: grid;
  grid-template-rows: repeat(1440, 5px);
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