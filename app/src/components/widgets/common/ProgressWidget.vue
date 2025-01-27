<template>
  <v-container>
    <v-row
      class="d-flex justify-center"
      cols="12">
      <div v-if="!isMobile">
        <v-progress-circular
          indeterminate
          color="primary"
          :size="progressSize"
          class="vertical-center">
          <template v-slot:default>
            <p
              class="loading-message text-grey-darken-4"
              v-html="progressMessage"></p>
          </template>
        </v-progress-circular>
        <div
          v-if="getCancelApiRequestDelegateIsNotNull && showCancelButton"
          class="justify-center text-center progress-button"
          style="margin-top: 10px">
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-btn
                color="blue darken-1"
                variant="text"
                @click="cancelApiRequest($event)"
                v-bind="props">
                Cancel
              </v-btn>
            </template>
            <span>Cancel the outstanding api request</span>
          </v-tooltip>
        </div>
      </div>
      <div
        v-if="isMobile"
        class="vertical-center-mobile">
        <v-progress-linear
          indeterminate
          color="primary">
        </v-progress-linear>
        <p
          class="loading-message text-grey-darken-4"
          v-html="progressMessage"></p>
        <div
          v-if="getCancelApiRequestDelegateIsNotNull && showCancelButton"
          class="justify-center text-center">
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-btn
                color="blue darken-1"
                variant="text"
                @click="cancelApiRequest($event)"
                v-bind="props">
                Cancel
              </v-btn>
            </template>
            <span>Cancel the outstanding api request</span>
          </v-tooltip>
        </div>
        <div
          v-if="getCancelApiRequestDelegateIsNotNull && !showCancelButton"
          class="justify-center text-center"
          style="height: 2.4em">
          <!-- blank placeholder for the cancel button -->
        </div>
      </div>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { type ComputedRef, computed, type Ref, ref, onMounted, onUnmounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useGlobalStore } from '@/stores/globalStore';
  import commonUtilities from '@/utilities/common';

  const { resetViewPort } = commonUtilities();

  //#region Destructure Stores
  const globalStore = useGlobalStore();
  const { getCancelApiRequestDelegateIsNotNull, getCancelApiRequestDelayInMilliseconds } =
    storeToRefs(globalStore);
  const { cancelApiRequest } = globalStore;
  //#endregion

  //#region Properties
  const progressMessage: Ref<string> = ref('working, please do not navigate away');
  const isSmallViewPort: Ref<boolean> = ref(true);
  const showCancelButton: Ref<boolean> = ref(false);

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
    resetViewPort(isSmallViewPort);
    resetProgressMessagePadding();
    window.addEventListener('resize', () => {
      resetViewPort(isSmallViewPort);
      resetProgressMessagePadding();
    });
    setTimeout(
      () => (showCancelButton.value = true),
      getCancelApiRequestDelayInMilliseconds.value
        ? getCancelApiRequestDelayInMilliseconds.value
        : 60000,
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
    top: 25%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
  }

  .vertical-center-mobile {
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

  .progress-button {
    position: absolute;
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);

    & {
      @media (min-width: 1921px) {
        padding-top: 575px;
      }

      @media (min-width: 961px) and (max-width: 1920px) {
        padding-top: 525px;
      }
    }
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
