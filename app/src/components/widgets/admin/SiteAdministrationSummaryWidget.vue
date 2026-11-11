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
          striped="even"
          :items-per-page="10"
          hide-default-footer>
          <template v-slot:[slotNames.applicationsCount]="{ item }">
            <div class="text-center">
              {{ item.applicationsCount }}
            </div>
          </template>
          <template v-slot:[slotNames.usersCount]="{ item }">
            <div class="text-center">
              {{ item.usersCount }}
            </div>
          </template>
          <template v-slot:[slotNames.gamesCount]="{ item }">
            <div class="text-center">
              {{ item.gamesCount }}
            </div>
          </template>
          <template v-slot:[slotNames.solutionsCount]="{ item }">
            <div class="text-center">
              {{ item.solutionsCount }}
            </div>
          </template>
          <template v-slot:[slotNames.difficultiesCount]="{ item }">
            <div class="text-center">
              {{ item.difficultiesCount }}
            </div>
          </template>
          <template v-slot:[slotNames.rolesCount]="{ item }">
            <div class="text-center">
              {{ item.rolesCount }}
            </div>
          </template>
          <template v-slot:[slotNames.emailConfirmationsCount]="{ item }">
            <div class="text-center">
              {{ item.emailConfirmationsCount }}
            </div>
          </template>
          <template v-slot:[slotNames.passwordResetsCount]="{ item }">
            <div class="text-center">
              {{ item.passwordResetsCount }}
            </div>
          </template>
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
  const slotNames = {
    applicationsCount: 'item.applicationsCount',
    usersCount: 'item.usersCount',
    gamesCount: 'item.gamesCount',
    solutionsCount: 'item.solutionsCount',
    difficultiesCount: 'item.difficultiesCount',
    rolesCount: 'item.rolesCount',
    emailConfirmationsCount: 'item.emailConfirmationsCount',
    passwordResetsCount: 'item.passwordResetsCount',
  };
  const headers: Array<{
    title: string;
    key: string;
    sortable?: boolean;
    align?: 'start' | 'center' | 'end';
  }> = [
    { title: 'Apps', key: 'applicationsCount', sortable: false, align: 'center' },
    { title: 'Users', key: 'usersCount', sortable: false, align: 'center' },
    { title: 'Games', key: 'gamesCount', sortable: false, align: 'center' },
    { title: 'Solutions', key: 'solutionsCount', sortable: false, align: 'center' },
    { title: 'Difficulties', key: 'difficultiesCount', sortable: false, align: 'center' },
    { title: 'Roles', key: 'rolesCount', sortable: false, align: 'center' },
    {
      title: 'Email Confirmations',
      key: 'emailConfirmationsCount',
      sortable: false,
      align: 'center',
    },
    {
      title: 'Password Resets',
      key: 'passwordResetsCount',
      sortable: false,
      align: 'center',
    },
  ];
</script>
