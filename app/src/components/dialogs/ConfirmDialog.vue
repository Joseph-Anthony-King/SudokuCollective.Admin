<template>
  <v-card class="justify-center text-center">
    <v-card-title>
      <span class="headline">{{ getDialogTitle }}</span>
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
            text="true"
            @click="confirmedHandlerAsync">
            Yes
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            color="blue darken-1"
            text="true"
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
  import { onMounted, onUnmounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useDialogStore } from '@/stores/dialogStore';

  const dialogStore = useDialogStore();
  const { getDialogTitle, getDialogMessage } = storeToRefs(dialogStore);
  const { performConfirmedAction, performNotConfirmedAction, initializeStore } = useDialogStore();

  const confirmedHandlerAsync = async (): Promise<void> => {
    await performConfirmedAction();
  };
  const notConfirmedHandlder = async (): Promise<void> => {
    await performNotConfirmedAction();
    initializeStore();
  };

  //#region Lifecycle Hooks
  onMounted(() => {
    window.addEventListener(
      'keyup',
      async (event) => {
        if (event.key === 'Enter') {
          await confirmedHandlerAsync();
        }
      },
      { once: true },
    );
  });
  onUnmounted(() => {
    window.removeEventListener('keyup', () => {});
  });
  //#endregion
</script>
