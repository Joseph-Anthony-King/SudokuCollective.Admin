<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container>
    <v-card-title class="justify-center text-center">
      <span class="headline">{{ formTitle }}</span>
    </v-card-title>
    <v-data-table 
      :items="users" 
      :headers="headers" 
      class="elevation-1"
      :items-per-page="10"
      show-expand>
      <template v-slot:item.isActive="{ item }">
        <v-chip
          :color="item.isActive ? 'green' : 'red'"
          text-color="white"
          small>
          {{ item.isActive ? 'Active' : 'Inactive' }}
        </v-chip>
      </template>
      <template v-slot:item.isAdmin="{ item }">
        <v-icon :color="item.isAdmin ? 'green' : 'grey'">
          {{ item.isAdmin ? 'mdi-check' : 'mdi-close' }}
        </v-icon>
      </template>
      <template v-slot:item.isSuperUser="{ item }">
        <v-icon :color="item.isSuperUser ? 'green' : 'grey'">
          {{ item.isSuperUser ? 'mdi-check' : 'mdi-close' }}
        </v-icon>
      </template>
      <template v-slot:expanded-row="{ item }">
        <tr>
          <td :colspan="headers.length">
            <v-card flat>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <strong>Username:</strong> {{ item.userName || 'N/A' }}
                  </v-col>
                  <v-col cols="12" md="6">
                    <strong>First Name:</strong> {{ item.firstName || 'N/A' }}
                  </v-col>
                  <v-col cols="12" md="6">
                    <strong>Last Name:</strong> {{ item.lastName || 'N/A' }}
                  </v-col>
                  <v-col cols="12" md="6">
                    <strong>Nickname:</strong> {{ item.nickName || 'N/A' }}
                  </v-col>
                  <v-col cols="12" md="6">
                    <strong>Email Confirmed:</strong> {{ item.isEmailConfirmed ? 'Yes' : 'No' }}
                  </v-col>
                  <v-col cols="12" md="6">
                    <strong>Date Created:</strong> {{ item.dateCreated ? new Date(item.dateCreated).toLocaleDateString() : 'N/A' }}
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </td>
        </tr>
      </template>
    </v-data-table>

  </v-container>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useAppStore } from '@/stores/appStore';
  import { useUserStore } from '@/stores/userStore';

  // Get selected app from app store
  const appStore = useAppStore();
  const { getSelectedApp } = storeToRefs(appStore);

  // Get user info from user store
  const userStore = useUserStore();
  const { getUserIsSuperUser } = storeToRefs(userStore);

  // Computed property to get users from selected app
  const users = computed(() => {
    return getSelectedApp.value?.users || [];
  });

  const formTitle = computed(() => {
    const appName = getSelectedApp.value?.name;
    return appName ? `Manage Users for ${appName}` : 'Manage App Users';
  });

  const headers = computed(() => {
    const baseHeaders = [
      { title: 'Full Name', key: 'fullName' },
      { title: 'Email', key: 'email' },
      { title: 'Active', key: 'isActive' },
      { title: 'Admin', key: 'isAdmin' },
    ];

    if (getUserIsSuperUser.value) {
      baseHeaders.push({ title: 'Super User', key: 'isSuperUser' });
    }

    return baseHeaders;
  });
</script>