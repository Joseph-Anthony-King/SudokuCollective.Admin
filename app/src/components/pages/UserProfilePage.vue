<template>
	<v-container fluid>
		<v-card elevation='6' class='mx-auto'>
			<v-card-text>
				<v-container fluid>
					<div class='text-center'>
						<v-card-title>User Profile</v-card-title>
						<user-profile-form />
					</div>
				</v-container>
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import UserProfileForm from '@/components/forms/UserProfileForm.vue';

export default defineComponent({
	name: 'UserProfilePage',
	components: { UserProfileForm }
});
</script>