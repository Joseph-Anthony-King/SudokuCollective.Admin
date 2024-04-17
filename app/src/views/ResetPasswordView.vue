<template>
  <ResetPasswordPage :token="token" />
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import ResetPasswordPage from '@/components/pages/ResetPasswordPage.vue';

const props = defineProps({
  token: {
    type: String,
    default: '',
  },
});
</script>
