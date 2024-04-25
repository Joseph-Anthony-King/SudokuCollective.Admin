<template>
  <v-container>
    <v-card-title class="justify-center text-center">
      <span class="headline">{{ formTitle }}</span>
    </v-card-title>
    <v-form
      v-model="formValid"
      ref="form"
      onsubmit="event.preventDefault();">
      <v-row>
        <v-col
          cols="12"
          lg="6"
          xl="6">
          <v-text-field
            v-model="selectedApp.id"
            type="number"
            label="Id"
            prepend-icon="mdi-application"
            :readonly="!selectedApp.isEditing"
            :disabled="selectedApp.isEditing"></v-text-field>
          <v-text-field
            v-model="selectedApp.license"
            label="License"
            prepend-icon="mdi-application"
            append-icon="mdi-content-copy"
            @click:append="copyLicenseToClipboardHandler"
            :readonly="!selectedApp.isEditing"
            :disabled="selectedApp.isEditing"></v-text-field>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="name"
                label="Name"
                prepend-icon="mdi-application"
                :rules="requiredRules('Name')"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"></v-text-field>
            </template>
            <span>Application name</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort">
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
                v-bind="props"></v-select>
            </template>
            <span>The currently selected development environment</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="localUrl"
                label="Local URL"
                prepend-icon="mdi-application"
                :append-icon="
                  selectedApp.isActive &&
                  selectedReleaseEnvironment === ReleaseEnvironment.LOCAL &&
                  localUrl !== null
                    ? 'mdi-launch'
                    : ''
                "
                @click:append="navigateToUrlHandler"
                :rules="urlRules"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"></v-text-field>
            </template>
            <span>URL for your local development environment</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="qaUrl"
                label="Quality Assurance URL"
                prepend-icon="mdi-application"
                :readonly="!selectedApp.isEditing"
                :append-icon="
                  selectedApp.isActive &&
                  selectedReleaseEnvironment === ReleaseEnvironment.QA &&
                  qaUrl !== null
                    ? 'mdi-launch'
                    : ''
                "
                @click:append="navigateToUrlHandler"
                :rules="urlRules"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"></v-text-field>
            </template>
            <span>URL for your QA environment</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="stagingUrl"
                label="Staging URL"
                prepend-icon="mdi-application"
                :append-icon="
                  selectedApp.isActive &&
                  selectedReleaseEnvironment === ReleaseEnvironment.STAGING &&
                  stagingUrl !== null
                    ? 'mdi-launch'
                    : ''
                "
                @click:append="navigateToUrlHandler"
                :rules="urlRules"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"></v-text-field>
            </template>
            <span>URL for your Staging environment</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="prodUrl"
                label="Production URL"
                prepend-icon="mdi-application"
                :append-icon="
                  selectedApp.isActive &&
                  selectedReleaseEnvironment === ReleaseEnvironment.PROD &&
                  prodUrl !== null
                    ? 'mdi-launch'
                    : ''
                "
                @click:append="navigateToUrlHandler"
                :rules="urlRules"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"></v-text-field>
            </template>
            <span>URL for your Production environment</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="sourceCodeUrl"
                label="Source Code URL"
                prepend-icon="mdi-application"
                :readonly="!selectedApp.isEditing"
                :rules="urlRules"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"></v-text-field>
            </template>
            <span>URL hosting your Source Control</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-checkbox
                v-model="selectedApp.useCustomSMTPServer"
                :label="
                  selectedApp.useCustomSMTPServer
                    ? 'Custom SMTP Server in use'
                    : 'Custom SMTP Server is not use'
                "
                :readonly="!selectedApp.isEditing"
                color="primary"
                v-bind="props"></v-checkbox>
            </template>
            <span>Configure a custom SMTP Server for your app</span>
          </v-tooltip>
          <v-tooltip
            v-if="selectedApp.useCustomSMTPServer"
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="SMTPServerName"
                label="SMTP Server Name"
                prepend-icon="mdi-application"
                :rules="selectedApp.useCustomSMTPServer ? urlRules : []"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"></v-text-field>
            </template>
            <span>Name of your SMTP Server</span>
          </v-tooltip>
          <v-tooltip
            v-if="selectedApp.useCustomSMTPServer"
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-text-field
                type="number"
                v-model="SMTPServerPort"
                label="SMTP Server Port"
                prepend-icon="mdi-application"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"></v-text-field>
            </template>
            <span>Port for your SMTP Server</span>
          </v-tooltip>
          <v-tooltip
            v-if="selectedApp.useCustomSMTPServer"
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="SMTPServerUserName"
                label="SMTP Server User Name"
                prepend-icon="mdi-application"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"></v-text-field>
            </template>
            <span>User name for your SMTP Server</span>
          </v-tooltip>
          <v-tooltip
            v-if="selectedApp.useCustomSMTPServer && selectedApp.isEditing"
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="SMTPServerPassword"
                label="SMTP Server Password"
                prepend-icon="mdi-application"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"></v-text-field>
            </template>
            <span>Password for your SMTP Server</span>
          </v-tooltip>
          <v-tooltip
            v-if="selectedApp.useCustomSMTPServer"
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="SMTPServerEmail"
                label="SMTP Server From Email"
                prepend-icon="mdi-application"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"></v-text-field>
            </template>
            <span>From email for your SMTP Server</span>
          </v-tooltip>
        </v-col>
        <v-col
          cols="12"
          lg="6"
          xl="6">
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-checkbox
                v-model="selectedApp.isActive"
                :label="
                  selectedApp.isActive ? 'App is currently active' : 'App is currently deactivated'
                "
                :readonly="!selectedApp.isEditing"
                color="primary"
                v-bind="props"></v-checkbox>
            </template>
            <span>Activate or deactive your app</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-checkbox
                v-model="selectedApp.disableCustomUrls"
                :label="
                  !selectedApp.disableCustomUrls
                    ? 'Custom Email Confirmation and Password Reset endpoints are active'
                    : 'Custom Email Confirmation and Password Reset endpoints are not active'
                "
                :readonly="!selectedApp.isEditing"
                color="primary"
                v-bind="props"></v-checkbox>
            </template>
            <span
              >Custom email confirmation and password reset endpoints are active or deactive</span
            >
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || sourceCodeUrl !== null || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="confirmEmailAction"
                label="Confirm Email Action"
                prepend-icon="mdi-application"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"></v-text-field>
            </template>
            <span>Custom action for the email confirmation process</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || sourceCodeUrl !== null || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="resetPasswordAction"
                label="Reset Password Action"
                prepend-icon="mdi-application"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"></v-text-field>
            </template>
            <span>Custom action for the password reset process</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-checkbox
                v-model="selectedApp.permitCollectiveLogins"
                :label="
                  selectedApp.permitCollectiveLogins
                    ? 'Any sudoku collective user can login'
                    : 'A user must subscribe to your app to login'
                "
                :readonly="!selectedApp.isEditing"
                color="primary"
                v-bind="props"></v-checkbox>
            </template>
            <span>Are users required to subcribe to your app to login</span>
          </v-tooltip>
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="!selectedApp.isEditing || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-checkbox
                v-model="selectedApp.permitSuperUserAccess"
                :label="
                  selectedApp.permitSuperUserAccess
                    ? 'Super users have default access to your app'
                    : 'Super users do not have default access to your app'
                "
                :readonly="!selectedApp.isEditing"
                color="primary"
                v-bind="props"></v-checkbox>
            </template>
            <span>Do Super Users have default access to your app</span>
          </v-tooltip>
          <v-tooltip
            v-if="!selectedApp.isEditing"
            open-delay="2000"
            location="bottom"
            disabled>
            <template v-slot:activator="{ props }">
              <v-text-field
                v-model="accessDuration"
                label="Token Access Period"
                prepend-icon="mdi-calendar-range"
                :readonly="!selectedApp.isEditing"
                :color="!selectedApp.isEditing ? '' : 'primary'"
                v-bind="props"></v-text-field>
            </template>
            <span>Access period for authorization tokens</span>
          </v-tooltip>
          <v-col
            cols="12"
            v-if="selectedApp.isEditing">
            <v-row>
              <v-tooltip
                open-delay="2000"
                location="bottom">
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="accessDurationMagnitude"
                    type="number"
                    label="Token Access Magnitude"
                    prepend-icon="mdi-clock"
                    color="primary"
                    v-bind="props"></v-text-field>
                </template>
                <span>Access magnitude for the authorization token</span>
              </v-tooltip>
              <v-tooltip
                open-delay="2000"
                location="bottom">
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
                    v-bind="props"></v-select>
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
            :disabled="selectedApp.isEditing"></v-text-field>
          <v-text-field
            v-model="formattedDateUpdated"
            label="Date Updated"
            hint="MM/DD/YYYY format"
            persistent-hint
            prepend-icon="mdi-calendar"
            :readonly="!selectedApp.isEditing"
            :disabled="selectedApp.isEditing"></v-text-field>
        </v-col>
      </v-row>
      <AvailableActions>
        <v-row dense>
          <v-col
            cols="12"
            sm="6"
            md="6"
            lg="3"
            xl="3"
            xxl="3">
            <v-tooltip
              open-delay="2000"
              location="bottom"
              :disabled="formValid || isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text="true"
                  v-bind="props"
                  :disabled="formValid"
                  @click.prevent="
                    selectedApp.isEditing === false
                      ? (selectedApp.isEditing = true)
                      : confirmEditHandler()
                  ">
                  {{ submitText }}
                </v-btn>
              </template>
              <span>{{ submitHelperText }}</span>
            </v-tooltip>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="6"
            lg="3"
            xl="3"
            xxl="3">
            <v-tooltip
              open-delay="2000"
              location="bottom"
              :disabled="selectedApp.isEditing || isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text="true"
                  v-bind="props"
                  :disabled="selectedApp.isEditing"
                  @click="confirmRefreshHandler">
                  Refresh
                </v-btn>
              </template>
              <span>Pull latest values from the API</span>
            </v-tooltip>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="6"
            lg="3"
            xl="3"
            xxl="3">
            <v-tooltip
              open-delay="2000"
              location="bottom"
              :disabled="!selectedApp.isEditing || isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text="true"
                  v-bind="props"
                  :disabled="!selectedApp.isEditing"
                  @click="cancelHandler($event)">
                  Cancel
                </v-btn>
              </template>
              <span>Cancel editing of your app</span>
            </v-tooltip>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            md="6"
            lg="3"
            xl="3"
            xxl="3">
            <v-tooltip
              open-delay="2000"
              location="bottom"
              :disabled="selectedApp.isEditing || selectedApp.id === 1 || isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="red darken-1"
                  text="true"
                  v-bind="props"
                  :disabled="selectedApp.isEditing || selectedApp.id === 1"
                  @click="confirmDeleteHandler">
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
</template>

<script setup lang="ts">
  /* eslint-disable no-undef */
  /* eslint-disable no-unused-vars */
  /* eslint-disable @typescript-eslint/no-unused-vars*/
  /* eslint-disable @typescript-eslint/no-explicit-any*/
  import {
    type ComputedRef,
    computed,
    type Ref,
    ref,
    watch,
    onMounted,
    onUpdated,
    onUnmounted,
  } from 'vue';
  import { VForm } from 'vuetify/components';
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';
  import { storeToRefs } from 'pinia';
  import { useAppStore } from '@/stores/appStore';
  import { useDialogStore } from '@/stores/dialogStore';
  import { useValueStore } from '@/stores/valueStore';
  import AvailableActions from '@/components/buttons/AvailableActions.vue';
  import { DropdownItem } from '@/models/infrastructure/dropdownItem';
  import { App } from '@/models/domain/app';
  import { DialogType } from '@/enums/dialogType';
  import { ReleaseEnvironment } from '@/enums/releaseEnvironment';
  import { TimeFrame } from '@/enums/timeFrame';
  import commonUtilities from '@/utilities/common';
  import rules from '@/utilities/rules/index';

  const { requiredRules, urlRules } = rules();
  const { isChrome, updateAppProcessingAsync, repairAutoComplete, resetViewPort } =
    commonUtilities();

  const props = defineProps({
    formStatus: {
      type: Boolean,
      default: true,
    },
  });

  //#region Destructure Stores
  //#region AppStore
  const appStore = useAppStore();
  const { getSelectedApp } = storeToRefs(appStore);
  //#endregion
  //#region DialogStore
  const dialogStore = useDialogStore();
  const { updateDialog } = dialogStore;
  //#endregion
  //#region ValueStore
  const valueStore = useValueStore();
  const { getReleaseEnvironments, getTimeFrames } = storeToRefs(valueStore);
  //#endregion
  //#endregion

  //#region Properties
  const selectedApp: Ref<App> = ref(getSelectedApp.value ? getSelectedApp.value : new App());
  const name: Ref<string | null> = ref(getSelectedApp.value ? getSelectedApp.value.name : null);
  const localUrl: Ref<string | null> = ref(
    getSelectedApp.value ? getSelectedApp.value.localUrl : null,
  );
  const qaUrl: Ref<string | null> = ref(getSelectedApp.value ? getSelectedApp.value.qaUrl : null);
  const stagingUrl: Ref<string | null> = ref(
    getSelectedApp.value ? getSelectedApp.value.stagingUrl : null,
  );
  const prodUrl: Ref<string | null> = ref(
    getSelectedApp.value ? getSelectedApp.value.prodUrl : null,
  );
  const sourceCodeUrl: Ref<string | null> = ref(
    getSelectedApp.value ? getSelectedApp.value.sourceCodeUrl : null,
  );
  const releaseEnvironments: Ref<DropdownItem[]> = ref(getReleaseEnvironments.value);
  const selectedReleaseEnvironment: Ref<ReleaseEnvironment> = ref(
    getSelectedApp.value ? getSelectedApp.value.environment : ReleaseEnvironment.LOCAL,
  );
  const confirmEmailAction: Ref<string | null> = ref(
    getSelectedApp.value ? getSelectedApp.value.customEmailConfirmationAction : null,
  );
  const resetPasswordAction: Ref<string | null> = ref(
    getSelectedApp.value ? getSelectedApp.value.customPasswordResetAction : null,
  );
  const accessDuration: ComputedRef<string> = computed(() => {
    if (getSelectedApp.value?.timeFrame === TimeFrame.SECONDS) {
      const seconds = getSelectedApp.value.accessDuration === 1 ? 'second' : 'seconds';
      return `${getSelectedApp.value.accessDuration} ${seconds}`;
    } else if (getSelectedApp.value?.timeFrame === TimeFrame.MINUTES) {
      const minutes = getSelectedApp.value.accessDuration === 1 ? 'minute' : 'minutes';
      return `${getSelectedApp.value.accessDuration} ${minutes}`;
    } else if (getSelectedApp.value?.timeFrame === TimeFrame.HOURS) {
      const hours = getSelectedApp.value.accessDuration === 1 ? 'hour' : 'hours';
      return `${getSelectedApp.value.accessDuration} ${hours}`;
    } else if (getSelectedApp.value?.timeFrame === TimeFrame.DAYS) {
      const days = getSelectedApp.value.accessDuration === 1 ? 'day' : 'days';
      return `${getSelectedApp.value.accessDuration} ${days}`;
    } else if (getSelectedApp.value?.timeFrame === TimeFrame.MONTHS) {
      const months = getSelectedApp.value.accessDuration === 1 ? 'month' : 'months';
      return `${getSelectedApp.value.accessDuration} ${months}`;
    } else if (getSelectedApp.value?.timeFrame === TimeFrame.YEARS) {
      const years = getSelectedApp.value.accessDuration === 1 ? 'year' : 'years';
      return `${getSelectedApp.value.accessDuration} ${years}`;
    } else {
      return '';
    }
  });
  const timeFrames: Ref<DropdownItem[]> = ref(getTimeFrames.value);
  const selectedTimeFrame: Ref<TimeFrame> = ref(
    getSelectedApp.value ? getSelectedApp.value.timeFrame : TimeFrame.MINUTES,
  );
  const accessDurationMagnitude: Ref<number> = ref(
    getSelectedApp.value ? getSelectedApp.value.accessDuration : 0,
  );
  const formattedDateCreated: ComputedRef<string | null> = computed(() => {
    if (selectedApp.value.dateCreated === undefined) {
      return null;
    } else {
      return `${new Date(selectedApp.value.dateCreated).toLocaleDateString()} ${new Date(
        selectedApp.value.dateCreated,
      ).toLocaleTimeString()}`;
    }
  });
  const formattedDateUpdated: ComputedRef<string | null> = computed(() => {
    if (selectedApp.value.dateUpdated === undefined) {
      return null;
    } else {
      if (
        `${new Date(selectedApp.value.dateUpdated).toLocaleDateString()} ${new Date(
          selectedApp.value.dateUpdated,
        ).toLocaleTimeString()}` === '1/1/1 12:00:00 AM'
      ) {
        return null;
      } else {
        return `${new Date(selectedApp.value.dateUpdated).toLocaleDateString()} ${new Date(
          selectedApp.value.dateUpdated,
        ).toLocaleTimeString()}`;
      }
    }
  });
  const submitText: ComputedRef<string> = computed(() => {
    if (!selectedApp.value.isEditing) {
      return 'Edit';
    } else {
      return 'Submit';
    }
  });
  const submitHelperText: ComputedRef<string> = computed(() => {
    if (!selectedApp.value.isEditing) {
      return 'Edit your App';
    } else {
      return 'Submit your changes';
    }
  });
  const SMTPServerName: ComputedRef<string | null> = computed(() =>
    selectedApp.value.smtpServerSettings ? selectedApp.value.smtpServerSettings.smtpServer : null,
  );
  const SMTPServerPort: ComputedRef<number> = computed(() =>
    selectedApp.value.smtpServerSettings ? selectedApp.value.smtpServerSettings.port : 0,
  );
  const SMTPServerUserName: ComputedRef<string | null> = computed(() =>
    selectedApp.value.smtpServerSettings ? selectedApp.value.smtpServerSettings.userName : null,
  );
  const SMTPServerPassword: ComputedRef<string | null> = computed(() =>
    selectedApp.value.smtpServerSettings ? selectedApp.value.smtpServerSettings.password : null,
  );
  const SMTPServerEmail: ComputedRef<string | null> = computed(() =>
    selectedApp.value.smtpServerSettings ? selectedApp.value.smtpServerSettings.fromEmail : null,
  );

  watch(
    () => getSelectedApp.value,
    (newValue, oldValue) => {
      selectedApp.value = newValue ? newValue : new App();
      name.value = newValue ? newValue.name : null;
      localUrl.value = newValue ? newValue.localUrl : null;
      qaUrl.value = newValue ? newValue.qaUrl : null;
      stagingUrl.value = newValue ? newValue.stagingUrl : null;
      prodUrl.value = newValue ? newValue.prodUrl : null;
      sourceCodeUrl.value = newValue ? newValue.sourceCodeUrl : null;
      selectedReleaseEnvironment.value = newValue ? newValue.environment : ReleaseEnvironment.LOCAL;
      confirmEmailAction.value = newValue ? newValue.customEmailConfirmationAction : null;
      resetPasswordAction.value = newValue ? newValue.customPasswordResetAction : null;
    },
    {
      immediate: true,
      deep: true,
    },
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
      selectedApp.value = getSelectedApp.value ? getSelectedApp.value : new App();
      name.value = getSelectedApp.value ? getSelectedApp.value.name : null;
      localUrl.value = getSelectedApp.value ? getSelectedApp.value.localUrl : null;
      qaUrl.value = getSelectedApp.value ? getSelectedApp.value.qaUrl : null;
      stagingUrl.value = getSelectedApp.value ? getSelectedApp.value.stagingUrl : null;
      prodUrl.value = getSelectedApp.value ? getSelectedApp.value.prodUrl : null;
      sourceCodeUrl.value = getSelectedApp.value ? getSelectedApp.value.sourceCodeUrl : null;
      selectedReleaseEnvironment.value = getSelectedApp.value
        ? getSelectedApp.value.environment
        : ReleaseEnvironment.LOCAL;
      confirmEmailAction.value = getSelectedApp.value
        ? getSelectedApp.value.customEmailConfirmationAction
        : null;
      resetPasswordAction.value = getSelectedApp.value
        ? getSelectedApp.value.customPasswordResetAction
        : null;
      selectedApp.value.isEditing = false;
    });
  };
  const copyLicenseToClipboardHandler = async (): Promise<void> => {
    try {
      if (selectedApp.value?.license !== null && selectedApp.value?.license !== undefined) {
        await navigator.clipboard.writeText(selectedApp.value.license);
      }
      toast('Copied license to clipboard', {
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
  };
  //#endregion

  //#region Confirm dialog logic
  const isSmallViewPort: Ref<boolean> = ref(true);
  const confirmEditHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    updateDialog(
      'Confirm Edit',
      'Are you sure you want to submit these edits for this app?',
      DialogType.CONFIRM,
      editHandlerAync,
    );
  };
  const editHandlerAync = async (event: Event | null = null): Promise<void> => {
    event?.preventDefault();
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve(() => {
          console.debug('Edit logic will go here...');
          selectedApp.value.isEditing = false;
        });
      }, 1000);
    });
    await promise;
  };
  const confirmRefreshHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    updateDialog(
      'Confirm Refresh',
      'Are you sure you want to refresh this app?',
      DialogType.CONFIRM,
      () => {
        console.debug('Refresh logic will go here...');
      },
    );
  };
  const confirmDeleteHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    updateDialog(
      'Confirm Delete',
      'Are you sure you want to delete this app?',
      DialogType.CONFIRM,
      () => {
        console.debug('Delete logic will go here...');
      },
    );
  };
  //#endregion

  //#region Lifecycle Hooks
  onMounted(() => {
    if (isChrome.value) {
      repairAutoComplete();
    }
    resetViewPort(isSmallViewPort);
    let resizeTimeout: number | undefined;
    window.addEventListener(
      'resize',
      () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(
          () => {
            resetViewPort(isSmallViewPort);
          },
          250,
          'Resized',
        );
      },
      { once: true },
    );
    window.addEventListener(
      'keyup',
      async (event) => {
        if (event.key === 'Enter' && getFormStatus.value) {
          await editHandlerAync();
        }
      },
      { once: true },
    );
  });
  onUpdated(() => {
    if (isChrome.value) {
      repairAutoComplete();
    }
  });
  onUnmounted(() => {
    window.removeEventListener('resize', () => {
      resetViewPort(isSmallViewPort);
    });
    window.removeEventListener('keyup', () => {});
  });
  //#endregion
</script>
