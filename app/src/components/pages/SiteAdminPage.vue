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
          <AvailableActions>
            <v-row dense>
              <v-col
                cols="12"
                sm="6"
                md="6">
                <v-tooltip
                  open-delay="2000"
                  location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      color="primary"
                      @click="confirmAddSolutionsHandler"
                      v-bind="props"
                      >Add Solutions</v-btn
                    >
                  </template>
                  <span>Add 100 Solutions to the System</span>
                </v-tooltip>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="6">
                <v-tooltip
                  open-delay="2000"
                  location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      color="primary"
                      text
                      @click="confirmFlushCacheHandler"
                      v-bind="props"
                      >Flush Cache</v-btn
                    >
                  </template>
                  <span>Flush the System Cache</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </AvailableActions>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
  /* eslint-disable no-undef */
  import { onBeforeMount, onMounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useAdminStore } from '@/stores/adminStore';
  import { useDialogStore } from '@/stores/dialogStore';
  import { useUserStore } from '@/stores/userStore';
  import AdminSummaryWidget from '@/components/widgets/admin/AdminSummaryWidget.vue';
  import AdminUsersWidget from '@/components/widgets/admin/AdminUsersWidget.vue';
  import AdminAppsWidget from '@/components/widgets/admin/AdminAppsWidget.vue';
  import AdminDropdownWidget from '@/components/widgets/admin/AdminDropdownWidget.vue';
  import AvailableActions from '@/components/buttons/AvailableActions.vue';
  import { DialogType } from '@/enums/dialogType';
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
  const adminStore = useAdminStore();
  const { getUser, getUserIsSuperUser } = storeToRefs(userStore);
  const { updateUser } = userStore;

  const dialogStore = useDialogStore();
  const { updateDialog } = dialogStore;

  const confirmAddSolutionsHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    updateDialog(
      'Confirm Add Solutions',
      'Are you sure you want to add 100 solutions to the system?',
      DialogType.CONFIRM,
      async () => {
        await addSolutionsHandler();
      },
    );
  };

  const confirmFlushCacheHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    updateDialog(
      'Confirm Flush Cache',
      'Are you sure you want to flush the system cache?',
      DialogType.CONFIRM,
      async () => {
        await flushCacheHandler();
      },
    );
  };

  const addSolutionsHandler = async () => {
    await adminStore.postAddSolutionsAsync();
  };

  const flushCacheHandler = async () => {
    await adminStore.postFlushCacheAsync();
  };

  onBeforeMount(() => {
    const user: User = getUser.value;
    if (props.action.toLowerCase() === 'login') {
      user.isLoggingIn = true;
      updateUser(user);
    }
  });

  onMounted(() => {
    if (getUserIsSuperUser.value) {
      // Set interval to periodically fetch admin stats every 30 seconds
      setInterval(async () => {
        await adminStore.getStatsAsync();
      }, 30000);
    }
  });
</script>
