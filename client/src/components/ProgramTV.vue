<template>
  <div class="wrapper">
    <h1>Program je dostupný maximálne na 1 deň dozadu</h1>
    <div class="wrapper" v-if="isYesterdayLoaded">
      <TvSchedule :channels="channelsYesterday" />
    </div>
    <div class="loader" v-if="!isYesterdayLoaded">
      <TvScheduleLoader />
    </div>
    <div ref="todaysSchedule"></div>
    <TvSchedule :channels="channelsToday" />

    <div class="wrapper" v-for="(day, index) in channelsFutureDays" :key="index">
      <TvSchedule :channels="day" />
    </div>
    <div class="loader" v-if="isLoading">
      <TvScheduleLoader />
    </div>
    <h1 v-if="isAllFetched">Program je dostupný maximálne na 5 dní dopredu</h1>
  </div>
</template>
<script lang="ts">
import { getPrograms } from '../services/api';
import { ShowDetails, showDetails } from '../showDetails';
import TvSchedule from './TvSchedule.vue';
import TvScheduleLoader from './TvScheduleLoader.vue';
import { Program, ProgramResponse } from '../services/interfaces';
import { defineComponent } from "vue";

export default defineComponent({
  name: 'ProgramTV',
  props: {
    stationdIds: Array<number>,
  },
  components: {
    TvSchedule,
    TvScheduleLoader,
  },
  data() {
    return {
      maxFutureDays: 5 as number,
      channelsFutureDays: [] as Program[][],
      channelsYesterday: [] as Program[],
      channelsToday: [] as Program[],
      timeSlots: [] as string[],
      timeFrameHeigh: 5 as number,
      isAllFetched: false as boolean,
      dates: this.calculateDateData() as string[],
      showDetails: showDetails as ShowDetails[],
      height: 7200 as number,
      isLoading: false as boolean,
      isYesterdayLoaded: false as boolean,
      zeroTimeString: '00:00' as string,
      currentDay: 'Dnes' as string,
      dayThresholds: [
        {
          threshold: 7200,
          name: 'Včera',
        },
        {
          threshold: 7200 * 2,
          name: 'Dnes',
        },
        {
          threshold: 7200 * 3,
          name: 'Zajtra',
        },
        {
          threshold: 7200 * 4,
          name: '',
        },
        {
          threshold: 7200 * 5,
          name: '',
        },
        {
          threshold: 7200 * 6,
          name: '',
        },
        {
          threshold: 7200 * 7,
          name: '',
        },
      ] as { threshold: number; name: string }[],
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
    this.calculateDateThresholdNames();
  },
  beforeUnmount() {
    document.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('wheel', this.handleWheel);
  },
  created() {
    // Fetch todays programs
    this.fetchProgramsToday().then((response) => {
      this.fetchProgramCallback(response, 'today');
      this.$nextTick(() => this.scrollTodaysScheduleIntoView());
    });
  },
  methods: {
    emitError() {
      this.$emit('fetchError');
    },
    emitDayChange(currentDay: string) {
      this.$emit('dayChange', currentDay);
    },
    calculateDateData() {
      const dateData = [];
      const today = new Date();

      // Function to format a date as "YYYY-MM-DD"
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // Calculate and format yesterday's date
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      dateData.push(formatDate(yesterday));

      // Format today's date
      const formattedToday = formatDate(today);
      dateData.push(formattedToday);

      // Calculate and format the next five days
      for (let i = 1; i <= 5; i++) {
        const nextDay = new Date(today);
        nextDay.setDate(today.getDate() + i);
        dateData.push(formatDate(nextDay));
      }

      return dateData;
    },
    calculateDateThresholdNames() {
      // asign dates to this.dayThresholds, starting at day after tommorow
      // which should equalto this.dates[3]
      for (let i = 3; i < this.dayThresholds.length; i++) {
        this.dayThresholds[i].name = this.dates[i];
      }
    },
    getThresholdName(value: number) {
      // find first threshold which is bigger than value, if none found return last
      const threshold = this.dayThresholds.find((threshold) => threshold.threshold > value);
      return threshold ? threshold.name : this.dayThresholds[this.dayThresholds.length - 1].name;
    },
    calculateSlotStyle(i: number) {
      return {
        'grid-row-start': `${i - 1}`,
        'grid-row-end': `${i}`,
      };
    },
    scrollTodaysScheduleIntoView() {
      const element = this.$refs.todaysSchedule as HTMLElement;

      if (element) {
        element.scrollIntoView({ block: 'start' });
      }
    },
    compareTimeStrings(a: Program, b: Program) {
      const [hoursA, minutesA] = a.time.split(':').map(Number);
      const [hoursB, minutesB] = b.time.split(':').map(Number);

      if (hoursA === hoursB) {
        return minutesA - minutesB;
      }

      return hoursA - hoursB;
    },
    async fetchYesterdayPrograms() {
      return await getPrograms(this.dates[0], this.stationdIds);
    },
    async fetchProgramsToday() {
      return await getPrograms(this.dates[1], this.stationdIds);
    },
    async fetchFuturePrograms(i: number) {
      return await getPrograms(this.dates[2 + i], this.stationdIds);
    },
    handleProgramOverflowYesterday(source: Program[][], target: Program[][]) {
      const lastShowsOfTheDay = [];

      // based on the way we push these in fetchProgramCallback we
      // know which channel is on which index so we can just push them
      // and safely assume in further processing
      for (let i = 0; i < source.length; i++) {
        const lastShowIndex = source[i].length - 1;
        lastShowsOfTheDay.push(source[i][lastShowIndex]);
      }

      for (let j = 0; j < target.length; j++) {
        const show = Object.assign({}, lastShowsOfTheDay[j]);
        // if next days first show starts at midnight , continue
        if (target[j][0].time === this.zeroTimeString) {
          continue;
        }
        show.time = this.zeroTimeString;
        show.isFromYesterday = true;
        target[j]?.unshift(show);
      }
    },
    fetchProgramCallback(response: ProgramResponse | null, day: string) {
      if (response === null || !response?.status || response.hasError) {
        this.emitError();
        return;
      }

      const jojka = response['module:com_playground/tv/tv/getProgram#1'];
      const markiza = response['module:com_playground/tv/tv/getProgram#2'];
      const jednotka = response['module:com_playground/tv/tv/getProgram#3'];

      if (
        jojka === null ||
        markiza === null ||
        jednotka === null ||
        jojka.status === false ||
        markiza.status === false ||
        jednotka.status === false ||
        !jojka?.result.length ||
        !markiza?.result.length ||
        !jednotka?.result.length
      ) {
        this.emitError();
        return;
      }

      // BEWARE: The channels order matter, check handleProgramOverflowYesterday method
      const channels = [
        jojka.result.sort(this.compareTimeStrings),
        markiza.result.sort(this.compareTimeStrings),
        jednotka.result.sort(this.compareTimeStrings),
      ];

      switch (day) {
        case 'yesterday':
          this.channelsYesterday.push(...channels as unknown as Program[]);
          this.handleProgramOverflowYesterday(this.channelsYesterday as unknown as Program[][], this.channelsToday as unknown as Program[][]);
          break;
        case 'today':
          this.channelsToday.push(...channels as unknown as Program[]);
          break;
        default:
          this.channelsFutureDays.push(channels as unknown as Program[]);
          // source is either today or the previous future day that was fetched
          // target is always the last one pushed
          this.handleProgramOverflowYesterday(
            this.channelsFutureDays.length === 1
              ? this.channelsToday as unknown as Program[][]
              : this.channelsFutureDays[this.channelsFutureDays.length - 2] as unknown as Program[][],
            this.channelsFutureDays[this.channelsFutureDays.length - 1] as unknown as Program[][]
          );
          break;
      }
    },
    handleWheel(event: WheelEvent) {
      const scrollY = window.scrollY;
      if (scrollY <= 7200 && event.deltaY <= 0 && !this.isYesterdayLoaded) {
        this.isYesterdayLoaded = true;
        this.fetchYesterdayPrograms().then((response: ProgramResponse | null) =>
          this.fetchProgramCallback(response, 'yesterday')
        );
      }
    },
    handleScroll() {
      const totalOffset = this.channelsFutureDays.length * this.height + this.height;
      const containerHeightMin = 6200 + totalOffset;
      const containerHeightMax = containerHeightMin + 100;
      const scrollHeight = Math.round(window.scrollY);

      const currentDay = this.getThresholdName(scrollHeight);
      if (currentDay !== this.currentDay) {
        this.currentDay = currentDay;
        this.emitDayChange(currentDay);
      }
      if (
        scrollHeight > containerHeightMin &&
        scrollHeight < containerHeightMax &&
        !this.isAllFetched
      ) {
        this.isLoading = true;
        this.fetchFuturePrograms(this.channelsFutureDays.length).then((response: ProgramResponse | null) => {
          this.fetchProgramCallback(response, 'other');
          this.isLoading = false;
          if (this.channelsFutureDays.length >= this.maxFutureDays) {
            this.isAllFetched = true;
          }
        });
      }
    },
  },
});
</script>

<style scoped>
.loader {
  width: 50%;
  height: 7200px;
}

h1 {
  padding-block: 3%;
}
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  cursor: pointer;
  transition: background-color 0.3s;
}

.show-slot:hover {
  background-color: #e0e0e0;
}
</style>