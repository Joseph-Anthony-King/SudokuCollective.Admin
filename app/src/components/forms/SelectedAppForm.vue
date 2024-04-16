<template>
  <v-container>
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
            @click:append="copyLicenseToClipboardHandler"
            :readonly="!selectedApp.isEditing"
            :disabled="selectedApp.isEditing"
          ></v-text-field>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="name"
                label="Name"
                prepend-icon="mdi-application"
                :rules="requiredRules('Name')"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"
              ></v-text-field>
            </template>
            <span>Application name</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort"
          >
            <template v-slot:activator="{ props }">
              <v-select
                v-model="selectedReleaseEnvironment"
                label="Please make a selection"
                prepend-icon="mdi-application"
                :rules="requiredRules('Release Environment')"
                :readonly="!selectedApp.isEditing"
                :items="releaseEnvironments"
                item-title="label"
                item-value="value"
                single-line
                v-bind="props"
              ></v-select>
            </template>
            <span>The currently selected development environment</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="localUrl"
                label="Local URL"
                prepend-icon="mdi-application"
                :append-icon="selectedApp.isActive && selectedReleaseEnvironment === ReleaseEnvironment.LOCAL && localUrl !== null ? 'mdi-launch' : ''"
                @click:append="navigateToUrlHandler"
                :rules="urlRules"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"
              ></v-text-field>
            </template>
            <span>URL for your local development environment</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="qaUrl"
                label="Quality Assurance URL"
                prepend-icon="mdi-application"
                :readonly="!selectedApp.isEditing"
                :append-icon="selectedApp.isActive && selectedReleaseEnvironment === ReleaseEnvironment.QA && qaUrl !== null ? 'mdi-launch' : ''"
                @click:append="navigateToUrlHandler"
                :rules="urlRules"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"
              ></v-text-field>
            </template>
            <span>URL for your QA environment</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="stagingUrl"
                label="Staging URL"
                prepend-icon="mdi-application"
                :append-icon="selectedApp.isActive && selectedReleaseEnvironment === ReleaseEnvironment.STAGING && stagingUrl !== null ? 'mdi-launch' : ''"
                @click:append="navigateToUrlHandler"
                :rules="urlRules"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"
              ></v-text-field>
            </template>
            <span>URL for your Staging environment</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="prodUrl"
                label="Production URL"
                prepend-icon="mdi-application"
                :append-icon="selectedApp.isActive && selectedReleaseEnvironment === ReleaseEnvironment.PROD && prodUrl !== null ? 'mdi-launch' : ''"
                @click:append="navigateToUrlHandler"
                :rules="urlRules"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"
              ></v-text-field>
            </template>
            <span>URL for your Production environment</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="sourceCodeUrl"
                label="Source Code URL"
                prepend-icon="mdi-application"
                :readonly="!selectedApp.isEditing"
                :rules="urlRules"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"
              ></v-text-field>
            </template>
            <span>URL hosting your Source Control</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort"
          >
            <template v-slot:activator="{ props }">
              <v-checkbox
                v-model="selectedApp.useCustomSMTPServer"
                :label="selectedApp.useCustomSMTPServer ? 'Custom SMTP Server in use' : 'Custom SMTP Server is not use'"
                :readonly="!selectedApp.isEditing"
                color="primary"
                v-bind="props"
              ></v-checkbox>
            </template>
            <span>Configure a custom SMTP Server for your app</span>
          </v-tooltip>
          <v-tooltip
            v-if="selectedApp.useCustomSMTPServer"
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="SMTPServerName"
                label="SMTP Server Name"
                prepend-icon="mdi-application"
                :rules="selectedApp.useCustomSMTPServer ? urlRules : []"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"
              ></v-text-field>
            </template>
            <span>Name of your SMTP Server</span>
          </v-tooltip>
          <v-tooltip
            v-if="selectedApp.useCustomSMTPServer"
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                type="number"
                v-model="SMTPServerPort"
                label="SMTP Server Port"
                prepend-icon="mdi-application"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"
              ></v-text-field>
            </template>
            <span>Port for your SMTP Server</span>
          </v-tooltip>
          <v-tooltip
            v-if="selectedApp.useCustomSMTPServer"
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                type="number"
                v-model="SMTPServerUserName"
                label="SMTP Server User Name"
                prepend-icon="mdi-application"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"
              ></v-text-field>
            </template>
            <span>User name for your SMTP Server</span>
          </v-tooltip>
          <v-tooltip
            v-if="selectedApp.useCustomSMTPServer"
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                type="number"
                v-model="SMTPServerPassword"
                label="SMTP Server Password"
                prepend-icon="mdi-application"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"
              ></v-text-field>
            </template>
            <span>Password for your SMTP Server</span>
          </v-tooltip>
          <v-tooltip
            v-if="selectedApp.useCustomSMTPServer"
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                type="number"
                v-model="SMTPServerEmail"
                label="SMTP Server From Email"
                prepend-icon="mdi-application"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"
              ></v-text-field>
            </template>
            <span>From email for your SMTP Server</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" lg="6" xl="6">
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort"
          >
            <template v-slot:activator="{ props }">
              <v-checkbox
                v-model="selectedApp.isActive"
                :label="selectedApp.isActive ? 'App is currently active' : 'App is currently deactivated'"
                :readonly="!selectedApp.isEditing"
                color="primary"
                v-bind="props"
              ></v-checkbox>
            </template>
            <span>Activate or deactive your app</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort"
          >
            <template v-slot:activator="{ props }">
              <v-checkbox
                v-model="selectedApp.disableCustomUrls"
                :label="!selectedApp.disableCustomUrls ? 'Custom Email Confirmation and Password Reset endpoints are active' : 'Custom Email Confirmation and Password Reset endpoints are not active'"
                :readonly="!selectedApp.isEditing"
                color="primary"
                v-bind="props"
              ></v-checkbox>
            </template>
            <span>Custom email confirmation and password reset endpoints are active or deactive</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || sourceCodeUrl !== null || isSmallViewPort"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="confirmEmailAction"
                label="Confirm Email Action"
                prepend-icon="mdi-application"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"
              ></v-text-field>
            </template>
            <span>Custom action for the email confirmation process</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || sourceCodeUrl !== null || isSmallViewPort"
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="resetPasswordAction"
                label="Reset Password Action"
                prepend-icon="mdi-application"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"
              ></v-text-field>
            </template>
            <span>Custom action for the password reset process</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort"
          >
            <template v-slot:activator="{ props }">
              <v-checkbox
                v-model="selectedApp.permitCollectiveLogins"
                :label="selectedApp.permitCollectiveLogins ? 'Any sudoku collective user can login' : 'A user must subscribe to your app to login'"
                :readonly="!selectedApp.isEditing"
                color="primary"
                v-bind="props"
              ></v-checkbox>
            </template>
            <span>Are users required to subcribe to your app to login</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort"
          >
            <template v-slot:activator="{ props }">
              <v-checkbox
                v-model="selectedApp.permitSuperUserAccess"
                :label="selectedApp.permitSuperUserAccess ? 'Super users have default access to your app' : 'Super users do not have default access to your app'"
                :readonly="!selectedApp.isEditing"
                color="primary"
                v-bind="props"
              ></v-checkbox>
            </template>
            <span>Do Super Users have default access to your app</span>
          </v-tooltip>
          <v-tooltip
            v-if="!selectedApp.isEditing"
            open-delay="2000"
            location="bottom"
            disabled
          >
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="accessDuration"
                label="Token Access Period"
                prepend-icon="mdi-calendar-range"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"
              ></v-text-field>
            </template>
            <span>Access period for authorization tokens</span>
          </v-tooltip>
          <v-col cols="12" v-if="selectedApp.isEditing">
          <v-row>
            <v-tooltip              
              open-delay="2000"
              location="bottom"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  v-model="accessDurationMagnitude"
                  type="number"
                  label="Token Access Magnitude"
                  prepend-icon="mdi-clock"
                  color="primary"
                  v-bind="props"
                ></v-text-field>
              </template>
              <span>Access magnitude for the authorization token</span>
            </v-tooltip>
            <v-tooltip
              open-delay="2000"
              location="bottom"
            >
              <template v-slot:activator="{ props }">
                <v-select
                  v-model="selectedTimeFrame"
                  label="Please make a selection"
                  prepend-icon="mdi-calendar"
                  :readonly="!selectedApp.isEditing"
                  :items="timeFrames"
                  item-title="label"
                  item-value="value"
                  single-line
                  v-bind="props"
                ></v-select>
              </template>
              <span>The effective period for the authorization token</span>
            </v-tooltip>
          </v-row>
          </v-col>
          <v-text-field
            v-model="formattedDateCreated"
            label="Date Created"
            hint="MM/DD/YYYY format"
            persistent-hint
            prepend-icon="mdi-calendar"
            :readonly="!selectedApp.isEditing"
            :disabled="selectedApp.isEditing"
          ></v-text-field>
          <v-text-field
            v-model="formattedDateUpdated"
            label="Date Updated"
            hint="MM/DD/YYYY format"
            persistent-hint
            prepend-icon="mdi-calendar"
            :readonly="!selectedApp.isEditing"
            :disabled="selectedApp.isEditing"
          ></v-text-field>
        </v-col>
      </v-row>
      <AvailableActions>
        <v-row dense>
          <v-col cols="12" sm="6" md="6" lg="3" xl="3" xxl="3">
            <v-tooltip
              open-delay="2000"
              location="bottom"
              :disabled="formValid || isSmallViewPort"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text
                  v-bind="props"
                  :disabled="formValid"
                  @click.prevent="
                    selectedApp.isEditing === false
                      ? (selectedApp.isEditing = true)
                      : (confirmEditSubmission = true)"
                >
                  {{ submitText }}
                </v-btn>
              </template>
              <span>{{ submitHelperText }}</span>
            </v-tooltip>
          </v-col>
          <v-col cols="12" sm="6" md="6" lg="3" xl="3" xxl="3">
            <v-tooltip
              open-delay="2000"
              location="bottom"
              :disabled="selectedApp.isEditing || isSmallViewPort"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text
                  v-bind="props"
                  :disabled="selectedApp.isEditing"
                  @click="confirmRefresh = true"
                >
                  Refresh
                </v-btn>
              </template>
              <span>Pull latest values from the API</span>
            </v-tooltip>
          </v-col>
          <v-col cols="12" sm="6" md="6" lg="3" xl="3" xxl="3">
            <v-tooltip
              open-delay="2000"
              location="bottom"
              :disabled="!selectedApp.isEditing || isSmallViewPort"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text
                  v-bind="props"
                  :disabled="!selectedApp.isEditing"
                  @click="cancelHandler($event)"
                >
                  Cancel
                </v-btn>
              </template>
              <span>Cancel editing of your app</span>
            </v-tooltip>
          </v-col>
          <v-col cols="12" sm="6" md="6" lg="3" xl="3" xxl="3">
            <v-tooltip
              open-delay="2000"
              location="bottom"
              :disabled="selectedApp.isEditing || selectedApp.id === 1 || isSmallViewPort"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  color="red darken-1"
                  text
                  v-bind="props"
                  :disabled="selectedApp.isEditing || selectedApp.id === 1"
                  @click="confirmDeleteSubmission = true"
                >
                  Delete
                </v-btn>
              </template>
              <span>Delete this app</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </AvailableActions>
    </v-form>
  </v-container>
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
import { useAppStore } from "@/stores/appStore";
import { useUserStore } from "@/stores/userStore";
import { useValueStore } from "@/stores/valueStore";
import AvailableActions from "@/components/buttons/AvailableActions.vue";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import { ReleaseEnvironment } from '@/enums/releaseEnvironment';
import { TimeFrame } from '@/enums/timeFrame';
import { DropdownItem } from '@/models/infrastructure/dropdownItem';
import { App } from '@/models/domain/app';
import { User } from '@/models/domain/user';
import rules from "@/utilities/rules/index";
import commonUtilities from "@/utilities/common";

const { requiredRules, urlRules } = rules();
const {
  updateAppProcessingAsync,
} = commonUtilities();

const props = defineProps({
  formStatus: {
    type: Boolean,
    default: true,
  },
});

//#region Instantiate the Stores
const appStore = useAppStore();
const userStore = useUserStore();
const valueStore = useValueStore();
//#endregion

//#region Properties
const user: Ref<User> = ref(userStore.getUser);
const selectedApp: Ref<App> = ref(appStore.getSelectedApp ? appStore.getSelectedApp : new App());
const name: Ref<string | null> = ref(appStore.getSelectedApp ? appStore.getSelectedApp.name : null);
const localUrl: Ref<string | null> = ref(appStore.getSelectedApp ? appStore.getSelectedApp.localUrl : null);
const qaUrl: Ref<string | null> = ref(appStore.getSelectedApp ? appStore.getSelectedApp.qaUrl : null);
const stagingUrl: Ref<string | null> = ref(appStore.getSelectedApp ? appStore.getSelectedApp.stagingUrl : null);
const prodUrl: Ref<string | null> = ref(appStore.getSelectedApp ? appStore.getSelectedApp.prodUrl : null);
const sourceCodeUrl: Ref<string | null> = ref(appStore.getSelectedApp ? appStore.getSelectedApp.sourceCodeUrl : null);
const releaseEnvironments: Ref<DropdownItem[]> = ref(valueStore.getReleaseEnvironments);
const selectedReleaseEnvironment: Ref<ReleaseEnvironment> = ref(appStore.getSelectedApp ? appStore.getSelectedApp.environment : ReleaseEnvironment.LOCAL);
const confirmEmailAction: Ref<string | null> = ref(appStore.getSelectedApp ? appStore.getSelectedApp.customEmailConfirmationAction : null);
const resetPasswordAction: Ref<string | null> = ref(appStore.getSelectedApp ? appStore.getSelectedApp.customPasswordResetAction : null);
const accessDuration: ComputedRef<string> = computed(() => {
  if (appStore.getSelectedApp?.timeFrame === TimeFrame.SECONDS) {
    const seconds = appStore.getSelectedApp.accessDuration === 1 ? "second" : "seconds";
    return `${appStore.getSelectedApp.accessDuration} ${seconds}`;
  } else if (appStore.getSelectedApp?.timeFrame === TimeFrame.MINUTES) {
    const minutes = appStore.getSelectedApp.accessDuration === 1 ? "minute" : "minutes";
    return `${appStore.getSelectedApp.accessDuration} ${minutes}`;
  } else if (appStore.getSelectedApp?.timeFrame === TimeFrame.HOURS) {
    const hours = appStore.getSelectedApp.accessDuration === 1 ? "hour" : "hours";
    return `${appStore.getSelectedApp.accessDuration} ${hours}`;
  } else if (appStore.getSelectedApp?.timeFrame === TimeFrame.DAYS) {
    const days = appStore.getSelectedApp.accessDuration === 1 ? "day" : "days";
    return `${appStore.getSelectedApp.accessDuration} ${days}`;
  } else if (appStore.getSelectedApp?.timeFrame === TimeFrame.MONTHS) {
    const months = appStore.getSelectedApp.accessDuration === 1 ? "month" : "months";
    return `${appStore.getSelectedApp.accessDuration} ${months}`;
  } else if (appStore.getSelectedApp?.timeFrame === TimeFrame.YEARS) {
    const years = appStore.getSelectedApp.accessDuration === 1 ? "year" : "years";
    return `${appStore.getSelectedApp.accessDuration} ${years}`;
  } else {
    return "";
  }
});
const timeFrames: Ref<DropdownItem[]> = ref(valueStore.getTimeFrames);
const selectedTimeFrame: Ref<TimeFrame> = ref(appStore.getSelectedApp ? appStore.getSelectedApp.timeFrame : TimeFrame.MINUTES);
const accessDurationMagnitude: Ref<number> = ref(appStore.getSelectedApp ? appStore.getSelectedApp.accessDuration : 0);
const formattedDateCreated: ComputedRef<string | null> = computed(() => {
  if (selectedApp.value.dateCreated === undefined) {
    return null;
  } else {
    return `${new Date(selectedApp.value.dateCreated).toLocaleDateString()} ${new Date(
      selectedApp.value.dateCreated
    ).toLocaleTimeString()}`;
  }
});
const formattedDateUpdated: ComputedRef<string | null> = computed(() => {
  if (selectedApp.value.dateUpdated === undefined) {
    return null;
  } else {
    if (
      `${new Date(selectedApp.value.dateUpdated).toLocaleDateString()} ${new Date(
        selectedApp.value.dateUpdated
      ).toLocaleTimeString()}` === "1/1/1 12:00:00 AM"
    ) {
      return null;
    } else {
      return `${new Date(
        selectedApp.value.dateUpdated
      ).toLocaleDateString()} ${new Date(
        selectedApp.value.dateUpdated
      ).toLocaleTimeString()}`;
    }
  }
});
const submitText: ComputedRef<string> = computed(() => {
  if (!selectedApp.value.isEditing) {
    return "Edit";
  } else {
    return "Submit";
  }
});
const submitHelperText: ComputedRef<string> = computed(() => {
  if (!selectedApp.value.isEditing) {
    return "Edit your App";
  } else {
    return "Submit your changes";
  }
});
const SMTPServerName: ComputedRef<string | null> = computed(() => selectedApp.value.smtpServerSettings ? selectedApp.value.smtpServerSettings.smptServer : null);
const SMTPServerPort: ComputedRef<number> = computed(() => selectedApp.value.smtpServerSettings ? selectedApp.value.smtpServerSettings.port : 0);
const SMTPServerUserName: ComputedRef<string | null> = computed(() => selectedApp.value.smtpServerSettings ? selectedApp.value.smtpServerSettings.userName : null);
const SMTPServerPassword: ComputedRef<string | null> = computed(() => selectedApp.value.smtpServerSettings ? selectedApp.value.smtpServerSettings.password : null);
const SMTPServerEmail: ComputedRef<string | null> = computed(() => selectedApp.value.smtpServerSettings ? selectedApp.value.smtpServerSettings.fromEmail : null);
const appUrl: ComputedRef<string | null> = computed(() => {
  if (selectedApp.value.environment === ReleaseEnvironment.LOCAL && selectedApp.value.localUrl !== null) {
    return selectedApp.value.localUrl;
  } else if (selectedApp.value.environment === ReleaseEnvironment.QA && selectedApp.value.qaUrl !== null) {
    return selectedApp.value.qaUrl;
  } else if (selectedApp.value.environment === ReleaseEnvironment.STAGING && selectedApp.value.stagingUrl !== null) {
    return selectedApp.value.stagingUrl;
  } else if (selectedApp.value.environment === ReleaseEnvironment.PROD && selectedApp.value.prodUrl !== null) {
    return selectedApp.value.prodUrl;
  } else {
    return null;
  }
});

watch(
  () => appStore.getSelectedApp,
  () => { 
    selectedApp.value = appStore.getSelectedApp ? appStore.getSelectedApp : new App();
    name.value = appStore.getSelectedApp ? appStore.getSelectedApp.name : null;
    localUrl.value = appStore.getSelectedApp ? appStore.getSelectedApp.localUrl : null;
    qaUrl.value = appStore.getSelectedApp ? appStore.getSelectedApp.qaUrl : null;
    stagingUrl.value = appStore.getSelectedApp ? appStore.getSelectedApp.stagingUrl : null;
    prodUrl.value = appStore.getSelectedApp ? appStore.getSelectedApp.prodUrl : null;
    sourceCodeUrl.value = appStore.getSelectedApp ? appStore.getSelectedApp.sourceCodeUrl : null;
    selectedReleaseEnvironment.value = appStore.getSelectedApp ? appStore.getSelectedApp.environment : ReleaseEnvironment.LOCAL;
    confirmEmailAction.value = appStore.getSelectedApp ? appStore.getSelectedApp.customEmailConfirmationAction : null;
    resetPasswordAction.value = appStore.getSelectedApp ? appStore.getSelectedApp.customPasswordResetAction : null;
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
//#endregion

//#region Action Handlers
const cancelHandler = (event: Event | null = null): void => {
  event?.preventDefault();
  updateAppProcessingAsync(() => {
    selectedApp.value = appStore.getSelectedApp ? appStore.getSelectedApp : new App();
    name.value = appStore.getSelectedApp ? appStore.getSelectedApp.name : null;
    localUrl.value = appStore.getSelectedApp ? appStore.getSelectedApp.localUrl : null;
    qaUrl.value = appStore.getSelectedApp ? appStore.getSelectedApp.qaUrl : null;
    stagingUrl.value = appStore.getSelectedApp ? appStore.getSelectedApp.stagingUrl : null;
    prodUrl.value = appStore.getSelectedApp ? appStore.getSelectedApp.prodUrl : null;
    sourceCodeUrl.value = appStore.getSelectedApp ? appStore.getSelectedApp.sourceCodeUrl : null;
    selectedReleaseEnvironment.value = appStore.getSelectedApp ? appStore.getSelectedApp.environment : ReleaseEnvironment.LOCAL;
    confirmEmailAction.value = appStore.getSelectedApp ? appStore.getSelectedApp.customEmailConfirmationAction : null;
    resetPasswordAction.value = appStore.getSelectedApp ? appStore.getSelectedApp.customPasswordResetAction : null;
    selectedApp.value.isEditing = false;
  });
};
const copyLicenseToClipboardHandler = async (): Promise<void> => {
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
const navigateToUrlHandler = (): void => {
  if (selectedReleaseEnvironment.value === ReleaseEnvironment.LOCAL) {
    window.open(localUrl.value?.toString(), '_blank');
  } else if (selectedReleaseEnvironment.value === ReleaseEnvironment.QA) {
    window.open(qaUrl.value?.toString(), '_blank');
  } else if (selectedReleaseEnvironment.value === ReleaseEnvironment.STAGING) {
    window.open(stagingUrl.value?.toString(), '_blank');
  } else {
    window.open(prodUrl.value?.toString(), '_blank');
  }
}
//#endregion

//#region Confirm dialog logic
const isSmallViewPort: Ref<boolean> = ref(true);
const maxDialogWidth: Ref<string> = ref("auto");
const confirmEditSubmission: Ref<boolean> = ref(false);
const confirmRefresh: Ref<boolean> = ref(false);
const confirmDialog: Ref<boolean> = ref(false);
const confirmDeleteSubmission: Ref<boolean> = ref(false);
const confirmTitle: ComputedRef<string | undefined> = computed(() => {
  if (confirmDeleteSubmission.value) {
    return "Confirm Delete";
  } else {
    return undefined;
  }
});
const confirmMessage: ComputedRef<string | undefined> = computed(() => {
  if (confirmDeleteSubmission.value) {
    return `Are you sure you want to delete this app ${user.value.userName}?  This action cannot be reversed and all games associated with this app will be deleted as well.`;
  } else {
    return undefined;
  }
});

watch(
  () => confirmDeleteSubmission.value,
  () => {
    if (confirmDeleteSubmission.value) {
      confirmDialog.value = confirmDeleteSubmission.value;
    }
  }
);

const actionConfirmedHandler = (event: Event | null = null): void => {
  event?.preventDefault();
  alert("action confirmed...");
};
const actionNotConfirmedHandler = async (event: Event | null = null): Promise<void> => {
  event?.preventDefault();
  await updateAppProcessingAsync(() => {
    if (confirmDeleteSubmission.value) {
      confirmDialog.value = false;
      confirmDeleteSubmission.value = false;
    }
  });
};
//#endregion
</script>
@/stores/appStore@/stores/userStore@/stores/valueStore