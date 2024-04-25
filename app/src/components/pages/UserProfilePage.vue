<template>
  <v-container fluid>
    <v-card
      elevation="6"
      class="mx-auto">
      <v-card-text>
        <v-container fluid>
          <UserProfileForm />
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
  /* eslint-disable no-undef */
  import { onBeforeMount } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '@/stores/userStore';
  import UserProfileForm from '@/components/forms/UserProfileForm.vue';
  import { User } from '@/models/domain/user';

  const props = defineProps({
    action: {
      type: String,
      default: '',
    },
  });

  const userStore = useUserStore();
  const { getUser } = storeToRefs(userStore);
  const { updateUser } = userStore;

  onBeforeMount(() => {
    const user: User = getUser.value;
    if (props.action.toLowerCase() === 'login') {
      user.isLoggingIn = true;
      updateUser(user);
    }
  });
</script>
