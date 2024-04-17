<template>
  <v-container fluid>
    <v-card elevation="6" class="mx-auto">
      <v-card-text>
        <v-container fluid>
          <v-card-title class="justify-center text-center">
            <span class="headline">Dashboard</span>
          </v-card-title>
        </v-container>
        <AppRolodex />
        <SelectedAppForm v-if="selectedApp !== null" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
import { type Ref, ref, onBeforeMount, watch } from 'vue';
import AppRolodex from '@/components/apps/AppRolodex.vue';
import SelectedAppForm from '@/components/forms/SelectedAppForm.vue';
import { useAppStore } from '@/stores/appStore';
import { useUserStore } from '@/stores/userStore';
import { User } from '@/models/domain/user';
import { App } from '@/models/domain/app';

const props = defineProps({
  action: {
    type: String,
    default: '',
  },
});

//#region Instantiate the Stores
const userStore = useUserStore();
const appStore = useAppStore();
//#endregion

//#region Properties
const selectedApp: Ref<App | null | undefined> = ref(appStore.getSelectedApp);

watch(
  () => appStore.getSelectedApp,
  () => (selectedApp.value = appStore.getSelectedApp),
);
//#endregion

//#region Lifecycle Hooks
onBeforeMount(async () => {
  const user: User = userStore.getUser;
  if (props.action.toLowerCase() === 'login') {
    user.isLoggingIn = true;
    userStore.updateUser(user);
  }
});
//#endregion
</script>
