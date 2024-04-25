<template>
  <v-card class="justify-center text-center">
    <v-card-title>
      <span class="headline">{{ title }}</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <p v-html="message"></p>
      </v-container>
    </v-card-text>
    <v-card-actions class="text-center">
      <v-row :dense="true">
        <v-col cols="12">
          <v-btn
            color="blue darken-1"
            text="true"
            @click="close($event)">
            ok
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
  /* eslint-disable no-undef */
  import { type Ref, ref, onMounted, onUnmounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useDialogStore } from '@/stores/dialogStore';

  const dialogStore = useDialogStore();
  const { getDialogTitle, getDialogMessage } = storeToRefs(dialogStore);
  const { initializeStore } = dialogStore;

  const title: Ref<string | null> = ref(getDialogTitle.value);
  const message: Ref<string | null> = ref(getDialogMessage.value);

  const close = (event: Event | undefined = undefined): void => {
    event?.preventDefault();
    initializeStore();
  };

  //#region Lifecycle Hooks
  onMounted(() => {
    window.addEventListener(
      'keyup',
      async (event) => {
        if (event.key === 'Enter') {
          close();
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
