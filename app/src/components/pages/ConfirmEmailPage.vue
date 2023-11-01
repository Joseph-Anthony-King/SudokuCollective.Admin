<template>
  <ConfirmEmailWidget :token="token" />
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import ConfirmEmailWidget from "@/components/widgets/common/ConfirmEmailWidget.vue"

const props = defineProps({
  token: {
    type: String,
    default: "",
  },
});
</script>
