<template>
  <div class="text-center">
    <v-snackbar
      v-model="isSnackbarVisible"
      multi-line
    >
      {{ text }}

      <template v-slot:actions>
        <v-btn
          color="red"
          variant="text"
          @click="closeSnackbar"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
  export default {
    props: {
      snackbar: Boolean,
      text: String
    },
    computed: {
      isSnackbarVisible: {
        get() {
          return this.snackbar;
        },
        set(value) {
          // Emit an event to notify the parent component to toggle the snackbar
          this.$emit("update:snackbar", value);
        },
      },
    },
    methods: {
      closeSnackbar() {
        this.isSnackbarVisible = false;
      },
    },
  }
</script>