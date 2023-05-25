<template>
	<user-profile-page />
</template>

<script lang='ts'>
import { defineComponent } from 'vue';
import UserProfilePage from '@/components/pages/UserProfilePage.vue';

export default defineComponent({
	name: 'UserProfileView',
	components: {
		UserProfilePage
	},
});
</script>