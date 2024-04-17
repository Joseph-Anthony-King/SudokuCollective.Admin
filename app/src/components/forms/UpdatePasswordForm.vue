<template>
  <v-card>
    <v-card-title class="justify-center text-center">
      <span class="headline">Update Password</span>
    </v-card-title>
    <v-form v-model="formValid" ref="form" onsubmit="event.preventDefault();">
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-tooltip
                open-delay="2000"
                location="bottom"
                :disabled="password !== null || isSmallViewPort"
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="password"
                    label="Password"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-icon="mdi-account-key"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    autocomplete="new-password"
                    :rules="passwordRules()"
                    required
                    color="primary"
                    v-bind="props"
                  ></v-text-field>
                </template>
                <span>{{ RulesMessages.passwordRegexMessage }}</span>
              </v-tooltip>
            </v-col>
            <v-col cols="12">
              <v-tooltip
                open-delay="2000"
                location="bottom"
                :disabled="confirmPassword !== null || isSmallViewPort"
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-model="confirmPassword"
                    label="Confirm Password"
                    :type="showPassword ? 'text' : 'password'"
                    prepend-icon="mdi-account-key"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    autocomplete="new-password"
                    :rules="confirmPasswordRules(password)"
                    required
                    color="primary"
                    v-bind="props"
                  ></v-text-field>
                </template>
                <span>{{ RulesMessages.passwordMatchMesssage }}</span>
              </v-tooltip>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <AvailableActions>
        <v-row dense>
          <v-col cols="4">
            <v-tooltip open-delay="2000" location="bottom" :disabled="isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text="true"
                  @click="confirmFormReset = true"
                  v-bind="props"
                >
                  Reset
                </v-btn>
              </template>
              <span>Reset the update password form</span>
            </v-tooltip>
          </v-col>
          <v-col cols="4">
            <v-tooltip open-delay="2000" location="bottom" :disabled="isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text="true"
                  @click="closeHandlerAsync($event)"
                  v-bind="props"
                >
                  Close
                </v-btn>
              </template>
              <span>Close the update password form</span>
            </v-tooltip>
          </v-col>
          <v-col cols="4">
            <v-tooltip
              open-delay="2000"
              location="bottom"
              :disabled="!formValid || isSmallViewPort"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  color="blue darken-1"
                  text="true"
                  @click="submitHandlerAsync($event)"
                  :disabled="!formValid"
                  v-bind="props"
                >
                  Submit
                </v-btn>
              </template>
              <span>Submit your updated password</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </AvailableActions>
    </v-form>
  </v-card>
  <v-dialog
    v-model="confirmFormReset"
    persistent
    :fullscreen="isSmallViewPort"
    :max-width="maxDialogWidth"
    hide-overlay
    transition="dialog-top-transition"
  >
    <ConfirmDialog
      title="Reset Form"
      message="Are you sure you want to reset this form?"
      v-on:action-confirmed="resetHandlerAsync"
      v-on:action-not-confirmed="confirmFormReset = false"
    />
  </v-dialog>
</template>

<script setup lang="ts">
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars*/
import { type ComputedRef, computed, type Ref, ref, toRaw } from 'vue';
import { VForm, VTextField } from 'vuetify/components';
import { toast } from 'vue3-toastify';
import router from '@/router/index';
import { useSignUpFormStore } from '@/stores/formStores/signUpFormStore';
import { useUserStore } from '@/stores/userStore';
import AvailableActions from '@/components/buttons/AvailableActions.vue';
import { StoreType } from '@/enums/storeTypes';
import { ResetPasswordRequestData } from '@/models/requests/resetPasswordRequestData';
import rules from '@/utilities/rules/index';
import { RulesMessages } from '@/utilities/rules/rulesMessages';
import commonUtilities from '@/utilities/common';

const props = defineProps({
  formStatus: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['close-update-password']);

const { displayFailedToastAsync, displaySuccessfulToast, updateAppProcessingAsync } =
  commonUtilities();
const { confirmPasswordRules, passwordRules } = rules();

//#region Instantiate the Stores
const signUpFormStore = useSignUpFormStore();
const userStore = useUserStore();
//#endregion

//#region Properties
const password: Ref<string | null> = ref(signUpFormStore.getPassword);
const confirmPassword: Ref<string | null> = ref(signUpFormStore.getConfirmPassword);
const token: string = signUpFormStore.getPasswordToken ? signUpFormStore.getPasswordToken : '';
const showPassword: Ref<boolean> = ref(false);
const confirmFormReset: Ref<boolean> = ref(false);
//#endregion

//#region Form Logic
const form: Ref<VForm | null> = ref(null);
const formValid: Ref<boolean> = ref(true);
const isSmallViewPort: Ref<boolean> = ref(true);
const maxDialogWidth: Ref<string> = ref('auto');
const getFormStatus: ComputedRef<boolean> = computed(() => {
  return props.formStatus;
});
const resetFormStatus: ComputedRef<boolean> = computed(() => {
  return !props.formStatus;
});
//#endregion

//#region Action Handlers
const submitHandlerAsync = async (event: Event | null = null): Promise<void> => {
  event?.preventDefault();
  await updateAppProcessingAsync(async () => {
    if (getFormStatus.value) {
      signUpFormStore.updatePassword(toRaw(password.value));
      signUpFormStore.updateConfirmPassword(toRaw(confirmPassword.value));

      const data = new ResetPasswordRequestData(token, password.value ? password.value : '');
      const result = await userStore.resetPasswordAsync(data);
      if (result) {
        signUpFormStore.initializeStore();
        displaySuccessfulToast(StoreType.USERSTORE);
        if (userStore.getUserIsLoggedIn) {
          await userStore.getUserAsync();
          userStore.updateServiceMessage();
          router.push('/user-profile');
        } else {
          router.push('/');
        }
      } else {
        displayFailedToastAsync(undefined, undefined);
      }
    } else {
      toast('Reset password form is invalid', {
        position: toast.POSITION.TOP_CENTER,
        type: toast.TYPE.ERROR,
      });
    }
  });
};
const resetHandlerAsync = async (event: Event | null = null): Promise<void> => {
  event?.preventDefault();
  await updateAppProcessingAsync(() => {
    password.value = signUpFormStore.getPassword;
    confirmPassword.value = signUpFormStore.getConfirmPassword;
    form.value?.reset();
    confirmFormReset.value = false;
  });
};
const closeHandlerAsync = async (event: Event | null = null): Promise<void> => {
  event?.preventDefault();
  await updateAppProcessingAsync(() => {
    signUpFormStore.initializeStore();
    emit('close-update-password', null, null);
  });
};
//#endregion
</script>
