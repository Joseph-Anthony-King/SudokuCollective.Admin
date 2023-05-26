<template>
	<v-container fluid>
		<v-card elevation='6' class='mx-auto'>
			<v-card-text>
				<v-container fluid>
					<v-card-title class='justify-center text-center'>
						<span class='headline'>Dashboard</span>
					</v-card-title>
				</v-container>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'DashboardPage',
});
</script>