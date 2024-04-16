<template>
  <v-container fluid>
    <v-card elevation="6" class="mx-auto">
      <v-card-text>
        <v-container fluid>
          <UserProfileForm />
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useUserStore } from "@/stores/userStore";
import UserProfileForm from "@/components/forms/UserProfileForm.vue";
import { User } from "@/models/domain/user";

const props = defineProps({
  action: {
    type: String,
    default: "",
  },
});

const userStore = useUserStore();

onBeforeMount(() => {
  const user: User = userStore.getUser;
  if (props.action.toLowerCase() === "login") {
    user.isLoggingIn = true;
    userStore.updateUser(user);
  }
});
</script>
@/stores/userStore