<template>
  <ConfirmEmailWidget :token="token" />
</template>

<script setup lang="ts">
  /* eslint-disable no-undef */
  /* eslint-disable no-unused-vars */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  import ConfirmEmailWidget from '@/components/widgets/confirmEmail/ConfirmEmailWidget.vue';

  const props = defineProps({
    token: {
      type: String,
      default: '',
    },
  });
</script>
