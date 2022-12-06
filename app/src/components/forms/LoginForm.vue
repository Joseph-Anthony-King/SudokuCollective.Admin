<template>
	<v-card>
		<v-card-title class="justify-center text-center">
			<span class="headline">Login Form</span>
		</v-card-title>
		<v-card-actions>
			<v-spacer></v-spacer>
			<v-col>
				<v-tooltip bottom>
					<template v-slot:activator="{ props }">
						<v-btn color="blue darken-1" text @click="cancelHandler" v-bind="props">
							Cancel
						</v-btn>
					</template>
					<span>Cancel the login process</span>
				</v-tooltip>
			</v-col>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts">
	import { defineComponent } from 'vue';

	export default defineComponent({
		name: 'LoginForm',
		setup(props, { emit }) {

			function cancelHandler(): void {
				emit("cancel-login", null, null);
			}

			return {
				cancelHandler
			}
		}
	});
</script>