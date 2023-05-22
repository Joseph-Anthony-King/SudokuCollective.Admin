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
								:rules='userNameRules'
								required
							></v-text-field>
						</v-col>
						<v-col cols='12'>
							<v-text-field
								v-model='user.firstName'
								label='First Name'
								prepend-icon='mdi-account-plus'
								:rules="requiredRulesHandler('First Name')"
								required
							></v-text-field>
						</v-col>
						<v-col cols='12'>
							<v-text-field
								v-model='user.lastName'
								label='Last Name'
								prepend-icon='mdi-account-plus'
								:rules="requiredRulesHandler('Last Name')"
								required
							></v-text-field>
						</v-col>
						<v-col cols='12'>
							<v-text-field
								v-model='user.nickName'
								label='Nickname (Not Required)'
								prepend-icon='mdi-account-plus'
							></v-text-field>
						</v-col>
						<v-col cols='12'>
							<v-text-field
								v-model='user.email'
								label='Email'
								prepend-icon='mdi-email'
								:rules='emailRules'
								required
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
								:rules='passwordRules'
								required
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
								:rules='confirmPasswordRules'
								required
							></v-text-field>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-row :dense='true'>
					<v-col>
						<v-tooltip close-delay='3000' location='bottom'>
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
							<span>Reset the sing up form</span>
						</v-tooltip>
					</v-col>
					<v-col>
						<v-tooltip close-delay='3000' location='bottom'>
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
						<v-tooltip close-delay='3000' location='bottom'>
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
							<span>Sign up with the a`pi</span>
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
		const form: Ref<VForm | null> = ref(null);
		const formValid: Ref<boolean> = ref(true);
		const user: Ref<User> = ref(userStore.getUser);
		const password: Ref<string | null> = ref(null);
		const confirmPassword: Ref<string | null> = ref(null);
		const showPassword: Ref<boolean> = ref(false);
		const confirmFormReset: Ref<boolean> = ref(false);
		let invalidUserNames: string[] = [];
		let invalidEmails: string[] = [];
		const userNameRules = computed(() => {
			return [
				(v: string) => !!v || 'User Name is required',
				(v: string) =>
					/^[a-zA-Z0-9!@#$%^&*+=<>?-_.,].{3,}$/.test(v) ||
					'User name must be at least 4 characters and can contain alphanumeric characters and special characters of [! @ # $ % ^ & * + = ? - _ . ,]',
				(v: string) => !invalidUserNames.includes(v) || 'User name not unique',
			];
		});
		const emailRules = computed(() => {
			return [
				(v: string) => !!v || 'Email is required',
				(v: string) =>
					/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
					'Email must be in a valid format',
				(v: string) => !invalidEmails.includes(v) || 'Email not unique',
			];
		});
		const passwordRules = computed(() => {
			return [
				(v: string) => !!v || 'Password is required',
				(v: string) =>
					/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*+=?\-_.,]).{3,21}$/.test(
						v
					) ||
					'Password must be from 4 and up through 20 characters with at least 1 upper case letter, 1 lower case letter, 1 numeric character, and 1 special character of ! @ # $ % ^ & * + = ? - _ . ,',
			];
		});
		const confirmPasswordRules = computed(() => {
			return [
				(v: string) => !!v || 'Password is required',
				(v: string) =>
					/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*+=?\-_.,]).{3,21}$/.test(
						v
					) ||
					'Password must be from 4 and up through 20 characters with at least 1 upper case letter, 1 lower case letter, 1 numeric character, and 1 special character of ! @ # $ % ^ & * + = ? - _ . ,',
				(v: string) => v === password.value || 'Password and confirm password must match',
			];
		});
		const requiredRulesHandler = (value: string) => {
			return [
				(v: string) => !!v || `${value} is required`
			];
		};
		const resetHandler = (): void => {
			user.value.userName = null;
			user.value.firstName = null;
			user.value.lastName = null;
			user.value.nickName = null;
			user.value.email = null;
			password.value = null;
			confirmPassword.value = null;
			invalidUserNames = [];
			form.value?.reset();
			confirmFormReset.value = false;
			serviceFailStore.initializeStore();
		};
		const cancelHandler = (): void => {
			emit('cancel-signup', null, null);
		};
		const submitHandler = (): void => {
			if (getFormStatus.value) {
				const data = new SignupRequestData(user.value.userName, user.value.firstName, user.value.lastName, user.value.nickName, user.value.email, password.value);
				userStore.signupUserAsync(data);
			}
		};
		const getFormStatus: ComputedRef<boolean> = computed(() => {
			return props.formStatus;
		});
		// the following line is used by vuetify to reset the form
		// eslint-disable-next-line
		const resetFormStatus: ComputedRef<boolean> = computed(() => {
			return !props.formStatus;
		});
		watch(
			() => serviceFailStore.getIsSuccess,
			() => {
				const isSuccess = serviceFailStore.getIsSuccess;
				if (isSuccess !== null && !isSuccess) {
					const message: string = serviceFailStore.getMessage;
					if (
						message === 'Status Code 404: User name not unique' &&
						!invalidUserNames.includes(user.value.userName as string)
					) {
						invalidUserNames.push(user.value.userName as string);
					}
					if (
						message === 'Status Code 404: Email not unique' &&
						!invalidEmails.includes(user.value.email as string)
					) {
						invalidEmails.push(user.value.email as string);
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
			userNameRules,
			emailRules,
			passwordRules,
			confirmPasswordRules,
			requiredRulesHandler,
			submitHandler,
			resetHandler,
			cancelHandler
		}
	}
});
</script>
