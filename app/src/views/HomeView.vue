<template>
  <HomePage :action="action" />
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import HomePage from "@/components/pages/HomePage.vue";

const props = defineProps({
  action: {
    type: String,
    default: "",
  },
});
</script>
