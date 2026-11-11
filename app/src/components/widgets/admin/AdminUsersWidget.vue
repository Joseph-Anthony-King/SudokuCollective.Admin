<template>
  <v-card>
    <v-card-title class="justify-center text-center">
      <span class="headline">Site Users</span>
    </v-card-title>
    <v-data-table
      :items="siteUsers"
      :headers="headers"
      class="elevation-1"
      striped="even"
      :items-per-page="10"
      show-expand>
      <template v-slot:[isActiveSlot]="{ item }">
        <v-chip
          :color="item.isActive ? 'green' : 'red'"
          text-color="white"
          small>
          {{ item.isActive ? 'Active' : 'Inactive' }}
        </v-chip>
      </template>
      <template v-slot:[dateCreatedSlot]="{ item }">
        {{ formatDateCreated(item.dateCreated) }}
      </template>
      <template v-slot:[actionsSlot]="{ item }">
        <v-btn
          v-if="item.isActive"
          icon
          small
          color="error"
          title="Deactivate User"
          @click="deactivateUserAsync(item.id!)">
          <v-icon>mdi-account-remove</v-icon>
        </v-btn>
        <v-btn
          v-else
          icon
          small
          color="success"
          title="Activate User"
          @click="activateUserAsync(item.id!)">
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
  </v-card>
</template>

<script setup lang="ts">
  import { computed, ComputedRef } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useAdminStore } from '@/stores/adminStore';
  import { IUser } from '@/interfaces/domain/iUser';
  import commonUtilities from '@/utilities/common';

  const { formatDateCreated } = commonUtilities();

  const adminStore = useAdminStore();
  const { users } = storeToRefs(adminStore);

  const isActiveSlot = 'item.isActive';
  const dateCreatedSlot = 'item.dateCreated';
  const actionsSlot = 'item.actions';

  const siteUsers: ComputedRef<IUser[]> = computed(() => users.value);

  const headers = computed(() => {
    let baseHeaders: Array<{ title: string; key: string; sortable?: boolean }> = [];

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

    baseHeaders.push({ title: 'Actions', key: 'actions', sortable: false });

    return baseHeaders;
  });

  const activateUserAsync = async (userId: number) => {
    await adminStore.putActivateUserAsync(userId);
  };

  const deactivateUserAsync = async (userId: number) => {
    await adminStore.putDeactivateUserAsync(userId);
  };
</script>
