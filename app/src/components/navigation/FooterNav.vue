<template>
  <v-footer app inset class="app-responsive-viewport">
    <v-card elevation="0" rounded="0" width="100%" class="text-center">
      <v-divider></v-divider>

      <v-card-text>
        © Copyright {{ getCopyrightYear }}:
        <a
          href="https://www.linkedin.com/in/joseph-king-23650256/"
          target="_blank"
          title="LinkedIn Profile: Joseph Anthony King"
        >Joseph-Anthony-King</a>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script setup lang="ts">
import { computed } from "@vue/reactivity";

const getCopyrightYear = computed(() => new Date().getFullYear());
</script>
