<template>
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
          v-model="user.id"
          type="number"
          label="Id"
          prepend-icon="mdi-account-circle"
          :readonly="!user.isEditing"
          :disabled="user.isEditing"></v-text-field>
        <v-tooltip
          open-delay="2000"
          location="bottom"
          :disabled="!user.isEditing || userName !== null || isSmallViewPort">
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="userName"
              label="User Name"
              prepend-icon="mdi-account-circle"
              :rules="userNameRules(invalidUserNames, 'User name not unique')"
              :readonly="!user.isEditing"
              :color="!user.isEditing ? '' : 'primary'"
              v-bind="props"></v-text-field>
          </template>
          <span>{{ RulesMessages.userNameRegexMessage }}</span>
        </v-tooltip>
        <v-tooltip
          open-delay="2000"
          location="bottom"
          :disabled="!user.isEditing || firstName !== null || isSmallViewPort">
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="firstName"
              label="First Name"
              prepend-icon="mdi-account-circle"
              :rule="requiredRules('First Name')"
              :readonly="!user.isEditing"
              :color="!user.isEditing ? '' : 'primary'"
              v-bind="props"></v-text-field>
          </template>
          <span>{{ firstNameTooltip }}</span>
        </v-tooltip>
        <v-tooltip
          open-delay="2000"
          location="bottom"
          :disabled="!user.isEditing || lastName !== null || isSmallViewPort">
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="lastName"
              label="Last Name"
              prepend-icon="mdi-account-circle"
              :rules="requiredRules('Last Name')"
              :readonly="!user.isEditing"
              :color="!user.isEditing ? '' : 'primary'"
              v-bind="props"></v-text-field>
          </template>
          <span>{{ lastNameTooltip }}</span>
        </v-tooltip>
        <v-text-field
          v-model="nickName"
          label="Nickname (not required)"
          prepend-icon="mdi-account-circle"
          :readonly="!user.isEditing"
          :color="!user.isEditing ? '' : 'primary'"></v-text-field>
        <v-checkbox
          v-model="user.isAdmin"
          label="Admin Privileges"
          :readonly="!user.isEditing"
          :disabled="user.isEditing"
          color="primary"></v-checkbox>
        <v-checkbox
          v-if="user.isSuperUser"
          v-model="user.isSuperUser"
          label="Super User Privileges"
          :readonly="!user.isEditing"
          :disabled="user.isEditing"
          color="primary"></v-checkbox>
      </v-col>
      <v-col
        cols="12"
        lg="6"
        xl="6">
        <v-text-field
          v-model="formattedDateCreated"
          label="Date Created"
          hint="MM/DD/YYYY format"
          persistent-hint
          prepend-icon="mdi-calendar"
          :readonly="!user.isEditing"
          :disabled="user.isEditing"></v-text-field>
        <v-text-field
          v-model="formattedDateUpdated"
          label="Date Updated"
          hint="MM/DD/YYYY format"
          persistent-hint
          prepend-icon="mdi-calendar"
          :readonly="!user.isEditing"
          :disabled="user.isEditing"></v-text-field>
        <v-tooltip
          open-delay="2000"
          location="bottom"
          :disabled="!user.isEditing || email !== null || isSmallViewPort">
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="email"
              label="Email"
              prepend-icon="mdi-email"
              :rules="emailRules(invalidEmails, 'Email not unique')"
              :readonly="!user.isEditing"
              :color="!user.isEditing ? '' : 'primary'"
              v-bind="props"></v-text-field>
          </template>
          <span>{{ RulesMessages.emailInvalidMessage }}</span>
        </v-tooltip>
        <v-checkbox
          v-model="user.isEmailConfirmed"
          label="Email Confirmed"
          :readonly="!user.isEditing"
          :disabled="user.isEditing"
          color="primary"></v-checkbox>
        <v-checkbox
          v-model="user.receivedRequestToUpdateEmail"
          label="Received Request to Update Email"
          :readonly="!user.isEditing"
          :disabled="user.isEditing"
          color="primary"></v-checkbox>
        <v-checkbox
          v-model="user.receivedRequestToUpdatePassword"
          label="Received Request to Reset Password"
          :readonly="!user.isEditing"
          :disabled="user.isEditing"
          color="primary"></v-checkbox>
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
                :disabled="!formValid"
                @click.prevent="
                  user.isEditing === false ? (user.isEditing = true) : confirmEditHandler($event)
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
            :disabled="user.isEditing || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-btn
                color="blue darken-1"
                text="true"
                v-bind="props"
                :disabled="user.isEditing"
                @click="confirmRefreshHandler($event)">
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
            :disabled="!user.isEditing || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-btn
                color="blue darken-1"
                text="true"
                v-bind="props"
                :disabled="!user.isEditing"
                @click="cancelHandler($event)">
                Cancel
              </v-btn>
            </template>
            <span>Cancel editing of your profile </span>
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
            :disabled="user.isEditing || user.isSuperUser || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-btn
                color="red darken-1"
                text="true"
                v-bind="props"
                :disabled="user.isEditing || user.isSuperUser"
                @click="confirmDeleteHandler($event)">
                Delete
              </v-btn>
            </template>
            <span>Delete your profile</span>
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
            :disabled="user.isEditing || !user.receivedRequestToUpdateEmail">
            <template v-slot:activator="{ props }">
              <v-btn
                color="blue darken-1"
                text="true"
                v-bind="props"
                :disabled="user.isEditing || !user.receivedRequestToUpdateEmail"
                @click="confirmResendEmailConfirmationHandler($event)">
                Resend Email Confirmation
              </v-btn>
            </template>
            <span>Resend the last email confirmation you requested</span>
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
            :disabled="user.isEditing || !user.receivedRequestToUpdateEmail || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-btn
                color="blue darken-1"
                text="true"
                v-bind="props"
                :disabled="user.isEditing || !user.receivedRequestToUpdateEmail"
                @click="confirmCancelEmailConfirmationHandler($event)">
                Cancel Email Confirmation
              </v-btn>
            </template>
            <span>Cancel the last email confirmation you requested</span>
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
            :disabled="
              user.isEditing ||
              user.isEmailConfirmed ||
              user.receivedRequestToUpdatePassword ||
              isSmallViewPort
            ">
            <template v-slot:activator="{ props }">
              <v-btn
                color="blue darken-1"
                text="true"
                v-bind="props"
                :disabled="
                  user.isEditing || !user.isEmailConfirmed || user.receivedRequestToUpdatePassword
                "
                @click="confirmPasswordResetHandler($event)">
                Password Reset
              </v-btn>
            </template>
            <span>Reset your password</span>
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
            :disabled="user.isEditing || !user.receivedRequestToUpdatePassword || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-btn
                color="blue darken-1"
                text="true"
                v-bind="props"
                :disabled="user.isEditing || !user.receivedRequestToUpdatePassword"
                @click="confirmResendPasswordResetHandler($event)">
                Resend Password Reset
              </v-btn>
            </template>
            <span>Resend your outstanding password reset email</span>
          </v-tooltip>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="6"
          lg="3"
          xl="6"
          xxl="6">
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="user.isEditing || !user.receivedRequestToUpdatePassword || isSmallViewPort">
            <template v-slot:activator="{ props }">
              <v-btn
                color="blue darken-1"
                text="true"
                v-bind="props"
                :disabled="user.isEditing || !user.receivedRequestToUpdatePassword"
                @click="confirmCancelPasswordResetHandler($event)">
                Cancel Password Reset
              </v-btn>
            </template>
            <span>Cancel your password reset request</span>
          </v-tooltip>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="6"
          lg="3"
          xl="6"
          xxl="6">
          <v-tooltip
            open-delay="2000"
            location="bottom"
            :disabled="
              user.isEditing ||
              !user.receivedRequestToUpdateEmail ||
              !user.receivedRequestToUpdatePassword ||
              isSmallViewPort
            ">
            <template v-slot:activator="{ props }">
              <v-btn
                color="blue darken-1"
                text="true"
                v-bind="props"
                :disabled="
                  user.isEditing ||
                  !user.receivedRequestToUpdateEmail ||
                  !user.receivedRequestToUpdatePassword
                "
                @click="confirmCancelAllRequestsResetHandler($event)">
                Cancel All Email Requests
              </v-btn>
            </template>
            <span>Cancel your outstanding email confirmation and password reset requests</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </AvailableActions>
  </v-form>
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
    onUnmounted,
    toRaw,
  } from 'vue';
  import { VForm } from 'vuetify/components';
  import 'vue3-toastify/dist/index.css';
  import { storeToRefs } from 'pinia';
  import { useDialogStore } from '@/stores/dialogStore';
  import { useUserStore } from '@/stores/userStore';
  import { UpdateUserRequestData } from '@/models/requests/updateUserRequestData';
  import { User } from '@/models/domain/user';
  import AvailableActions from '@/components/buttons/AvailableActions.vue';
  import { StoreType } from '@/enums/storeTypes';
  import { DialogType } from '@/enums/dialogType';
  import commonUtilities from '@/utilities/common';
  import rules from '@/utilities/rules/index';
  import { RulesMessages } from '@/utilities/rules/rulesMessages';

  const props = defineProps({
    formStatus: {
      type: Boolean,
      default: true,
    },
  });
  const emit = defineEmits(['user-updated']);

  const { emailRules, requiredRules, userNameRules } = rules();
  const {
    displaySuccessfulToast,
    displayFailedToastAsync,
    resetViewPort,
    updateAppProcessingAsync,
  } = commonUtilities();

  //#region Destructure Stores
  //#region DialogStore
  const dialogStore = useDialogStore();
  const { updateDialog } = dialogStore;
  //#endregion
  const userStore = useUserStore();
  const { getUser } = storeToRefs(userStore);
  const {
    cancelAllEmailRequestsAsync,
    cancelEmailConfirmationRequestAsync,
    cancelPasswordResetAsync,
    deleteUserAsync,
    getUserAsync,
    updateUserAsync,
    requestPasswordResetAsync,
    resendEmailConfirmationRequestAsync,
    resendPasswordResetAsync,
  } = userStore;
  //#endregion

  //#region Properties
  const user: Ref<User> = ref(getUser.value);
  const userName: Ref<string | undefined> = ref(user.value.userName);
  const firstName: Ref<string | undefined> = ref(user.value.firstName);
  const lastName: Ref<string | undefined> = ref(user.value.lastName);
  const nickName: Ref<string | undefined> = ref(user.value.nickName);
  const email: Ref<string | undefined> = ref(user.value.email);
  const invalidUserNames: Ref<string[]> = ref([]);
  const invalidEmails: Ref<string[]> = ref([]);
  const firstNameTooltip: ComputedRef<string> = computed(() =>
    RulesMessages.requiredMessage.replace('{{value}}', 'First Name'),
  );
  const lastNameTooltip: ComputedRef<string> = computed(() =>
    RulesMessages.requiredMessage.replace('{{value}}', 'Last Name'),
  );
  //#endregion

  //#region Form Logic
  const form: Ref<VForm | null> = ref(null);
  const formValid: Ref<boolean> = ref(false);
  const formTitle: Ref<string> = ref('User Profile');
  const getFormStatus: ComputedRef<boolean> = computed(() => {
    return props.formStatus;
  });
  const resetFormStatus: ComputedRef<boolean> = computed(() => {
    return !props.formStatus;
  });
  const formattedDateCreated: ComputedRef<string | null> = computed(() => {
    if (user.value.dateCreated === undefined) {
      return null;
    } else {
      return `${new Date(user.value.dateCreated).toLocaleDateString()} ${new Date(
        user.value.dateCreated,
      ).toLocaleTimeString()}`;
    }
  });
  const formattedDateUpdated: ComputedRef<string | null> = computed(() => {
    if (user.value.dateUpdated === undefined) {
      return null;
    } else {
      if (
        `${new Date(user.value.dateUpdated).toLocaleDateString()} ${new Date(
          user.value.dateUpdated,
        ).toLocaleTimeString()}` === '1/1/1 12:00:00 AM'
      ) {
        return null;
      } else {
        return `${new Date(user.value.dateUpdated).toLocaleDateString()} ${new Date(
          user.value.dateUpdated,
        ).toLocaleTimeString()}`;
      }
    }
  });
  const submitText: ComputedRef<string> = computed(() => {
    if (!user.value.isEditing) {
      return 'Edit';
    } else {
      return 'Submit';
    }
  });
  const submitHelperText: ComputedRef<string> = computed(() => {
    if (!user.value.isEditing) {
      return 'Edit your profile';
    } else {
      return 'Submit your changes';
    }
  });
  watch(
    () => user.value.isEditing,
    (newValue, oldValue) => {
      if (newValue) {
        formTitle.value = 'Edit User Profile';
      } else {
        formTitle.value = 'User Profile';
      }
    },
    {
      immediate: true,
      deep: true,
    },
  );
  //#endregion

  //#region Confirm dialog logic
  const isSmallViewPort: Ref<boolean> = ref(true);
  const confirmEditHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    let message = null;
    if (user.value.email === email.value) {
      message = `Are you sure you want to submit your edits ${user.value.userName}?`;
    } else {
      message = `Are you sure you want to submit your edits ${user.value.userName}?  Please be advised that your update to your email will require you to confirm ownership of the old and new email addresses by responding to confirmation emails sent to each address by <span class="primary-color">sudokucollective@gmail.com</span>.<br /><br />Please do not respond to <span class="primary-color">sudokucollective@gmail.com</span> as this email is not monitored.  If you cannot find the email from <span class="primary-color">sudokucollective@gmail.com</span> please review your spam folder and you can always request another copy if you cannot find the original.<br /><br />You will have 24 hours to complete the process or your email will retain it's original value.`;
    }
    updateDialog('Confirm Edit', message, DialogType.CONFIRM, async () => {
      await updateAppProcessingAsync(async () => {
        await editHandlerAsync();
      });
    });
  };
  const confirmRefreshHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    updateDialog(
      'Confirm Refresh',
      `Are you sure you want to refresh your profile ${user.value.userName}?`,
      DialogType.CONFIRM,
      async () => {
        await updateAppProcessingAsync(async () => {
          await refreshHandlerAsync();
        });
      },
    );
  };
  const confirmDeleteHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    updateDialog(
      'Confirm Delete',
      `Are you sure you want to delete your profile ${user.value.userName}?  This action cannot be reversed and will delete all apps and games associated with your profile.`,
      DialogType.CONFIRM,
      async () => {
        await updateAppProcessingAsync(async () => {
          await deleteHandlerAsync();
        });
      },
    );
  };
  const confirmResendEmailConfirmationHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    updateDialog(
      'Confirm Email Confirmation Resend',
      `Are you sure you want to resend your outstanding email confirmation from <span class="primary-color">sudokucollective@gmail.com</span> ${user.value.userName}?`,
      DialogType.CONFIRM,
      async () => {
        await updateAppProcessingAsync(async () => {
          await resendEmailConfirmationHandlerAsync();
        });
      },
    );
  };
  const confirmCancelEmailConfirmationHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    updateDialog(
      'Confirm Cancel Email Confirmation',
      `Are you sure you want to cancel your outstanding email confirmation from <span class="primary-color">sudokucollective@gmail.com</span> ${user.value.userName}?  If your email has not been confirmed you will lose access to your profile if you forget your password.`,
      DialogType.CONFIRM,
      async () => {
        await updateAppProcessingAsync(async () => {
          await cancelEmailConfirmationHandlerAsync();
        });
      },
    );
  };
  const confirmPasswordResetHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    updateDialog(
      'Confirm Password Reset',
      `Are you sure you want to reset your password ${user.value.userName}?  Please be advised that in order to confirm your identity you will receive an email from <span class="primary-color">sudokucollective@gmail.com</span> at the address provided in your profile.  Please review the email from <span class="primary-color">sudokucollective@gmail.com</span> and follow the link contained therein to enter your new password.<br /><br />Please do not respond to <span class="primary-color">sudokucollective@gmail.com</span> as this email is not monitored.  If you cannot find the email from <span class="primary-color">sudokucollective@gmail.com</span> please review your spam folder and you can always request another copy if you cannot find the original.<br /><br />You will have 24 hours to complete the process or your password will retain it's original value.`,
      DialogType.CONFIRM,
      async () => {
        await updateAppProcessingAsync(async () => {
          await passwordResetHandlerAsync();
        });
      },
    );
  };
  const confirmResendPasswordResetHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    updateDialog(
      'Confirm Resend Password Reset',
      `Are you sure you want to resend your password reset request ${user.value.userName}?`,
      DialogType.CONFIRM,
      async () => {
        await updateAppProcessingAsync(async () => {
          await resendPasswordResetHandlerAsync();
        });
      },
    );
  };
  const confirmCancelPasswordResetHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    updateDialog(
      'Confirm Cancel Password Reset',
      `Are you sure you want to cancel your password reset request ${user.value.userName}?`,
      DialogType.CONFIRM,
      async () => {
        await updateAppProcessingAsync(async () => {
          await cancelPasswordResetHandlerAsync();
        });
      },
    );
  };
  const confirmCancelAllRequestsResetHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    updateDialog(
      'Confirm Cancel Email Confirmation & Password Reset',
      `Are you sure you want to cancel your outstanding email confirmation and password reset requests ${user.value.userName}?`,
      DialogType.CONFIRM,
      async () => {
        await updateAppProcessingAsync(async () => {
          await cancelAllRequestsHandlerAsync();
        });
      },
    );
  };
  const updateInvalidValues = (message: string, options: any): any => {
    if (
      message === 'Status Code 404: User name not unique' &&
      !options.invalidUserNames.includes(options.userName as string)
    ) {
      options.invalidUserNames.push(options.userName as string);
    }
    if (
      message === 'Status Code 404: Email not unique' &&
      !options.invalidEmails.includes(options.email as string)
    ) {
      options.invalidEmails.push(options.email as string);
    }
    return {
      invalidUserNames: options.invalidUserNames,
      invalidEmails: options.invalidEmails,
    };
  };
  //#endregion

  //#region Action Handlers
  const editHandlerAsync = async (event: Event | null = null): Promise<boolean> => {
    event?.preventDefault();
    return (await updateAppProcessingAsync(async () => {
      let result = false;
      if (getFormStatus.value) {
        const data = new UpdateUserRequestData(
          userName.value,
          firstName.value,
          lastName.value,
          nickName.value,
          email.value,
        );
        result = await updateUserAsync(data);
      }
      if (result) {
        displaySuccessfulToast(StoreType.USERSTORE);
      } else {
        const failedToast = await displayFailedToastAsync(updateInvalidValues, {
          invalidUserNames: toRaw(invalidUserNames.value),
          invalidEmails: toRaw(invalidUserNames.value),
          userName: toRaw(userName.value),
          email: toRaw(email.value),
        });
        if (failedToast.failed) {
          invalidUserNames.value = failedToast.methodResult.invalidUserNames;
          invalidEmails.value = failedToast.methodResult.invalidEmails;
          form.value?.validate();
        }
      }
      return result;
    })) as Promise<boolean>;
  };
  const refreshHandlerAsync = async (event: Event | null = null): Promise<boolean> => {
    event?.preventDefault();
    return (await updateAppProcessingAsync(async () => {
      const result = await getUserAsync();
      displaySuccessfulToast(StoreType.USERSTORE);
      const failedToast = await displayFailedToastAsync(updateInvalidValues, {
        invalidUserNames: toRaw(invalidUserNames.value),
        invalidEmails: toRaw(invalidUserNames.value),
        userName: toRaw(userName.value),
        email: toRaw(email.value),
      });
      if (failedToast.failed) {
        invalidUserNames.value = failedToast.methodResult.invalidUserNames;
        invalidEmails.value = failedToast.methodResult.invalidEmails;
        form.value?.validate();
      }
      return result;
    })) as Promise<boolean>;
  };
  const deleteHandlerAsync = async (event: Event | null = null): Promise<boolean> => {
    event?.preventDefault();
    return (await updateAppProcessingAsync(async () => {
      let result = false;
      if (getFormStatus.value) {
        result = await deleteUserAsync();
      }
      if (!result) {
        const failedToast = await displayFailedToastAsync(updateInvalidValues, {
          invalidUserNames: toRaw(invalidUserNames.value),
          invalidEmails: toRaw(invalidUserNames.value),
          userName: toRaw(userName.value),
          email: toRaw(email.value),
        });
        if (failedToast.failed) {
          invalidUserNames.value = failedToast.methodResult.invalidUserNames;
          invalidEmails.value = failedToast.methodResult.invalidEmails;
          form.value?.validate();
        }
      }
      return result;
    })) as Promise<boolean>;
  };
  const cancelHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    updateAppProcessingAsync(() => {
      user.value.isEditing = false;
      invalidUserNames.value = [];
      invalidEmails.value = [];
      form.value?.resetValidation();
      userName.value = user.value.userName;
      firstName.value = user.value.firstName;
      lastName.value = user.value.lastName;
      nickName.value = user.value.nickName;
      email.value = user.value.email;
      emit('user-updated', null);
    });
  };
  const resendEmailConfirmationHandlerAsync = async (
    event: Event | null = null,
  ): Promise<boolean> => {
    event?.preventDefault();
    return (await updateAppProcessingAsync(async () => {
      const result = await resendEmailConfirmationRequestAsync();
      if (result) {
        displaySuccessfulToast(StoreType.USERSTORE);
      } else {
        await displayFailedToastAsync(undefined, undefined);
      }
      return result;
    })) as Promise<boolean>;
  };
  const cancelEmailConfirmationHandlerAsync = async (
    event: Event | null = null,
  ): Promise<boolean> => {
    event?.preventDefault();
    return (await updateAppProcessingAsync(async () => {
      const result = await cancelEmailConfirmationRequestAsync();
      if (result) {
        displaySuccessfulToast(StoreType.USERSTORE);
      } else {
        await displayFailedToastAsync(undefined, undefined);
      }
      return result;
    })) as Promise<boolean>;
  };
  const passwordResetHandlerAsync = async (event: Event | null = null): Promise<boolean> => {
    event?.preventDefault();
    return (await updateAppProcessingAsync(async () => {
      let result = false;
      if (getFormStatus.value && email.value !== undefined) {
        result = await requestPasswordResetAsync(toRaw(email.value));
        if (result) {
          displaySuccessfulToast(StoreType.USERSTORE);
        } else {
          const failedToast = await displayFailedToastAsync(undefined, undefined);
          if (failedToast.failed) {
            form.value?.validate();
          }
        }
      }
      return result;
    })) as Promise<boolean>;
  };
  const resendPasswordResetHandlerAsync = async (event: Event | null = null): Promise<boolean> => {
    event?.preventDefault();
    return (await updateAppProcessingAsync(async () => {
      const result = await resendPasswordResetAsync();
      if (result) {
        displaySuccessfulToast(StoreType.USERSTORE);
      } else {
        await displayFailedToastAsync(undefined, undefined);
      }
      return result;
    })) as Promise<boolean>;
  };
  const cancelPasswordResetHandlerAsync = async (event: Event | null = null): Promise<boolean> => {
    event?.preventDefault();
    return (await updateAppProcessingAsync(async () => {
      const result = await cancelPasswordResetAsync();
      if (result) {
        displaySuccessfulToast(StoreType.USERSTORE);
      } else {
        await displayFailedToastAsync(undefined, undefined);
      }
      return result;
    })) as Promise<boolean>;
  };
  const cancelAllRequestsHandlerAsync = async (event: Event | null = null): Promise<boolean> => {
    event?.preventDefault();
    return (await updateAppProcessingAsync(async () => {
      const result = await cancelAllEmailRequestsAsync();
      if (result) {
        displaySuccessfulToast(StoreType.USERSTORE);
      } else {
        await displayFailedToastAsync(undefined, undefined);
      }
      return result;
    })) as Promise<boolean>;
  };
  //#endregion

  //#region Watches
  watch(
    () => getUser.value,
    (newValue, oldValue) => {
      user.value = newValue;
      userName.value = user.value.userName;
      firstName.value = user.value.firstName;
      lastName.value = user.value.lastName;
      nickName.value = user.value.nickName;
      email.value = user.value.email;
    },
    {
      immediate: true,
      deep: true,
    },
  );
  //#endregion

  //#region Lifecycle Hooks
  onMounted(async () => {
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
    if (getFormStatus.value) {
      window.addEventListener(
        'keyup',
        async (event) => {
          if (event.key === 'Enter' && getFormStatus.value) {
            await editHandlerAsync();
          }
        },
        { once: true },
      );
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
