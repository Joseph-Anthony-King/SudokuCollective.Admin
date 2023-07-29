<template>
	<v-card>
		<v-card-title class='justify-center text-center'>
			<span class='headline'>Sign Up</span>
		</v-card-title>
		<v-form v-model='formValid' ref='form'>
			<v-card-text>
				<v-container>
					<v-row>
						<v-col cols='12'>
							<v-text-field
								v-model='user.userName'
								label='User Name'
								prepend-icon='mdi-account-plus'
								:rules='userNameRules(invalidUserNames, "User name not unique")'
								required
								color="primary"
							></v-text-field>
						</v-col>
						<v-col cols='12'>
							<v-text-field
								v-model='user.firstName'
								label='First Name'
								prepend-icon='mdi-account-plus'
								:rules="requiredRules('First Name')"
								required
								color="primary"
							></v-text-field>
						</v-col>
						<v-col cols='12'>
							<v-text-field
								v-model='user.lastName'
								label='Last Name'
								prepend-icon='mdi-account-plus'
								:rules="requiredRules('Last Name')"
								required
								color="primary"
							></v-text-field>
						</v-col>
						<v-col cols='12'>
							<v-text-field
								v-model='user.nickName'
								label='Nickname (Not Required)'
								prepend-icon='mdi-account-plus'
								color="primary"
							></v-text-field>
						</v-col>
						<v-col cols='12'>
							<v-text-field
								v-model='user.email'
								label='Email'
								prepend-icon='mdi-email'
								:rules='emailRules(invalidEmails, "Email not unique")'
								required
								color="primary"
							></v-text-field>
						</v-col>
						<v-col cols='12'>
							<v-text-field
								v-model='password'
								label='Password'
								:type="showPassword ? 'text' : 'password'"
								prepend-icon='mdi-account-key'
								:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
								@click:append="showPassword = !showPassword"
								autocomplete='new-password'
								:rules='passwordRules()'
								required
								color="primary"
							></v-text-field>
						</v-col>
						<v-col cols='12'>
							<v-text-field
								v-model='confirmPassword'
								label='Confirm Password'
								:type="showPassword ? 'text' : 'password'"
								prepend-icon='mdi-account-key'
								:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
								@click:append='showPassword = !showPassword'
								autocomplete='new-password'
								:rules='confirmPasswordRules(password)'
								required
								color="primary"
							></v-text-field>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>
			<v-card-actions class='text-center'>
				<v-row dense>
					<v-col>
						<v-tooltip location='bottom'>
							<template v-slot:activator='{ props }'>
								<v-btn
									color='blue darken-1'
									text
									@click='confirmFormReset = true'
									v-bind='props'
								>
									Reset
								</v-btn>
							</template>
							<span>Reset the sign up form</span>
						</v-tooltip>
					</v-col>
					<v-col>
						<v-tooltip location='bottom'>
							<template v-slot:activator='{ props }'>
								<v-btn 
									color='blue darken-1' 
									text 
									@click='cancelHandler' 
									v-bind='props'>
									Cancel
								</v-btn>
							</template>
							<span>Cancel the sign up process</span>
						</v-tooltip>
					</v-col>
					<v-col>
						<v-tooltip location='bottom'>
							<template v-slot:activator='{ props }'>
								<v-btn
									color='blue darken-1'
									text
									@click='submitHandler'
									:disabled='!formValid'
									v-bind='props'
								>
									Submit
								</v-btn>
							</template>
							<span>Sign up with SudokuCollective.com</span>
						</v-tooltip>
					</v-col>
				</v-row>
			</v-card-actions>
		</v-form>
	</v-card>
	<v-dialog 
		v-model='confirmFormReset' 
		persistent max-width='600' 
		hide-overlay 
		transition='dialog-top-transition'>
		<ConfirmDialog 
			title='Reset Form' 
			message='Are you sure you want to reset this form?' 
			v-on:action-confirmed='resetHandler'
			v-on:action-not-confirmed='confirmFormReset = false' />
	</v-dialog>
</template>

<script lang='ts'>
import { ComputedRef, Ref, computed, defineComponent, ref, watch } from 'vue';
import { VForm } from 'vuetify/components';
import { toast } from 'vue3-toastify';
import { useUserStore } from '@/store/userStore/index';
import { useServiceFailStore } from '@/store/serviceFailStore/index';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import { User } from '@/models/domain/user';
import rules from '@/utilities/rules/index';
import { SignupRequestData } from '@/models/requests/signupRequestData';

export default defineComponent({
	name: 'SignUpForm',
	components: { ConfirmDialog },
	props: {
		formStatus: {
			type: Boolean,
			default: false
		}
	},
	setup(props, { emit }) {
		const serviceFailStore = useServiceFailStore();
		const userStore = useUserStore();
		const {
			confirmPasswordRules,
			emailRules,
			requiredRules,
			passwordRules,
			userNameRules } = rules();
		const form: Ref<VForm | null> = ref(null);
		const formValid: Ref<boolean> = ref(true);
		const user: Ref<User> = ref(userStore.getUser);
		const password: Ref<string | null> = ref(null);
		const confirmPassword: Ref<string | null> = ref(null);
		const showPassword: Ref<boolean> = ref(false);
		const confirmFormReset: Ref<boolean> = ref(false);
		const invalidUserNames: Ref<string[]> = ref([]);
		const invalidEmails: Ref<string[]> = ref([]);

		const getFormStatus: ComputedRef<boolean> = computed(() => {
			return props.formStatus;
		});

		// the following line is used by vuetify to reset the form
		// eslint-disable-next-line
		const resetFormStatus: ComputedRef<boolean> = computed(() => {
			return !props.formStatus;
		});

		const submitHandler = (): void => {
			if (getFormStatus.value) {
				const data = new SignupRequestData(user.value.userName, user.value.firstName, user.value.lastName, user.value.nickName, user.value.email, password.value);
				userStore.signupUserAsync(data);
			}
		};

		const resetHandler = (): void => {
			user.value.userName = null;
			user.value.firstName = null;
			user.value.lastName = null;
			user.value.nickName = null;
			user.value.email = null;
			password.value = null;
			confirmPassword.value = null;
			invalidUserNames.value = [];
			form.value?.reset();
			confirmFormReset.value = false;
			serviceFailStore.initializeStore();
		};

		const cancelHandler = (): void => {
			emit('cancel-signup', null, null);
		};

		watch(
			() => serviceFailStore.getIsSuccess,
			() => {
				const isSuccess = serviceFailStore.getIsSuccess;
				if (isSuccess !== null && !isSuccess) {
					const message: string = serviceFailStore.getMessage;
					if (
						message === 'Status Code 404: User name not unique' &&
						!invalidUserNames.value.includes(user.value.userName as string)
					) {
						invalidUserNames.value.push(user.value.userName as string);
					}
					if (
						message === 'Status Code 404: Email not unique' &&
						!invalidEmails.value.includes(user.value.email as string)
					) {
						invalidEmails.value.push(user.value.email as string);
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
			user,
			password,
			confirmPassword,
			showPassword,
			confirmFormReset,
			invalidUserNames,
			invalidEmails,
			userNameRules,
			emailRules,
			passwordRules,
			confirmPasswordRules,
			requiredRules,
			submitHandler,
			resetHandler,
			cancelHandler
		}
	}
});
</script>
