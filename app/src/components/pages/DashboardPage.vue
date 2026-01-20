<template>
  <v-container fluid>
    <v-card
      elevation="6"
      class="mx-auto">
      <v-card-text>
        <v-container fluid>
          <v-card-title class="justify-center text-center">
            <span class="headline">Dashboard</span>
          </v-card-title>
        </v-container>
        <AppRolodex />
        <div id="app-details" v-if="selectedApp !== null">
          <v-container class="d-flex justify-center pa-0">
            <v-tabs v-model="activeTab" color="primary" style="width: fit-content;">
              <v-tab value="app-details">
                <v-icon start>mdi-application-settings</v-icon>
                App Details
              </v-tab>
              <v-tab value="app-users">
                <v-icon start>mdi-account-group</v-icon>
                App Users
              </v-tab>
            </v-tabs>
          </v-container>
          
          <v-window v-model="activeTab">
            <v-window-item value="app-details">
              <SelectedAppForm />
            </v-window-item>
            <v-window-item value="app-users">
              <SelectedAppUsersForm />
            </v-window-item>
          </v-window>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
  /* eslint-disable no-undef */
  /* eslint-disable no-unused-vars */
  import { type Ref, ref, onBeforeMount, watch } from 'vue';
  import { storeToRefs } from 'pinia';
  import AppRolodex from '@/components/apps/AppRolodex.vue';
  import SelectedAppForm from '@/components/forms/SelectedAppForm.vue';
  import SelectedAppUsersForm from '@/components/forms/SelectedAppUsersForm.vue';
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

  //#region Destructure Stores
  //#region UserStore
  const userStore = useUserStore();
  const { getUser } = storeToRefs(userStore);
  const { updateUser } = userStore;
  //#endregion
  //#region AppStore
  const appStore = useAppStore();
  const { getSelectedApp } = storeToRefs(appStore);
  //#endregion
  //#endregion

  //#region Properties
  const selectedApp: Ref<App | null | undefined> = ref(getSelectedApp.value);
  const activeTab: Ref<string> = ref('app-details');

  watch(
    () => getSelectedApp.value,
    (newValue, oldValue) => (selectedApp.value = newValue),
    {
      immediate: true,
      deep: true,
    },
  );
  //#endregion

  //#region Lifecycle Hooks
  onBeforeMount(async () => {
    const user: User = getUser.value;
    if (props.action.toLowerCase() === 'login') {
      user.isLoggingIn = true;
      updateUser(user);
    }
  });
  //#endregion
</script>
