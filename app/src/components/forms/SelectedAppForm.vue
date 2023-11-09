<template>
  <v-card-title class="justify-center text-center">
    <span class="headline">{{ formTitle }}</span>
  </v-card-title>
  <v-form v-model="formValid" ref="form" onsubmit="event.preventDefault();">
    <v-row>
      <v-col cols="12" lg="6" xl="6">
        <v-text-field
          v-model="selectedApp.id"
          type="number"
          label="Id"
          prepend-icon="mdi-application"
          :readonly="!selectedApp.isEditing"
          :disabled="selectedApp.isEditing"
        ></v-text-field>
        <v-text-field
          v-model="selectedApp.license"
          label="License"
          prepend-icon="mdi-application"
          append-icon="mdi-content-copy"
          @click:append="copyLicenseToClipboard"
          :readonly="!selectedApp.isEditing"
          :disabled="selectedApp.isEditing"
        ></v-text-field>
        <v-tooltip
          open-delay="2000"
          location="bottom"
          :disabled="!selectedApp.isEditing || name !== null || isSmallViewPort"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="name"
              label="Name"
              prepend-icon="mdi-application"
              :readonly="!selectedApp.isEditing"
              :color="!selectedApp.isEditing ? '' : 'primary'"
              v-bind="props"
            ></v-text-field>
          </template>
          <span>Application name</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <AvailableActions>
    </AvailableActions>
  </v-form>
  <v-dialog
    v-model="confirmDialog"
    persistent
    :fullscreen="isSmallViewPort"
    :max-width="maxDialogWidth"
    hide-overlay
    transition="dialog-top-transition"
  >
    <ConfirmDialog
      :title="confirmTitle"
      :message="confirmMessage"
      v-on:action-confirmed="actionConfirmedHandler"
      v-on:action-not-confirmed="actionNotConfirmedHandler"
    />
  </v-dialog>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars*/
/* eslint-disable @typescript-eslint/no-explicit-any*/
import { ComputedRef, computed, Ref, ref, watch } from 'vue';
import { VForm } from "vuetify/components";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { useAppStore } from "@/store/appStore";
import AvailableActions from "@/components/buttons/AvailableActions.vue";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import { App } from '@/models/domain/app';

const props = defineProps({
  formStatus: {
    type: Boolean,
    default: true,
  },
});

const appStore = useAppStore();

//#region Properties
const selectedApp: Ref<App> = ref(appStore.getSelectedApp ? appStore.getSelectedApp : new App());
const name: Ref<string | null> = ref(appStore.getSelectedApp ? appStore.getSelectedApp.name : null);

watch(
  () => appStore.getSelectedApp,
  () => { 
    selectedApp.value = appStore.getSelectedApp ? appStore.getSelectedApp : new App();
    name.value = appStore.getSelectedApp ? appStore.getSelectedApp.name : null;
  }
);
//#endregion

//#region Form Logic
const form: Ref<VForm | null> = ref(null);
const formValid: Ref<boolean> = ref(false);
const formTitle: ComputedRef<string | null> = computed(() => selectedApp.value.name);
const getFormStatus: ComputedRef<boolean> = computed(() => props.formStatus);
const resetFormStatus: ComputedRef<boolean> = computed(() => {
  return !props.formStatus;
});
const copyLicenseToClipboard = async () => {
  try {
    if (selectedApp.value?.license !== null && selectedApp.value?.license !== undefined) {
      await navigator.clipboard.writeText(selectedApp.value.license);
    }
    toast("Copied license to clipboard", {
      position: toast.POSITION.TOP_CENTER,
      type: toast.TYPE.SUCCESS,
    });
  } catch (error: any) {
    toast((error as Error).message, {
      position: toast.POSITION.TOP_CENTER,
      type: toast.TYPE.ERROR,
    });
  }
};
//#endregion

//#region Confirm dialog logic
const confirmDialog: Ref<boolean> = ref(false);
const isSmallViewPort: Ref<boolean> = ref(true);
const maxDialogWidth: Ref<string> = ref("auto");
const confirmTitle: ComputedRef<string | undefined> = computed(() => "App");
const confirmMessage: ComputedRef<string | undefined> = computed(() => "Message");

const actionConfirmedHandler = (event: Event | null = null): void => {
  event?.preventDefault();
  alert("action confirmed...");
};
const actionNotConfirmedHandler = (event: Event | null = null): void => {
  event?.preventDefault();
  alert("action not confirmed...");
};
//#endregion
</script>
