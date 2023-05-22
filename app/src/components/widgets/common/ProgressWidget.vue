<template>
  <v-container>
    <v-row class='d-flex pa-12 justify-center' cols="12">
      <v-progress-circular
        indeterminate
        color='primary'
        :size='progressSize'
        :width='progressWidth'
        class='progress-circular'
      ></v-progress-circular>
    </v-row>
    <v-row :cols='progressPadding(true)' />
    <v-row class='d-flex pa-12 justify-center' cols="12">
      <v-col class='d-flex pa-3 ma-3' :cols='progressPadding(false)'>
        <h1 class='progress-message'>{{ progressMessage }}</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang='ts'>
import {
  computed,
  ComputedRef,
  defineComponent,
  onMounted,
  onUnmounted,
  Ref,
  ref,
  toRaw,
  watch,
} from 'vue';
import { useAppStore } from '@/store/appStore';

export default defineComponent({
  name: 'ProgressWidget',
  setup() {
    const appStore = useAppStore();
    let windowWidth: Ref<number> = ref(window.innerWidth);
    let progressMessage: Ref<string> = ref(
      appStore.getProcessingMessage
    );
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
    const progressPadding = (outerColumn: boolean): number => {
      let result: number;
      if (outerColumn) {
        if (
          progressMessage.value === 'processing, please do not navigate away'
        ) {
          if (windowWidth.value >= 1904) {
            result = 4;
          } else if (windowWidth.value < 1904 && windowWidth.value >= 1264) {
            result = 3;
          } else if (windowWidth.value < 1264 && windowWidth.value >= 960) {
            result = 2;
          } else if (windowWidth.value < 960 && windowWidth.value >= 810) {
            result = 1;
          } else {
            result = 2;
          }
        } else {
          if (windowWidth.value >= 1904) {
            result = 5;
          } else if (windowWidth.value < 1904 && windowWidth.value >= 1264) {
            result = 4;
          } else if (windowWidth.value < 1264 && windowWidth.value >= 960) {
            result = 4;
          } else if (windowWidth.value < 960 && windowWidth.value >= 810) {
            result = 3;
          } else {
            result = 3;
          }
        }
      } else {
        if (
          progressMessage.value === 'processing, please do not navigate away'
        ) {
          if (windowWidth.value >= 1264) {
            return 6;
          } else if (windowWidth.value < 1264 && windowWidth.value >= 960) {
            result = 8;
          } else if (windowWidth.value < 960 && windowWidth.value >= 810) {
            result = 10;
          } else {
            result = 7;
          }
        } else {
          if (windowWidth.value >= 1264) {
            return 4;
          } else if (windowWidth.value < 1264 && windowWidth.value >= 960) {
            result = 5;
          } else if (windowWidth.value < 960 && windowWidth.value >= 810) {
            result = 6;
          } else {
            result = 6;
          }
        }
      }
      return result;
    };
    const resetProgressMessagePadding = (): void => {
      windowWidth.value = window.innerWidth;
    };
    watch(
      () => appStore.getProcessingMessage,
      () => {
        progressMessage.value = toRaw(appStore.getProcessingMessage);
      }
    );
    onMounted(() => {
      resetProgressMessagePadding();
      window.addEventListener('resize', () => {
        resetProgressMessagePadding();
      });
    });
    onUnmounted(() => {
      window.removeEventListener('resize', () => {
        resetProgressMessagePadding();
      });
    });
    return {
      progressSize,
      progressWidth,
      progressMessage,
      progressPadding,
    };
  },
});
</script>

<style lang='scss' scoped>
@media only screen and (max-width: 809px) {
  .progress-message {
    font-size: 15px;
    min-width: 100px;
  }
}

@media only screen and (min-width: 810px) and (max-width: 1264) {
  .progress-message {
    font-size: 25px;
    min-width: 100px;
  }
}

@media only screen and (min-width: 1264) {
  .progress-message {
    font-size: 30px;
    min-width: 100px;
  }
}
.progress-message:after {
  overflow: hidden;
  display: inline-block;
  vertical-align: bottom;
  -webkit-animation: ellipsis steps(4, end) 900ms infinite;
  animation: ellipsis steps(4, end) 900ms infinite;
  content: '\2026';
  /* ascii code for the ellipsis character */
  width: 0px;
}

@keyframes ellipsis {
  to {
    width: 40px;
  }
}

@-webkit-keyframes ellipsis {
  to {
    width: 40px;
  }
}
</style>
