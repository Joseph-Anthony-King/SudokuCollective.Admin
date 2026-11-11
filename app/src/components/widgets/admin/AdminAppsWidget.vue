<template>
  <v-card>
    <v-card-title class="justify-center text-center">
      <span class="headline">Site Apps</span>
    </v-card-title>
    <v-data-table
      :items="siteApps"
      :headers="headers"
      class="elevation-1"
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
      <template v-slot:[environmentSlot]="{ item }">
        <span>{{ getEnvironmentUrl(item) || 'N/A' }}</span>
        <v-btn
          :href="getEnvironmentUrl(item) ?? undefined"
          target="_blank"
          rel="noopener noreferrer"
          :disabled="!getEnvironmentUrl(item)"
          icon="mdi-open-in-new"
          size="small"
          variant="text"
          :aria-label="`Open ${item.name ?? 'app'} URL in a new tab`"
          title="Open URL in a new tab" />
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
          title="Deactivate App"
          @click="deactivateAppAsync(item.id!)">
          <v-icon>mdi-close-box</v-icon>
        </v-btn>
        <v-btn
          v-else
          icon
          small
          color="success"
          title="Activate App"
          @click="activateAppAsync(item.id!)">
          <v-icon>mdi-plus-box</v-icon>
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
                    <strong>Name:</strong> {{ item.name || 'N/A' }}
                  </v-col>
                  <v-col
                    cols="12"
                    md="6">
                    <strong>Owner:</strong> {{ item.ownerId || 'N/A' }}
                  </v-col>
                  <v-col
                    cols="12"
                    md="6">
                    <strong>Url:</strong>
                    {{
                      item.environment === 1
                        ? `${item.localUrl}`
                        : item.environment === 2
                          ? `${item.testUrl}`
                          : item.environment === 3
                            ? `${item.stagingUrl}`
                            : `${item.prodUrl}`
                    }}
                  </v-col>
                  <v-col
                    cols="12"
                    md="6">
                    <strong>Release Environment:</strong>
                    {{
                      item.environment === 1
                        ? 'Development'
                        : item.environment === 2
                          ? 'Testing'
                          : item.environment === 3
                            ? 'Staging'
                            : 'Production'
                    }}
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
  import type { IApp } from '@/interfaces/domain/iApp';
  import { ReleaseEnvironment } from '@/enums/releaseEnvironment';
  import commonUtilities from '@/utilities/common';

  const { formatDateCreated } = commonUtilities();

  const adminStore = useAdminStore();
  const { apps } = storeToRefs(adminStore);

  const isActiveSlot = 'item.isActive';
  const environmentSlot = 'item.environment';
  const dateCreatedSlot = 'item.dateCreated';
  const actionsSlot = 'item.actions';

  const siteApps: ComputedRef<IApp[]> = computed(() => apps.value);

  const getEnvironmentUrl = (app: IApp): string | null => {
    switch (app.environment) {
      case ReleaseEnvironment.LOCAL:
        return app.localUrl;
      case ReleaseEnvironment.TEST:
        return app.testUrl;
      case ReleaseEnvironment.STAGING:
        return app.stagingUrl;
      case ReleaseEnvironment.PROD:
        return app.prodUrl;
      default:
        return null;
    }
  };

  const headers = computed(() => {
    let baseHeaders: Array<{ title: string; key: string; sortable?: boolean }> = [];

    baseHeaders = [
      { title: 'Name', key: 'name', sortable: true },
      { title: 'Is Active', key: 'isActive', sortable: false },
      { title: 'Url', key: 'environment', sortable: true },
      { title: 'Owner', key: 'ownerId', sortable: true },
      { title: 'Users', key: 'userCount', sortable: true },
      { title: 'Date Created', key: 'dateCreated', sortable: true },
    ];

    baseHeaders.push({ title: 'Actions', key: 'actions', sortable: false });

    return baseHeaders;
  });

  const activateAppAsync = async (appId: number) => {
    await adminStore.putActivateAppAsync(appId);
  };

  const deactivateAppAsync = async (appId: number) => {
    await adminStore.putDeactivateAppAsync(appId);
  };
</script>
