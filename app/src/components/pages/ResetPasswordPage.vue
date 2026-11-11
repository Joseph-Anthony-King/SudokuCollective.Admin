<template>
  <ResetPasswordWidget :token="token" />
</template>

<script setup lang="ts">
  /* eslint-disable no-undef */
  /* eslint-disable no-unused-vars */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  import ResetPasswordWidget from '@/components/widgets/resetPassword/ResetPasswordWidget.vue';

  const props = withDefaults(
    defineProps<{
      token?: string;
    }>(),
    {
      token: '',
    },
  );
</script>
