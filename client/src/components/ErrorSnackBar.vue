<template>
  <div class="text-center">
    <v-snackbar v-model="isSnackbarVisible" multi-line>
      {{ text }}
      <template v-slot:actions>
        <v-btn color="red" variant="text" @click="closeSnackbar"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'ErrorSnackBar',
  props: {
    snackbar: Boolean,
    text: String,
  },
  computed: {
    isSnackbarVisible: {
      get() {
        return this.snackbar;
      },
      set(value: boolean) {
        // Emit an event to notify the parent component to toggle the snackbar
        this.$emit('update:snackbar', value);
      },
    },
  },
  methods: {
    closeSnackbar() {
      this.isSnackbarVisible = false;
    },
  },
});
</script>