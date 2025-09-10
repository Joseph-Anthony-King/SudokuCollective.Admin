<template>
  <v-container>
    <v-row
      class="d-flex justify-center"
      cols="12">
      <div v-if="!isMobile" class="desktop-progress-container">
        <v-progress-circular
          indeterminate
          color="primary"
          :size="progressSize"
          class="vertical-center">
        </v-progress-circular>
        <p
          class="loading-message text-grey-darken-4"
          v-html="progressMessage"></p>
        <div
          v-if="getCancelApiRequestDelegateIsNotNull && showCancelButton"
          class="justify-center text-center progress-button">
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
          class="justify-center text-center progress-button"
          style="visibility: hidden;">
          <!-- hidden placeholder for the cancel button -->
          <v-btn
            color="blue darken-1"
            variant="text">
            Cancel
          </v-btn>
        </div>
      </div>
      <div
        v-if="isMobile"
        class="mobile-progress-container">
        <v-progress-linear
          indeterminate
          color="primary"
          class="vertical-center-mobile">
        </v-progress-linear>
        <p
          class="loading-message text-grey-darken-4"
          v-html="progressMessage"></p>
        <div
          v-if="getCancelApiRequestDelegateIsNotNull && showCancelButton"
          class="justify-center text-center mobile-cancel-button">
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
          class="justify-center text-center mobile-cancel-button"
          style="visibility: hidden;">
          <!-- hidden placeholder for the cancel button -->
          <v-btn
            color="blue darken-1"
            variant="text">
            Cancel
          </v-btn>
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
  .desktop-progress-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
  }

  .mobile-progress-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    padding: 20px;
  }

  .vertical-center {
    margin-bottom: 20px;
  }

  .vertical-center-mobile {
    margin-bottom: 20px;
    width: 100%;
  }

  .progress-button {
    margin-bottom: 20px;
  }

  .mobile-cancel-button {
    margin-bottom: 20px;
  }

  .loading-message {
    display: inline-block;
    text-align: center;
    font-size: 1.1rem;
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    
    // Responsive font sizing and width
    @media (max-width: 600px) {
      font-size: 0.9rem;
      max-width: 280px;
    }
    
    @media (max-width: 480px) {
      font-size: 0.85rem;
      max-width: 250px;
    }
    
    @media (max-width: 360px) {
      font-size: 0.8rem;
      max-width: 220px;
    }
    
    @media (min-width: 961px) {
      font-size: 1.2rem;
      max-width: 400px;
    }
    
    @media (min-width: 1921px) {
      font-size: 1.3rem;
      max-width: 500px;
    }
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
