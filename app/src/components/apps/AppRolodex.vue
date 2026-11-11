<template>
  <v-card>
    <v-card-title class="justify-center text-center">
      <v-col cols="12">
        <v-select
          class="headline"
          color="primary"
          label="Select"
          :items="items"
          v-model="selectedApps"></v-select>
      </v-col>
    </v-card-title>
    <v-card-text>
      <v-container fluid>
        <div class="app-buttons-scroll">
          <div
            v-if="
              (selectedApps === 'Your Apps' ? getMyApps.length : getMyRegisteredApps.length) === 0
            ">
            <TimeToCodeButton />
          </div>
          <AppButton
            v-for="(app, index) in selectedApps === 'Your Apps' ? getMyApps : getMyRegisteredApps"
            :app="app"
            :key="index"
            :index="index"
            :type="selectedApps"
            v-on:app-selected="appSelected" />
          <CreateAppButton
            v-if="selectedApps === 'Your Apps'"
            @create-app-clicked="onCreateAppClicked" />
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
  import CreateAppButton from '@/components/buttons/CreateAppButton.vue';
  import TimeToCodeButton from '@/components/buttons/TimeToCodeButton.vue';
  import { useAppStore } from '@/stores/appStore';
  import commonUtilities from '@/utilities/common';

  // Handler for create app button click
  const emit = defineEmits(['show-create-app']);
  const onCreateAppClicked = () => {
    emit('show-create-app');
  };

  const items: Ref<string[]> = ref(['Your Apps', 'Your Registered Apps']);

  const { updateAppProcessingAsync } = commonUtilities();

  const appStore = useAppStore();
  const { getSelectedApp, getMyApps, getMyRegisteredApps } = storeToRefs(appStore);
  const { setSelectedAppAsync } = appStore;

  const selectedApps: Ref<string> = ref('Your Apps');
  // No local apps ref needed; use Pinia getters directly for reactivity

  const appSelected = async (id: number) => {
    await updateAppProcessingAsync(async () => {
      if (id !== getSelectedApp.value?.id) {
        await setSelectedAppAsync(id);
      } else {
        await setSelectedAppAsync();
      }
    });
  };

  // No local apps ref needed; use Pinia getters directly for reactivity

  defineExpose({
    selectedApps,
  });
</script>

<style scoped lang="scss">
  .app-buttons-scroll {
    display: flex;
    overflow-x: auto;
  }
</style>
