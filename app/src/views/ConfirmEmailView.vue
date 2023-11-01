<template>
  <ConfirmEmailPage :token="token" />
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import ConfirmEmailPage from "@/components/pages/ConfirmEmailPage.vue";

const props = defineProps({
  token: {
    type: String,
    default: "",
  },
});
</script>
