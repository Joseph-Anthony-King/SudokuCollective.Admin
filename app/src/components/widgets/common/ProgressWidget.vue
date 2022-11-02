<template>
  <div class="d-flex pa-12 justify-center">
    <v-progress-circular
      indeterminate
      color="primary"
      :size="progressSize"
      :width="progressWidth"
      class="progress-circular"
    ></v-progress-circular>
  </div>
  <div class="d-flex pa-12 justify-center">
    <h1>{{ processingMessage }}</h1>
  </div>
</template>

<script lang="ts">
  import { computed, ComputedRef, defineComponent, Ref, ref, watch } from 'vue';
  import store from '@/store';

  export default defineComponent({
    name: 'ProgressWidget',
    setup() {
      let windowWidth: Ref<number> = ref(window.innerWidth);
      let processingMessage: Ref<string> = ref(store.getters['getProcessingMessage']);
      const progressSize: ComputedRef<number> = computed(() => {
        if (windowWidth.value > 1920) {
          return 150;
        } else if (windowWidth.value >= 960) {
          return 100;
        } else if (windowWidth.value >= 600) {
          return 75;
        } else {
          return 50;
        }
      });
      const progressWidth: ComputedRef<number> = computed(() => {
        if (windowWidth.value > 1920) {
          return 15;
        } else if (windowWidth.value >= 960) {
          return 10;
        } else if (windowWidth.value >= 600) {
          return 7;
        } else {
          return 5;
        }
      });
      watch(
        () => window.innerWidth,
        function () {
          windowWidth.value = window.innerWidth;
        }
      );
      watch(
        () => store.getters['getProcessingMessage'],
        function () {
          processingMessage.value = store.getters['getProcessingMessage'];
        }
      );
      return {
        progressSize,
        progressWidth,
        processingMessage,
      };
    },
  });
</script>
