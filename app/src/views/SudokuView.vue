<template>
  <SudokuPage :action="action" />
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import SudokuPage from "@/components/pages/SudokuPage.vue";

const props = defineProps({
  action: {
    type: String,
    default: "",
  },
});
</script>
