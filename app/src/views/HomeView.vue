<template>
  <home-page />
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import HomePage from '@/components/pages/HomePage.vue';

  export default defineComponent({
    name: 'HomeView',
    components: {
      HomePage,
    },
  });
</script>
