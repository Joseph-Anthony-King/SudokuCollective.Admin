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
          <span class="no-apps-message" v-if="apps.length === 0">Time to Get Coding!</span>
          <AppButton
            v-for="(app, index) in apps"
            :app="app"
            :key="index"
            :index="index"
            v-on:app-selected="appSelected"
          />
        </div>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars*/
import { Ref, ref, watch } from "vue";
import AppButton from "@/components/buttons/AppButton.vue";
import { useAppStore } from "@/store/appStore";
import { App } from "@/models/domain/app";

const apps: Ref<App[]> = ref(useAppStore().getMyApps);
const selectedApps: Ref<string> = ref("Your Apps");

watch(
  () => selectedApps.value,
  () => {
    appStore.updateSelectedApp(0);
    if (selectedApps.value === "Your Apps") {
      apps.value = appStore.getMyApps;
    } else {
      apps.value = appStore.getMyRegisteredApps;
    }
  }
)

const appStore = useAppStore();

const appSelected = (id: number) => {
  if (id !== appStore.getSelectedApp?.id) {
    appStore.updateSelectedApp(id);
  } else {
    appStore.updateSelectedApp(0);
  }
};

watch(
  () => useAppStore().getMyApps,
  () => apps.value = useAppStore().getMyApps
);
</script>

<style scoped lang="scss">
.app-buttons-scroll {
  display: flex;
  overflow-x: auto;
}
</style>
