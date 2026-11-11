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
      striped="odd"
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
      <template v-slot:item.dateCreated="{ item }">
        {{ formatDateCreated(item.dateCreated) }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn
          v-if="displayRegistered"
          icon
          small
          color="error"
          @click="removeUser(item.id!)"
          title="Remove user from app">
          <v-icon>mdi-account-remove</v-icon>
        </v-btn>
        <v-btn
          v-else
          icon
          small
          color="success"
          @click="addUser(item.id!)"
          title="Add user to app">
          <v-icon>mdi-account-plus</v-icon>
        </v-btn>
      </template>
      <template v-slot:expanded-row="{ item }">
        <tr>
          <td :colspan="headers.length">
            <v-card flat>
              <v-card-text>
                <v-row>
                  <v-col
                    cols="12"
                    md="6">
                    <strong>Full Name:</strong> {{ item.fullName || 'N/A' }}
                  </v-col>
                  <v-col
                    cols="12"
                    md="6">
                    <strong>Nickname:</strong> {{ item.nickName || 'N/A' }}
                  </v-col>
                  <v-col
                    cols="12"
                    md="6">
                    <strong>Email:</strong> {{ item.email || 'N/A' }}
                  </v-col>
                  <v-col
                    cols="12"
                    md="6">
                    <strong>Email Confirmed:</strong> {{ item.isEmailConfirmed ? 'Yes' : 'No' }}
                  </v-col>
                  <v-col
                    cols="12"
                    md="6">
                    <strong>Date Created:</strong>
                    {{ item.dateCreated ? formatDateCreated(item.dateCreated) : 'N/A' }}
                  </v-col>
                  <v-col
                    cols="12"
                    md="6">
                    <strong>Date Updated:</strong>
                    {{ item.dateUpdated ? formatDateCreated(item.dateUpdated) : 'N/A' }}
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
  import commonUtilities from '@/utilities/common';

  const props = withDefaults(
    defineProps<{
      displayRegistered?: boolean;
    }>(),
    {
      displayRegistered: true,
    },
  );

  const { formatDateCreated } = commonUtilities();

  // Get selected app from app store
  const appStore = useAppStore();
  const { getSelectedApp, getRegisteredAppUsers, getNonRegisteredAppUsers } = storeToRefs(appStore);

  // Get user info from user store
  const userStore = useUserStore();
  const { getUserIsSuperUser } = storeToRefs(userStore);

  // Computed property to get users from selected app
  const users = computed(() => {
    if (props.displayRegistered) {
      return getRegisteredAppUsers.value || [];
    } else {
      return getNonRegisteredAppUsers.value || [];
    }
  });

  const formTitle = computed(() => {
    const appName = getSelectedApp.value?.name;
    const userType = props.displayRegistered ? 'Registered Users' : 'Non-Registered Users';
    return appName ? `${userType} for ${appName}` : `Manage App Users`;
  });

  const headers = computed(() => {
    let baseHeaders: Array<{ title: string; key: string; sortable?: boolean }> = [];

    if (getUserIsSuperUser.value) {
      baseHeaders = [
        { title: 'Full Name', key: 'fullName', sortable: true },
        { title: 'Nickname', key: 'nickName', sortable: true },
        { title: 'Email', key: 'email', sortable: true },
        { title: 'Email Confirmed', key: 'isEmailConfirmed', sortable: false },
        { title: 'Active', key: 'isActive', sortable: false },
        { title: 'Admin', key: 'isAdmin', sortable: false },
        { title: 'Super User', key: 'isSuperUser', sortable: false },
        { title: 'Date Created', key: 'dateCreated', sortable: false },
      ];
    } else {
      baseHeaders = [
        { title: 'Full Name', key: 'fullName', sortable: true },
        { title: 'Nickname', key: 'nickName', sortable: true },
        { title: 'Active', key: 'isActive', sortable: false },
        { title: 'Admin', key: 'isAdmin', sortable: false },
        { title: 'Date Created', key: 'dateCreated', sortable: false },
      ];
    }

    baseHeaders.push({ title: 'Actions', key: 'actions', sortable: false });

    return baseHeaders;
  });

  const addUser = async (userId: number) => {
    await appStore.putAddUserAsync(userId);
  };

  const removeUser = async (userId: number) => {
    await appStore.putRemoveUserAsync(userId);
  };
</script>
