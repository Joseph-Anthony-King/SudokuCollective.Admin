<template>
  <ResetPasswordWidget :token="token" />
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import ResetPasswordWidget from "@/components/widgets/resetPassword/ResetPasswordWidget.vue"

const props = defineProps({
  token: {
    type: String,
    default: "",
  },
});
</script>
