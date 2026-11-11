<template>
  <v-container>
    <v-card>
      <v-card-title class="justify-center text-center">
        <span class="headline">Site Administration Summary </span>
      </v-card-title>
      <v-card-item>
        <v-data-table
          :items="summaries"
          :headers="headers"
          class="elevation-1"
          :items-per-page="10"
          hide-default-footer>
        </v-data-table>
      </v-card-item>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useAdminStore } from '@/stores/adminStore';

  const adminStore = useAdminStore();
  const { getAdminSummary } = storeToRefs(adminStore);
  const summaries = computed(() => [getAdminSummary.value]);
  const headers: Array<{ title: string; key: string; sortable?: boolean }> = [
    { title: 'Apps', key: 'applicationsCount', sortable: false },
    { title: 'Users', key: 'usersCount', sortable: false },
    { title: 'Games', key: 'gamesCount', sortable: false },
    { title: 'Solutions', key: 'solutionsCount', sortable: false },
    { title: 'Difficulties', key: 'difficultiesCount', sortable: false },
    { title: 'Roles', key: 'rolesCount', sortable: false },
    { title: 'Email Confirmations', key: 'emailConfirmationsCount', sortable: false },
    { title: 'Password Resets', key: 'passwordResetsCount', sortable: false },
  ];
</script>
