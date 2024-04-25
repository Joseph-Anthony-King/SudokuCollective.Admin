<template>
  <v-container>
    <v-row
      class="d-flex justify-center"
      cols="12">
      <v-progress-circular
        v-if="!isMobile"
        indeterminate
        color="primary"
        :size="progressSize"
        class="vertical-center">
        <template v-slot:default>
          <p class="loading-message">{{ progressMessage }}</p>
        </template>
      </v-progress-circular>
      <div
        v-if="isMobile"
        class="vertical-center">
        <v-progress-linear
          indeterminate
          color="primary">
        </v-progress-linear>
        <p class="loading-message">{{ progressMessage }}</p>
      </div>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { type ComputedRef, computed, type Ref, ref, onMounted, onUnmounted } from 'vue';

  //#region Properties
  const progressMessage: Ref<string> = ref('working, please do not navigate away');
  let windowWidth: Ref<number> = ref(window.innerWidth);
  const progressSize: ComputedRef<number> = computed(() => {
    if (windowWidth.value > 1920) {
      return 600;
    } else if (windowWidth.value >= 960) {
      return 500;
    } else if (windowWidth.value >= 600) {
      return 400;
    } else {
      return 300;
    }
  });
  const isMobile: ComputedRef<boolean> = computed(() => {
    if (windowWidth.value < 960) {
      return true;
    } else {
      return false;
    }
  });
  //#endregion

  //#region Action Handlers
  const resetProgressMessagePadding = (): void => {
    windowWidth.value = window.innerWidth;
  };
  //#endregion

  //#region Lifecycle Hooks
  onMounted(() => {
    resetProgressMessagePadding();
    window.addEventListener(
      'resize',
      () => {
        resetProgressMessagePadding();
      },
      { once: true },
    );
  });
  onUnmounted(() => {
    window.removeEventListener('resize', () => {
      resetProgressMessagePadding();
    });
  });
  //#endregion
</script>

<style lang="scss" scoped>
  .vertical-center {
    margin: 0;
    position: absolute;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .loading-message {
    display: inline;
  }

  .loading-message:after {
    white-space: pre;
    overflow: hidden;
    display: inline-block;
    vertical-align: bottom;
    -webkit-animation: ellipsis steps(4, end) 900ms infinite;
    animation: ellipsis steps(4, end) 900ms infinite;
    /* ascii code for the ellipsis character */
    content: '\2026';
    width: 0px;
    margin-right: 1em;
  }

  @keyframes ellipsis {
    to {
      width: 1em;
      margin-right: 0;
    }
  }

  @-webkit-keyframes ellipsis {
    to {
      width: 1em;
      margin-right: 0;
    }
  }
</style>
