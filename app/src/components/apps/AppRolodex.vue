<template>
  <v-card>
    <v-card-title class="justify-center text-center">
      <v-col cols="12">
        <v-select
          class="headline"
          color="primary"
          label="Select"
          :items="['Your Apps', 'Your Registered Apps']"
          v-model="selectedApps"></v-select>
      </v-col>
    </v-card-title>
    <v-card-text>
      <v-container fluid>
        <div class="app-buttons-scroll">
          <span
            class="no-apps-message"
            v-if="apps.length === 0"
            >Time to Get Coding!</span
          >
          <AppButton
            v-for="(app, index) in apps"
            :app="app"
            :key="index"
            :index="index"
            v-on:app-selected="appSelected" />
        </div>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  /* eslint-disable no-unused-vars */
  /* eslint-disable @typescript-eslint/no-unused-vars*/
  import { type Ref, ref, watch } from 'vue';
  import { storeToRefs } from 'pinia';
  import AppButton from '@/components/buttons/AppButton.vue';
  import { useAppStore } from '@/stores/appStore';
  import { App } from '@/models/domain/app';
  import commonUtilities from '@/utilities/common';

  const { updateAppProcessingAsync } = commonUtilities();

  const appStore = useAppStore();
  const { getSelectedApp, getMyApps, getMyRegisteredApps } = storeToRefs(appStore);
  const { setSelectedApp } = appStore;

  const apps: Ref<App[]> = ref(getMyApps.value);
  const selectedApps: Ref<string> = ref('Your Apps');

  watch(
    () => selectedApps.value,
    (newValue, oldValue) => {
      setSelectedApp();
      if (newValue === 'Your Apps') {
        apps.value = getMyApps.value;
      } else {
        apps.value = getMyRegisteredApps.value;
      }
    },
    {
      immediate: true,
      deep: true,
    },
  );

  const appSelected = (id: number) => {
    updateAppProcessingAsync(() => {
      if (id !== getSelectedApp.value?.id) {
        setSelectedApp(id);
      } else {
        setSelectedApp();
      }
    });
  };

  watch(
    () => getMyApps.value,
    (newValue, oldValue) => (apps.value = newValue),
    {
      immediate: true,
      deep: true,
    },
  );

  defineExpose({
    apps,
    selectedApps,
  });
</script>

<style scoped lang="scss">
  .app-buttons-scroll {
    display: flex;
    overflow-x: auto;
  }
</style>
