<template>
  <div class="wrapper">
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
    <div v-if="isAllFetched">
      Maximum 5 days allowed
    </div>
  </div>
</template>
<script>
import { getPrograms } from '../services/api';
import { channelData } from '../channelData';
import TvSchedule from './TvSchedule.vue';
import TvScheduleLoader from './TvScheduleLoader.vue';

export default {
  name: 'ProgramTV',
  components: {
    TvSchedule,
    TvScheduleLoader,
  },
  data() {
    const dateData = [];
    const today = new Date();

    // Function to format a date as "YYYY-MM-DD"
    const formatDate = (date) => {
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

    return {
      maxFutureDays: 5,
      channelsFutureDays: [],
      channelsYesterday: [],
      channelsToday: [],
      timeSlots: [],
      timeFrameHeigh: 25,
      isAllFetched: false,
      dates: dateData,
      channelData: channelData,
      snackbar: false,
      height: 7200,
      isLoading: false,
      isYesterdayLoaded: false,
      zeroTimeString: "00:00"
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
    // Fetch todays programs
    this.fetchProgramsToday().then((response) => {
      this.fetchProgramCallback(response, "today");
      this.$nextTick(() => this.scrollTodaysScheduleIntoView());
    });
  },
  methods: {
    emitError() {
      // Emit an event with a custom name, e.g., 'childEvent'
      this.$emit('fetchError');
    },
    calculateSlotStyle(index) {
      return {
        'grid-row-start': `${index - 1}`,
        'grid-row-end': `${index}`,
      };
    },
    scrollTodaysScheduleIntoView() {
      const element = this.$refs.todaysSchedule;

      if (element) {
        element.scrollIntoView({ block: 'start' });
      }
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
    async fetchYesterdayPrograms() {
      return await getPrograms(this.dates[0], []);
    },
    async fetchProgramsToday() {
      return await getPrograms(this.dates[1], []);
    },
    async fetchFuturePrograms(i) {
      return await getPrograms(this.dates[2 + i], []);
    },
    handleProgramOverflowYesterday (source, target) {
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
    fetchProgramCallback(response, day) {
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

      // BEWARE: The channels order matter, check handleProgramOverflowYesterday method
      const channels = [
          jojka?.sort(this.compareTimeStrings),
          markiza?.sort(this.compareTimeStrings),
          jednotka?.sort(this.compareTimeStrings),
        ];

      switch (day) {
        case "yesterday":
          this.channelsYesterday.push(...channels);
          this.handleProgramOverflowYesterday(this.channelsYesterday, this.channelsToday);
          break;
        case "today":
          this.channelsToday.push(...channels);
          break;
        default:
          this.channelsFutureDays.push(channels);
          // source is either today or the previous future day that was fetched
          // target is always the last one pushed
          this.handleProgramOverflowYesterday(
            this.channelsFutureDays.length === 1 ? this.channelsToday : this.channelsFutureDays[this.channelsFutureDays.length - 2],
            this.channelsFutureDays[this.channelsFutureDays.length - 1]
          );
          break;
      }
    },
    handleWheel(event) {
      const scrollY = window.scrollY;
      if (scrollY <= 7200 && event.deltaY <= 0 && !this.isYesterdayLoaded) {
        this.isYesterdayLoaded = true;
        this.fetchYesterdayPrograms().then((response) =>
          this.fetchProgramCallback(response, "yesterday")
        );
      }
    },
    handleScroll() {
      const totalOffset = this.channelsFutureDays.length * this.height + this.height;
      const containerHeightMin = 6200 + totalOffset;
      const containerHeightMax = containerHeightMin + 100;
      const scrollHeight = Math.round(window.scrollY);
      if (
        scrollHeight > containerHeightMin &&
        scrollHeight < containerHeightMax &&
        !this.isAllFetched
      ) {
        this.isLoading = true;
        this.fetchFuturePrograms(this.channelsFutureDays.length).then((response) =>
          {
            this.fetchProgramCallback(response, "other");
            this.isLoading = false;
            if (this.channelsFutureDays.length >= this.maxFutureDays) {
              this.isAllFetched = true;
            }
          });
      }
    },
  },
};
</script>

<style scoped>
.loader {
  width: 50%;
  height: 7200px;
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
  /* padding: 5px; */
  cursor: pointer;
  transition: background-color 0.3s;
}

.show-slot:hover {
  background-color: #e0e0e0;
}
</style>
