<template>
  <v-card>
    <v-card-text>
      <v-row>
        <v-col
          cols="12"
          md="6">
          <v-autocomplete
            v-model="selectedDifficultyId"
            :items="difficulties"
            item-title="displayName"
            item-value="id"
            label="Difficulty"
            clearable
            autocomplete="off" />
        </v-col>
        <v-col
          cols="12"
          md="6">
          <v-autocomplete
            v-model="selectedRoleId"
            :items="roles"
            item-title="name"
            item-value="id"
            label="Role"
            clearable
            autocomplete="off" />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          md="4">
          <v-autocomplete
            v-model="selectedReleaseEnvironment"
            :items="releaseEnvironments"
            item-title="label"
            item-value="value"
            label="Release Environment"
            clearable
            autocomplete="off" />
        </v-col>
        <v-col
          cols="12"
          md="4">
          <v-autocomplete
            v-model="selectedSortValue"
            :items="sortValues"
            item-title="label"
            item-value="value"
            label="Sort By"
            clearable
            autocomplete="off" />
        </v-col>
        <v-col
          cols="12"
          md="4">
          <v-autocomplete
            v-model="selectedTimeFrame"
            :items="timeFrames"
            item-title="label"
            item-value="value"
            label="Time Frame"
            clearable
            autocomplete="off" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useAdminStore } from '@/stores/adminStore';

  const adminStore = useAdminStore();
  const { getAdminSummary } = storeToRefs(adminStore);

  const difficulties = computed(() => getAdminSummary.value.difficulties);
  const roles = computed(() => getAdminSummary.value.roles);
  const releaseEnvironments = computed(() => getAdminSummary.value.releaseEnvironments);
  const sortValues = computed(() => getAdminSummary.value.sortValues);
  const timeFrames = computed(() => getAdminSummary.value.timeFrames);

  const selectedDifficultyId = ref<number | null>(null);
  const selectedRoleId = ref<number | null>(null);
  const selectedReleaseEnvironment = ref<number | null>(null);
  const selectedSortValue = ref<number | null>(null);
  const selectedTimeFrame = ref<number | null>(null);
</script>
