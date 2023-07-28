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
    <v-card-actions class='text-center'>
      <v-row dense>
        <v-col>
          <v-tooltip location='bottom'>
            <template v-slot:activator='{ props }'>
              <v-btn
                color='blue darken-1'
                text
                @click='submitHandler'
                :disabled='user.isEditing ? !formValid : false'
                v-bind='props'
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
    </v-card-actions>
  </v-form>
</template>

<script lang='ts'>
import { computed, ComputedRef, Ref, defineComponent, ref, watch } from 'vue';
import { VForm } from 'vuetify/components';
import { useUserStore } from '@/store/userStore/index';
import { useServiceFailStore } from '@/store/serviceFailStore/index';
import { User } from '@/models/domain/user';
import rules from '@/utilities/rules/index';
import { UpdateUserRequestData } from '@/models/requests/updateUserRequestData';
import { toast } from 'vue3-toastify';

export default defineComponent({
  name: 'UserProfileForm',
  props: {
    formStatus: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const form: Ref<VForm | null> = ref(null);
    const formValid: Ref<boolean> = ref(false);
    const formTitle: Ref<string> = ref('User Profile');
    const userStore = useUserStore();
    const serviceFailStore = useServiceFailStore();
    const { emailRules, requiredRules, userNameRules } = rules();
    const user: Ref<User> = ref(userStore.getUser);
    const userName: Ref<string | null> = ref(user.value.userName);
    const firstName: Ref<string | null> = ref(user.value.firstName);
    const lastName: Ref<string | null> = ref(user.value.lastName);
    const nickName: Ref<string | null> = ref(user.value.nickName);
    const email: Ref<string | null> = ref(user.value.email);
    const invalidUserNames: Ref<string[]> = ref([]);
    const invalidEmails: Ref<string[]> = ref([]);

    // eslint-disable-next-line
    const getFormStatus: ComputedRef<boolean> = computed(() => {
      return props.formStatus;
    });

    // eslint-disable-next-line
    const resetFormStatus: ComputedRef<boolean> = computed(() => {
      return !props.formStatus;
    });

    const formattedDateCreated: ComputedRef<string | null> = computed(() => {
      if (user.value.dateCreated === null) {
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
      if (user.value.dateUpdated === null) {
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

    const submitHandler = (): void => {
      if (!user.value.isEditing) {
        user.value.isEditing = true;
        form.value?.validate();
      } else {
        if (getFormStatus.value) {
          const data = new UpdateUserRequestData(
            userName.value,
            firstName.value,
            lastName.value,
            nickName.value,
            email.value
          );
          userStore.updateUserAsync(data);
        }
      }
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
      emit('updating-user-completed', null);
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
      () => user.value.isEditing,
      () => {
        if (user.value.isEditing) {
          formTitle.value = 'Edit User Profile';
        } else {
          formTitle.value = 'User Profile';
        }
      }
    );

    watch(
      () => userStore.getServiceMessage,
      () => {
        if (
          userStore.getServiceMessage !== null &&
          userStore.getServiceMessage !== ''
        ) {
          toast(userStore.getServiceMessage, {
            position: toast.POSITION.TOP_CENTER,
            type: toast.TYPE.SUCCESS,
          });
          userStore.updateServiceMessage('');
        }
      }
    );

    watch(
      () => serviceFailStore.getIsSuccess,
      () => {
        const isSuccess = serviceFailStore.getIsSuccess;
        if (isSuccess !== null && !isSuccess) {
          const message: string = serviceFailStore.getMessage;
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

    return {
      form,
      formValid,
      formTitle,
      user,
      userName,
      firstName,
      lastName,
      nickName,
      email,
      invalidUserNames,
      invalidEmails,
      userNameRules,
      emailRules,
      requiredRules,
      formattedDateCreated,
      formattedDateUpdated,
      submitText,
      submitHelperText,
      submitHandler,
      cancelHandler,
    };
  },
});
</script>
