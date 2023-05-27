<template>
	<v-card-title class='justify-center text-center'>
		<span class='headline'>{{ formTitle }}</span>
	</v-card-title>
	<v-form v-model='formValid' ref='form' lazy-validation>
		<v-row>
			<v-col cols='12' lg='6' xl='6'>
				<v-text-field 
					v-model='user.id'
					type='number'
					label='Id' 
					prepend-icon='mdi-account-circle' 
					:readonly='enableEdit' 
					:disabled='!enableEdit'></v-text-field>
				<v-text-field 
					v-model='userName' 
					label='User Name'
					prepend-icon='mdi-account-circle'
					:rules='userNameRules()'
					:readonly='enableEdit' 
					:color='enableEdit ? "" : "primary"'></v-text-field>
				<v-text-field 
					v-model='firstName' 
					label='First Name' 
					prepend-icon='mdi-account-circle'
					:rule='requiredRules("First Name")'
					:readonly='enableEdit' 
					:color='enableEdit ? "" : "primary"'></v-text-field>
				<v-text-field 
					v-model='lastName' 
					label='Last Name' 
					prepend-icon='mdi-account-circle'
					:rules='requiredRules("Last Name")'
					:readonly='enableEdit' 
					:color='enableEdit ? "" : "primary"'></v-text-field>
				<v-text-field 
					v-model='nickName' 
					label='Nickname (not required)' 
					prepend-icon='mdi-account-circle' 
					:readonly='enableEdit' 
					:color='enableEdit ? "" : "primary"'></v-text-field>
				<v-checkbox 
					v-model='user.isAdmin' 
					label='Admin Privileges' 
					:readonly='enableEdit' 
					:disabled='!enableEdit' ></v-checkbox>
				<v-checkbox 
					v-if='user.isSuperUser' 
					v-model='user.isSuperUser' 
					label='Super User Privileges' 
					:readonly='enableEdit' 
					:disabled='!enableEdit'></v-checkbox>
			</v-col>
			<v-col cols='12' lg='6' xl='6'>
				<v-text-field 
					v-model='formattedDateCreated' 
					label='Date Created' 
					hint='MM/DD/YYYY format' 
					persistent-hint 
					prepend-icon='mdi-calendar' 
					:readonly='enableEdit' 
					:disabled='!enableEdit'></v-text-field>
				<v-text-field 
					v-model='formattedDateUpdated' 
					label='Date Updated' 
					hint='MM/DD/YYYY format' 
					persistent-hint 
					prepend-icon='mdi-calendar' 
					:readonly='enableEdit' 
					:disabled='!enableEdit'></v-text-field>
				<v-text-field 
					v-model='email' 
					label='Email' 
					prepend-icon='mdi-email'
					:rules='emailRules(invalidEmails, "Email not unique")'
					:readonly='enableEdit' 
					:color='enableEdit ? "" : "primary"'></v-text-field>
				<v-checkbox 
					v-model='user.isEmailConfirmed' 
					label='Email Confirmed' 
					:readonly='enableEdit' 
					:disabled='!enableEdit'></v-checkbox>
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
									v-bind='props'
									:disabled="!enableEdit ? !formValid : false">
									{{ submitText }}
								</v-btn>
							</template>
							<span>{{ submitHelperText }}</span>
						</v-tooltip>
					</v-col>
					<v-col>
						<v-tooltip location='bottom' :disabled="enableEdit">
							<template v-slot:activator='{ props }'>
								<v-btn 
									color='blue darken-1' 
									text 
									@click='cancelHandler' 
									v-bind='props' 
									:disabled='enableEdit'>
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
import { computed, ComputedRef, Ref, defineComponent, ref } from 'vue';
import { VForm } from 'vuetify/components';
import { useUserStore } from '@/store/userStore/index';
import { User } from '@/models/domain/user';
import rules from '@/utilities/rules/index';

export default defineComponent({
	name: 'UserProfileForm',
	props: {
		formStatus: {
			type: Boolean,
			default: false
		}
	},
	setup(props, { emit }) {
		const form: Ref<VForm | null> = ref(null);
		const formValid: Ref<boolean> = ref(false);
		const formTitle: Ref<string> = ref('User Profile');
		const enableEdit: Ref<boolean> = ref(true);
		const userStore = useUserStore();
		const {
			emailRules,
			requiredRules,
			userNameRules } = rules();
		const user: Ref<User> = ref(userStore.getUser);
		const userName: Ref<string | null> = ref(user.value.userName);
		const firstName: Ref<string | null> = ref(user.value.firstName);
		const lastName: Ref<string | null> = ref(user.value.lastName);
		const nickName: Ref<string | null> = ref(user.value.nickName);
		const email: Ref<string | null> = ref(user.value.email);
		const invalidEmails: Ref<string[]> = ref([]);

		const getFormStatus: ComputedRef<boolean> = computed(() => {
			return props.formStatus;
		});

		// the following line is used by vuetify to reset the form
		// eslint-disable-next-line
		const resetFormStatus: ComputedRef<boolean> = computed(() => {
			return !props.formStatus;
		});

		const formattedDateCreated: ComputedRef<string | null> = computed(() => {
			if (user.value.dateCreated === null) {
				return null;
			} else {
				return `${new Date(user.value.dateCreated).toLocaleDateString()} ${new Date(user.value.dateCreated).toLocaleTimeString()}`;
			}
		});

		const formattedDateUpdated: ComputedRef<string | null> = computed(() => {
			if (user.value.dateUpdated === null) {
				return null;
			} else {
				if (`${new Date(user.value.dateUpdated).toLocaleDateString()} ${new Date(user.value.dateUpdated).toLocaleTimeString()}` === '1/1/1 12:00:00 AM') {
					return null;
				} else {
					return `${new Date(user.value.dateUpdated).toLocaleDateString()} ${new Date(user.value.dateUpdated).toLocaleTimeString()}`;
				}
			}
		});

		const submitText: ComputedRef<string> = computed(() => {
			if (enableEdit.value) {
				return 'Edit';
			} else {
				return 'Submit';
			}
		});

		const submitHelperText: ComputedRef<string> = computed(() => {
			if (enableEdit.value) {
				return 'Edit your profile';
			} else {
				return 'Submit your changes';
			}
		});

		const submitHandler = (): void => {
			if (enableEdit.value === true) {
				enableEdit.value = false;
				form.value?.validate();
				formTitle.value = 'Edit User Profile';
			} else {
				if (getFormStatus.value) {
					enableEdit.value = true;
					formTitle.value = 'User Profile';
				}
			}
		};

		const cancelHandler = (): void => {
			enableEdit.value = true;
			formTitle.value = 'User Profile';
			invalidEmails.value = [];
			form.value?.resetValidation();
			userName.value = user.value.userName;
			firstName.value = user.value.firstName;
			lastName.value = user.value.lastName;
			nickName.value = user.value.nickName;
			email.value = user.value.email;
			emit('updating-user-completed', null);
		};

		return {
			form,
			formValid,
			formTitle,
			enableEdit,
			user,
			userName,
			firstName,
			lastName,
			nickName,
			email,
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
	}
});
</script>
