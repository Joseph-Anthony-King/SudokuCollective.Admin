<template>
  <v-card-title class='justify-center text-center'>
    <span class='headline'>{{ formTitle }}</span>
  </v-card-title>
  <v-form v-model='formValid' ref='form'>
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
        <v-text-field
          v-model='userName'
          label='User Name'
          prepend-icon='mdi-account-circle'
          :rules='userNameRules(invalidUserNames, "User name not unique")'
          :readonly='!user.isEditing'
          :color='!user.isEditing ? "" : "primary:"'
        ></v-text-field>
        <v-text-field
          v-model='firstName'
          label='First Name'
          prepend-icon='mdi-account-circle'
          :rule='requiredRules("First Name")'
          :readonly='!user.isEditing'
          :color='!user.isEditing ? "" : "primary"'
        ></v-text-field>
        <v-text-field
          v-model='lastName'
          label='Last Name'
          prepend-icon='mdi-account-circle'
          :rules='requiredRules("Last Name")'
          :readonly='!user.isEditing'
          :color='!user.isEditing ? "" : "primary"'
        ></v-text-field>
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
        ></v-checkbox>
        <v-checkbox
          v-if='user.isSuperUser'
          v-model='user.isSuperUser'
          label='Super User Privileges'
          :readonly='!user.isEditing'
          :disabled='user.isEditing'
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
        <v-text-field
          v-model='email'
          label='Email'
          prepend-icon='mdi-email'
          :rules='emailRules(invalidEmails, "Email not unique")'
          :readonly='!user.isEditing'
          :color='!user.isEditing ? "" : "primary"'
        ></v-text-field>
        <v-checkbox
          v-model='user.isEmailConfirmed'
          label='Email Confirmed'
          :readonly='!user.isEditing'
          :disabled='user.isEditing'
        ></v-checkbox>
      </v-col>
    </v-row>
    <available-actions>
      <v-row dense>
        <v-col>
          <v-tooltip location='bottom'>
            <template v-slot:activator='{ props }'>
              <v-btn
                color='blue darken-1'
                text
                :disabled='formValid'
                v-bind='props'
                @click='user.isEditing === false ? user.isEditing = true : confirmEditSubmission = true'
              >
                {{ submitText }}
              </v-btn>
            </template>
            <span>{{ submitHelperText }}</span>
          </v-tooltip>
        </v-col>
        <v-col>
          <v-tooltip location='bottom' :disabled='user.isEditing'>
            <template v-slot:activator='{ props }'>
              <v-btn
                color='blue darken-1'
                text
                @click='refreshHandler'
                v-bind='props'
                :disabled='user.isEditing'
              >
                Refresh
              </v-btn>
            </template>
            <span>Pull latest values from the API</span>
          </v-tooltip>
        </v-col>
        <v-col>
          <v-tooltip location='bottom' :disabled='user.isEditing'>
            <template v-slot:activator='{ props }'>
              <v-btn
                color='blue darken-1'
                text
                @click='cancelHandler'
                v-bind='props'
                :disabled='!user.isEditing'
              >
                Cancel
              </v-btn>
            </template>
            <span>Cancel the edit</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <v-tooltip location='bottom' :disabled='user.isEditing'>
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
      </v-row>
    </available-actions>
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
      v-on:action-confirmed='actionConfirmedHandler'
      v-on:action-not-confirmed='actionNotConfirmedHandler'/>
  </v-dialog>
</template>

<script setup lang='ts'>
import { 
  ref,
  Ref,
  computed,
  ComputedRef, 
  watch, 
  onMounted,
  onUnmounted
} from 'vue';
import router from '@/router/index';
import { VForm } from 'vuetify/components';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useAppStore } from '@/store/appStore/index';
import { useUserStore } from '@/store/userStore/index';
import { useServiceFailStore } from '@/store/serviceFailStore/index';
import AvailableActions from '@/components/buttons/AvailableActions.vue';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import { UpdateUserRequestData } from '@/models/requests/updateUserRequestData';
import { User } from '@/models/domain/user';
import rules from '@/utilities/rules/index';
import commonUtilities from '@/utilities/common';

const props = defineProps({
  formStatus: {
    type: Boolean,
    default: true,
  }
});
const emit = defineEmits(['user-updated']);

// Initialize stores
const appStore = useAppStore();
const userStore = useUserStore();
const serviceFailStore = useServiceFailStore();
const { 
  emailRules, 
  requiredRules, 
  userNameRules } = rules();
const { resetViewPort } = commonUtilities();

const user: Ref<User> = ref(userStore.getUser);
const userName: Ref<string | undefined> = ref(user.value.userName);
const firstName: Ref<string | undefined> = ref(user.value.firstName);
const lastName: Ref<string | undefined> = ref(user.value.lastName);
const nickName: Ref<string | undefined> = ref(user.value.nickName);
const email: Ref<string | undefined> = ref(user.value.email);
const invalidUserNames: Ref<string[]> = ref([]);
const invalidEmails: Ref<string[]> = ref([]);

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
  if (user.value.isEditing) {
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

const actionConfirmedHandler = async (): Promise<void> => {
  if (confirmEditSubmission.value) {
    appStore.updateProcessingStatus(true);
    const result = await editHandler();
    if (result) {
      confirmDialog.value = false;
      confirmEditSubmission.value = false;
    }
  }

  if (confirmDeleteSubmission.value) {
    appStore.updateProcessingStatus(true);
    const userName = user.value.userName;
    const result = await deleteHandler();
    if (result) {
      confirmDialog.value = false;
      confirmDeleteSubmission.value = false;
      router.push('/');
      toast(`Sad to see you go ${userName}, your profile has been deleted`, {
        position: toast.POSITION.TOP_CENTER,
        type: toast.TYPE.SUCCESS,
      });
    }
    appStore.updateProcessingStatus(false);
  }
};

const actionNotConfirmedHandler = (): void => {
  if (confirmEditSubmission.value) {
    confirmDialog.value = false;
    confirmEditSubmission.value = false;
  }

  if (confirmDeleteSubmission.value) {
    confirmDialog.value = false;
    confirmDeleteSubmission.value = false;
  }
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

// Form actions
const editHandler = async (): Promise<boolean> => {
  let result = false;
  if (getFormStatus.value) {
    appStore.updateProcessingStatus(true);
    const data = new UpdateUserRequestData(
      userName.value,
      firstName.value,
      lastName.value,
      nickName.value,
      email.value
    );
    result = await userStore.updateUserAsync(data);
    appStore.updateProcessingStatus(false);
  }
  return result;
};

const deleteHandler = async (): Promise<boolean> => {
  let result = false;
  if (getFormStatus.value) {
    appStore.updateProcessingStatus(true);
    result = await userStore.deleteUserAsync();
    appStore.updateProcessingStatus(false);
  }
  return result;
};

const refreshHandler = async (): Promise<void> => {
  appStore.updateProcessingStatus(true);
  await userStore.getUserAsync();
  appStore.updateProcessingStatus(false);
};

const cancelHandler = (): void => {
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

watch(
  () => userStore.getServiceMessage,
  () => {
    const message = userStore.getServiceMessage;
    if (message !== undefined && message !== '') {
      toast(message, {
        position: toast.POSITION.TOP_CENTER,
        type: toast.TYPE.SUCCESS,
      });
      userStore.updateServiceMessage();
    }
  }
);

watch(
  () => serviceFailStore.getIsSuccess,
  () => {
    const isSuccess = serviceFailStore.getIsSuccess;
    const message = serviceFailStore.getMessage;
    if (!isSuccess && message !== undefined) {
      if (
        message === 'Status Code 404: User name not unique' &&
        !invalidUserNames.value.includes(userName.value as string)
      ) {
        invalidUserNames.value.push(userName.value as string);
      }
      if (
        message === 'Status Code 404: Email not unique' &&
        !invalidEmails.value.includes(email.value as string)
      ) {
        invalidEmails.value.push(email.value as string);
      }
      toast(message, {
        position: toast.POSITION.TOP_CENTER,
        type: toast.TYPE.ERROR,
      });
      serviceFailStore.initializeStore();
      form.value?.validate();
    }
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
