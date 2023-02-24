<template>
	<v-card>
		<v-card-title class="justify-center text-center">
			<span class="headline">Sign Up Form</span>
		</v-card-title>
		<v-form v-model="formValid" ref="form">
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-row :dense="true"><v-col>
					<v-tooltip close-delay="3000" location="bottom">
						<template v-slot:activator="{ props }">
							<v-btn 
								color="blue darken-1" 
								text 
								@click="cancelHandler" 
								v-bind="props">
								Cancel
							</v-btn>
						</template>
						<span>Cancel the sign up process</span>
					</v-tooltip>
				</v-col>
				</v-row>
			</v-card-actions>
		</v-form>
	</v-card>
</template>

<script lang="ts">
import { ComputedRef, Ref, computed, defineComponent, ref } from 'vue';
import { VForm } from 'vuetify/components';

export default defineComponent({
	name: "SignUpForm",
	props: {
		formStatus: {
			type: Boolean,
			default: false
		}
	},
	setup(props, { emit }) {
		const form: Ref<VForm | null> = ref(null);
		const formValid: Ref<boolean> = ref(true);
		// TODO: Remove this eslint comment once this value is used
		// eslint-disable-next-line
		const getFormStatus: ComputedRef<boolean> = computed(() => {
			return props.formStatus;
		});
		// the following line is used by vuetify to reset the form
		// eslint-disable-next-line
		const resetFormStatus: ComputedRef<boolean> = computed(() => {
			return !props.formStatus;
		});
		const cancelHandler = (): void => {
			emit("cancel-signup", null, null);
		};
		return {
			form,
			formValid,
			cancelHandler
		}
	}
});
</script>
