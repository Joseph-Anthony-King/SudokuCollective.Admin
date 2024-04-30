<template>
  <v-card class="justify-center text-center">
    <v-card-title>
      <span
        class="headline"
        v-html="getDialogTitle"></span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-col cols="12">
          <p v-html="getDialogMessage"></p>
        </v-col>
      </v-container>
    </v-card-text>
    <v-card-actions class="text-center">
      <v-row :dense="true">
        <v-col cols="12">
          <v-btn
            color="blue darken-1"
            variant="text"
            @click="closeHandler($event)">
            ok
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
  /* eslint-disable no-undef */
  import { storeToRefs } from 'pinia';
  import { useDialogStore } from '@/stores/dialogStore';

  //#region Destructure Stores
  const dialogStore = useDialogStore();
  const { getDialogTitle, getDialogMessage } = storeToRefs(dialogStore);
  const { initializeStore } = dialogStore;
  //#endregion

  //#region Action Handlers
  const closeHandler = (event: Event | undefined = undefined): void => {
    event?.preventDefault();
    initializeStore();
  };
  //#endregion
</script>
