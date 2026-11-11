<template>
  <v-container fluid>
    <v-card
      elevation="6"
      class="mx-auto">
      <v-card-text>
        <v-container fluid>
          <v-card-title class="justify-center text-center">
            <span class="headline">Site Administration</span>
          </v-card-title>
          <admin-summary-widget />
          <admin-users-widget />
          <admin-apps-widget />
          <admin-dropdown-widget />
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
  import AdminSummaryWidget from '@/components/widgets/admin/AdminSummaryWidget.vue';
  import AdminUsersWidget from '@/components/widgets/admin/AdminUsersWidget.vue';
  import AdminAppsWidget from '@/components/widgets/admin/AdminAppsWidget.vue';
  import AdminDropdownWidget from '@/components/widgets/admin/AdminDropdownWidget.vue';
  import { User } from '@/models/domain/user';

  const props = withDefaults(
    defineProps<{
      action?: string;
    }>(),
    {
      action: '',
    },
  );

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
