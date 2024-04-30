<template>
  <v-card class="justify-center text-center">
    <v-card-title>
      <span
        class="headline"
        v-html="getDialogTitle"></span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <p v-html="getDialogMessage"></p>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-row :dense="true">
        <v-col>
          <v-btn
            color="blue darken-1"
            variant="text"
            @click="confirmedHandlerAsync">
            Yes
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            color="blue darken-1"
            variant="text"
            @click="notConfirmedHandlder">
            No
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
  const {
    updateDialogIsActive,
    performConfirmedAction,
    performNotConfirmedAction,
    initializeStore,
  } = useDialogStore();
  //#endregion

  //#region Action Handlers
  const confirmedHandlerAsync = async (): Promise<void> => {
    updateDialogIsActive(false);
    await performConfirmedAction();
    initializeStore();
  };
  const notConfirmedHandlder = async (): Promise<void> => {
    updateDialogIsActive(false);
    await performNotConfirmedAction();
    initializeStore();
  };
  //#endregion
</script>
