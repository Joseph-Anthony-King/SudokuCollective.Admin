<template>
  <v-container fluid>
    <v-card elevation="6" class="mx-auto">
      <v-card-text>
        <v-container fluid>
          <v-card-title class="justify-center text-center">
            <span class="headline">Your Dashboard</span>
          </v-card-title>
        </v-container>
        <AppRolodex />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import AppRolodex from "@/components/apps/AppRolodex.vue"
import { useAppStore } from "@/store/appStore";
import { useUserStore } from "@/store/userStore";
import { User } from "@/models/domain/user";

const props = defineProps({
  action: {
    type: String,
    default: "",
  },
});

const userStore = useUserStore();
const appStore = useAppStore();

onBeforeMount(async() => {
  const user: User = userStore.getUser;
  if (props.action.toLowerCase() === "login") {
    user.isLoggingIn = true;
    userStore.updateUser(user);
  }
  await appStore.getMyAppsAsync();
});
</script>
