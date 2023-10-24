<template>
  <v-card-title class='justify-center text-center'>
    <span class='headline'>{{ formTitle }}</span>
  </v-card-title>
  <v-form v-model='formValid' ref='form' onsubmit='event.preventDefault();'>
    <v-row>
      <v-col cols='12' lg='6' xl='6'>
        <v-text-field
          v-model='user.id'
          type='number'
          label='Id'
          prepend-icon='mdi-account-circle'
          :readonly='!user.isEditing'
          :disabled='user.isEditing'
        ></v-text-field>
        <v-tooltip open-delay="5000" location="bottom" :disabled="!user.isEditing">
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model='userName'
              label='User Name'
              prepend-icon='mdi-account-circle'
              :rules='userNameRules(invalidUserNames, "User name not unique")'
              :readonly='!user.isEditing'
              :color='!user.isEditing ? "" : "primary:"'
              v-bind="props"
            ></v-text-field>
          </template>
          <span>{{ RulesMessages.userNameRegexMessage }}</span>
        </v-tooltip>
        <v-tooltip open-delay="5000" location="bottom" :disabled="!user.isEditing">
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model='firstName'
              label='First Name'
              prepend-icon='mdi-account-circle'
              :rule='requiredRules("First Name")'
              :readonly='!user.isEditing'
              :color='!user.isEditing ? "" : "primary"'
              v-bind="props"
            ></v-text-field>
          </template>
          <span>{{ firstNameTooltip }}</span>
        </v-tooltip>
        <v-tooltip open-delay="5000" location="bottom" :disabled="!user.isEditing">
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model='lastName'
              label='Last Name'
              prepend-icon='mdi-account-circle'
              :rules='requiredRules("Last Name")'
              :readonly='!user.isEditing'
              :color='!user.isEditing ? "" : "primary"'
              v-bind="props"
            ></v-text-field>
          </template>
          <span>{{ lastNameTooltip }}</span>
        </v-tooltip>
        <v-text-field
          v-model='nickName'
          label='Nickname (not required)'
          prepend-icon='mdi-account-circle'
          :readonly='!user.isEditing'
          :color='!user.isEditing ? "" : "primary"'
        ></v-text-field>
        <v-checkbox
          v-model='user.isAdmin'
          label='Admin Privileges'
          :readonly='!user.isEditing'
          :disabled='user.isEditing'
          color='primary'
        ></v-checkbox>
        <v-checkbox
          v-if='user.isSuperUser'
          v-model='user.isSuperUser'
          label='Super User Privileges'
          :readonly='!user.isEditing'
          :disabled='user.isEditing'
          color='primary'
        ></v-checkbox>
      </v-col>
      <v-col cols='12' lg='6' xl='6'>
        <v-text-field
          v-model='formattedDateCreated'
          label='Date Created'
          hint='MM/DD/YYYY format'
          persistent-hint
          prepend-icon='mdi-calendar'
          :readonly='!user.isEditing'
          :disabled='user.isEditing'
        ></v-text-field>
        <v-text-field
          v-model='formattedDateUpdated'
          label='Date Updated'
          hint='MM/DD/YYYY format'
          persistent-hint
          prepend-icon='mdi-calendar'
          :readonly='!user.isEditing'
          :disabled='user.isEditing'
        ></v-text-field>
        <v-tooltip open-delay="5000" location="bottom" :disabled="!user.isEditing">
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model='email'
              label='Email'
              prepend-icon='mdi-email'
              :rules='emailRules(invalidEmails, "Email not unique")'
              :readonly='!user.isEditing'
              :color='!user.isEditing ? "" : "primary"'
              v-bind="props"
            ></v-text-field>
          </template>
          <span>{{ RulesMessages.emailInvalidMessage }}</span>
        </v-tooltip>
        <v-checkbox
          v-model='user.isEmailConfirmed'
          label='Email Confirmed'
          :readonly='!user.isEditing'
          :disabled='user.isEditing'
          color='primary'
        ></v-checkbox>
      </v-col>
    </v-row>
    <AvailableActions>
      <v-row dense>
        <v-col cols="12" sm="6" md="6" lg="3" xl="3" xxl="3">
          <v-tooltip open-delay="5000" location='bottom' :disabled='formValid'>
            <template v-slot:activator='{ props }'>
              <v-btn
                color='blue darken-1'
                text
                :disabled='formValid'
                v-bind='props'
                @click.prevent='user.isEditing === false ? user.isEditing = true : confirmEditSubmission = true'
              >
                {{ submitText }}
              </v-btn>
            </template>
            <span>{{ submitHelperText }}</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="3" xl="3" xxl="3">
          <v-tooltip open-delay="5000" location='bottom' :disabled='user.isEditing'>
            <template v-slot:activator='{ props }'>
              <v-btn
                color='blue darken-1'
                text
                @click='refreshHandlerAsync($event)'
                v-bind='props'
                :disabled='user.isEditing'
              >
                Refresh
              </v-btn>
            </template>
            <span>Pull latest values from the API</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="3" xl="3" xxl="3">
          <v-tooltip open-delay="5000" location='bottom' :disabled='user.isEditing'>
            <template v-slot:activator='{ props }'>
              <v-btn
                color='blue darken-1'
                text
                @click='cancelHandler($event)'
                v-bind='props'
                :disabled='!user.isEditing'
              >
                Cancel
              </v-btn>
            </template>
            <span>Cancel the edit</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="3" xl="3" xxl="3">
          <v-tooltip open-delay="5000" location='bottom' :disabled='user.isEditing || user.isSuperUser'>
            <template v-slot:activator='{ props }'>
              <v-btn
                color='red darken-1'
                text
                v-bind='props'
                :disabled='user.isEditing || user.isSuperUser'
                @click='confirmDeleteSubmission = true'
              >
                Delete
              </v-btn>
            </template>
            <span>Delete your profile</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="3" xl="3" xxl="3">
          <v-tooltip open-delay="5000" location='bottom' :disabled='user.isEditing || !user.receivedRequestToUpdateEmail'>
            <template v-slot:activator='{ props }'>
              <v-btn
                color='blue darken-1'
                text
                v-bind='props'
                :disabled='user.isEditing || !user.receivedRequestToUpdateEmail'
                @click='resendEmailConfirmationHandlerAsync'
              >
                Resend Email
              </v-btn>
            </template>
            <span>Resend the last email confirmation you requested</span>
          </v-tooltip>
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="3" xl="3" xxl="3">
          <v-tooltip open-delay="5000" location='bottom' :disabled='user.isEditing || !user.receivedRequestToUpdateEmail'>
            <template v-slot:activator='{ props }'>
              <v-btn
                color='blue darken-1'
                text
                v-bind='props'
                :disabled='user.isEditing || !user.receivedRequestToUpdateEmail'
                @click='cancelEmailConfirmationHandlerAsync'
              >
                Cancel Email
              </v-btn>
            </template>
            <span>Cancel the last email confirmation you requested</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </AvailableActions>
  </v-form>
  <v-dialog
    v-model='confirmDialog'
    persistent
    :fullscreen='isSmallViewPort'
    :max-width='maxDialogWidth'
    hide-overlay
    transition='dialog-top-transition'>
    <ConfirmDialog 
      :title='confirmTitle'
      :message='confirmMessage'
      v-on:action-confirmed='actionConfirmedHandlerAsync'
      v-on:action-not-confirmed='actionNotConfirmedHandler'/>
  </v-dialog>
</template>

<script setup lang='ts'>
import { 
  Ref,
  ref,
  ComputedRef,
  computed,
  watch, 
  onMounted,
  onUnmounted,
  toRaw
} from 'vue';
import router from '@/router/index';
import { VForm } from 'vuetify/components';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useUserStore } from '@/store/userStore';
import AvailableActions from '@/components/buttons/AvailableActions.vue';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import { UpdateUserRequestData } from '@/models/requests/updateUserRequestData';
import { StoreType } from '@/enums/storeTypes';
import { User } from '@/models/domain/user';
import rules from '@/utilities/rules/index';
import { RulesMessages } from "@/utilities/rules/rulesMessages";
import commonUtilities from '@/utilities/common';

const props = defineProps({
  formStatus: {
    type: Boolean,
    default: true,
  }
});
const emit = defineEmits(['user-updated']);

// Instantiate the stores
const userStore = useUserStore();
const { 
  emailRules, 
  requiredRules, 
  userNameRules } = rules();
const { 
  displaySuccessfulToast, 
  displayFailedToastAsync, 
  resetViewPort,
  updateAppProcessingAsync } = commonUtilities();

const user: Ref<User> = ref(userStore.getUser);
const userName: Ref<string | undefined> = ref(user.value.userName);
const firstName: Ref<string | undefined> = ref(user.value.firstName);
const lastName: Ref<string | undefined> = ref(user.value.lastName);
const nickName: Ref<string | undefined> = ref(user.value.nickName);
const email: Ref<string | undefined> = ref(user.value.email);
const invalidUserNames: Ref<string[]> = ref([]);
const invalidEmails: Ref<string[]> = ref([]);
const firstNameTooltip: ComputedRef<string> = computed(() =>
  RulesMessages.requiredMessage.replace("{{value}}", "First Name")
);
const lastNameTooltip: ComputedRef<string> = computed(() =>
  RulesMessages.requiredMessage.replace("{{value}}", "Last Name")
);

// Form logic
const form: Ref<VForm | null> = ref(null);
const formValid: Ref<boolean> = ref(false);
const formTitle: Ref<string> = ref('User Profile');
// eslint-disable-next-line
const getFormStatus: ComputedRef<boolean> = computed(() => {
  return props.formStatus;
});
// eslint-disable-next-line
const resetFormStatus: ComputedRef<boolean> = computed(() => {
  return !props.formStatus;
});
const formattedDateCreated: ComputedRef<string | null> = computed(() => {
  if (user.value.dateCreated === undefined) {
    return null;
  } else {
    return `${new Date(
      user.value.dateCreated
    ).toLocaleDateString()} ${new Date(
      user.value.dateCreated
    ).toLocaleTimeString()}`;
  }
});
const formattedDateUpdated: ComputedRef<string | null> = computed(() => {
  if (user.value.dateUpdated === undefined) {
    return null;
  } else {
    if (
      `${new Date(user.value.dateUpdated).toLocaleDateString()} ${new Date(
        user.value.dateUpdated
      ).toLocaleTimeString()}` === '1/1/1 12:00:00 AM'
    ) {
      return null;
    } else {
      return `${new Date(
        user.value.dateUpdated
      ).toLocaleDateString()} ${new Date(
        user.value.dateUpdated
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
  () => {
    if (user.value.isEditing) {
      formTitle.value = 'Edit User Profile';
    } else {
      formTitle.value = 'User Profile';
    }
  }
);

// Confirm dialog logic
const confirmDialog: Ref<boolean> = ref(false);
const confirmEditSubmission: Ref<boolean> = ref(false);
const confirmDeleteSubmission: Ref<boolean> = ref(false);
const isSmallViewPort: Ref<boolean> = ref(true);
const maxDialogWidth: Ref<string> = ref('auto');
const confirmTitle: ComputedRef<string | undefined> = computed(() => { 
  if (confirmEditSubmission.value) {
    return 'Confirm Edit';
  } else if (confirmDeleteSubmission.value) {
    return 'Confirm Delete';
  } else {
    return undefined;
  }
});
const confirmMessage: ComputedRef<string | undefined> = computed(() => { 
  if (confirmEditSubmission.value) {
    return `Are you to submit your edits ${user.value.userName}?`;
  } else if (confirmDeleteSubmission.value) {
    return `Are you sure you want to delete your profile ${user.value.userName}?  This action cannot be reversed and will delete all apps and games associated with your profile.`;
  } else {
    return undefined;
  }
});
const actionConfirmedHandlerAsync = async (event: Event | null = null): Promise<void> => {
  event?.preventDefault();
  await updateAppProcessingAsync(async () => {
    if (confirmEditSubmission.value) {
      const result = await editHandlerAsync();
      if (result) {
        confirmDialog.value = false;
        confirmEditSubmission.value = false;
      }
    }

    if (confirmDeleteSubmission.value) {
      const userName = user.value.userName;
      const result = await deleteHandlerAsync();
      if (result) {
        confirmDialog.value = false;
        confirmDeleteSubmission.value = false;
        router.push('/');
        toast(`Sad to see you go ${userName}, your profile has been deleted`, {
          position: toast.POSITION.TOP_CENTER,
          type: toast.TYPE.SUCCESS,
        });
      }
    }});
};
const actionNotConfirmedHandler = async (event: Event | null = null): Promise<void> => {
  event?.preventDefault();
  await updateAppProcessingAsync(() => {
    if (confirmEditSubmission.value) {
      confirmDialog.value = false;
      confirmEditSubmission.value = false;
    }

    if (confirmDeleteSubmission.value) {
      confirmDialog.value = false;
      confirmDeleteSubmission.value = false;
    }});
};
watch(
  () => confirmEditSubmission.value,
  () => {
    if (confirmEditSubmission.value) {
      confirmDialog.value = confirmEditSubmission.value;
    }
  }
);
watch(
  () => confirmDeleteSubmission.value,
  () => {
    if (confirmDeleteSubmission.value) {
      confirmDialog.value = confirmDeleteSubmission.value;
    }
  }
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    invalidEmails: options.invalidEmails };
};

// Form actions
const editHandlerAsync = async (event: Event | null = null): Promise<boolean> => {
  event?.preventDefault();
  return await updateAppProcessingAsync(async () => {
    let result = false;
    if (getFormStatus.value) {
      const data = new UpdateUserRequestData(
        userName.value,
        firstName.value,
        lastName.value,
        nickName.value,
        email.value
      );
      result = await userStore.updateUserAsync(data);
    }
    displaySuccessfulToast(StoreType.USERSTORE);
    const failedToast = await displayFailedToastAsync(
      updateInvalidValues, 
      { 
        invalidUserNames: toRaw(invalidUserNames.value), 
        invalidEmails: toRaw(invalidUserNames.value),
        userName: toRaw(userName.value),
        email: toRaw(email.value)
      });
    if (failedToast.failed) {
      invalidUserNames.value = failedToast.methodResult.invalidUserNames;
      invalidEmails.value = failedToast.methodResult.invalidEmails;
      form.value?.validate();
    }
    return result;}) as Promise<boolean>;
};
const deleteHandlerAsync = async (event: Event | null = null): Promise<boolean> => {
  event?.preventDefault();
  return await updateAppProcessingAsync(async () => {
    let result = false;
    if (getFormStatus.value) {
      result = await userStore.deleteUserAsync();
    }
    const failedToast = await displayFailedToastAsync(
      updateInvalidValues, 
      { 
        invalidUserNames: toRaw(invalidUserNames.value), 
        invalidEmails: toRaw(invalidUserNames.value),
        userName: toRaw(userName.value),
        email: toRaw(email.value)
      });
    if (failedToast.failed) {
      invalidUserNames.value = failedToast.methodResult.invalidUserNames;
      invalidEmails.value = failedToast.methodResult.invalidEmails;
      form.value?.validate();
    }
    return result;
  }) as Promise<boolean>;
};
const refreshHandlerAsync = async (event: Event | null = null): Promise<void> => {
  event?.preventDefault();
  await updateAppProcessingAsync(async () => {
    await userStore.getUserAsync();
    displaySuccessfulToast(StoreType.USERSTORE);
    const failedToast = await displayFailedToastAsync(
      updateInvalidValues, 
      { 
        invalidUserNames: toRaw(invalidUserNames.value), 
        invalidEmails: toRaw(invalidUserNames.value),
        userName: toRaw(userName.value),
        email: toRaw(email.value)
      });
    if (failedToast.failed) {
      invalidUserNames.value = failedToast.methodResult.invalidUserNames;
      invalidEmails.value = failedToast.methodResult.invalidEmails;
      form.value?.validate();
    }
  });
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
const resendEmailConfirmationHandlerAsync = async (event: Event | null = null): Promise<void> => {
  event?.preventDefault();
  await updateAppProcessingAsync(async () => {
    await userStore.resendEmailConfirmationRequestAsync();
    displaySuccessfulToast(StoreType.USERSTORE);
    await displayFailedToastAsync(undefined, undefined);
  })
};
const cancelEmailConfirmationHandlerAsync = async (event: Event | null = null): Promise<void> => {
  event?.preventDefault();
  await updateAppProcessingAsync(async () => {
    await userStore.cancelEmailConfirmationRequestAsync();
    displaySuccessfulToast(StoreType.USERSTORE);
    await displayFailedToastAsync(undefined, undefined);
  })
};
watch(
  () => userStore.getUser,
  () => {
    user.value = userStore.getUser;
    userName.value = user.value.userName;
    firstName.value = user.value.firstName;
    lastName.value = user.value.lastName;
    nickName.value = user.value.nickName;
    email.value = user.value.email;
  }
);
// Lifecycle hooks
onMounted(async () => {
  resetViewPort(isSmallViewPort, maxDialogWidth);
  let resizeTimeout: number | undefined;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resetViewPort(isSmallViewPort, maxDialogWidth);
    }, 250, 'Resized');
  });
});
onUnmounted(() => {
  window.removeEventListener('resize', () => {
    resetViewPort(isSmallViewPort, maxDialogWidth);
  });
});
</script>
