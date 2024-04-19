<template>
  <v-footer app>
    <v-card elevation="0" rounded="0" width="100%" class="text-center">
      <v-divider></v-divider>
      <v-card-text>
        © Copyright {{ getCopyrightYear }}:
        <a
          href="https://www.linkedin.com/in/joseph-king-23650256/"
          target="_blank"
          title="LinkedIn Profile: Joseph Anthony King"
          >Joseph-Anthony-King</a
        >
        <p class="text-right version">{{ getVersion }}</p>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
import { type ComputedRef, computed } from 'vue';

const getCopyrightYear: ComputedRef<number> = computed(() => new Date().getFullYear());
const getVersion: ComputedRef<string> = computed(() => `version ${process.env.VITE_APP_VERSION}`);
</script>

<style scoped>
.version {
  font-size: xx-small;
}
</style>
