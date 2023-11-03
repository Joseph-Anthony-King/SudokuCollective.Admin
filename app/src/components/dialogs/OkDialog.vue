<template>
  <v-card class="justify-center text-center">
    <v-card-title>
      <span class="headline">{{ title }}</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <p v-html="message">
        </p>
      </v-container>
    </v-card-text>
    <v-card-actions class="text-center">
      <v-row :dense="true">
        <v-col cols="12">
          <v-btn color="blue darken-1" text @click="close($event)">
            ok
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { useOkDialogStore } from "@/store/okDialogStore";
import { Ref, ref } from "vue";

const emit = defineEmits(["close-ok-dialog"]);

const okDialogStore = useOkDialogStore();
const title: Ref<string | null> = ref(okDialogStore.getTitle);
const message: Ref<string | null> = ref(okDialogStore.getMessage);

const close = (event: Event | undefined = undefined): void => {
  event?.preventDefault();
  emit("close-ok-dialog", undefined, undefined);
};
</script>
