<template>
	<v-navigation-drawer
		app
		color='secondary'
		:model-value='navDrawerStatus'
		:permanent="$vuetify.display.mdAndUp"
		v-if='userLoggedIn'>
		<v-list>
			<v-list-item class='list-item'>
				<v-icon x-large color='white' icon='mdi-account-circle'></v-icon>
			</v-list-item>
			<v-list-item class='list-item'>
				<span class='user-profile-subscript'>{{ greeting }}</span>
				<span class='user-profile-item'>{{ user.userName }}</span>
			</v-list-item>
		</v-list>
	</v-navigation-drawer>
</template>

<script lang='ts'>
import { Ref, defineComponent, ref, watch } from 'vue';
import { useUserStore } from '@/store/userStore';
import { User } from '@/models/domain/user';
import { onMounted } from 'vue';

export default defineComponent({
	name: 'NavigationDrawer',
	props: {
		navDrawerStatus: {
			type: Boolean,
			default: false
		},
		userLoggedIn: {
			type: Boolean,
			default: false
		},
	},
	setup() {
		const userStore = useUserStore();
		const greeting: Ref<string> = ref('');
		const user: Ref<User> = ref(userStore.getUser);

		const updateNow = () => {
			const now = new Date();

			if (now.getHours() < 12) {
				greeting.value = 'Good Morning,';
			} else if (now.getHours() < 18) {
				greeting.value = 'Good Afternoon,';
			} else {
				greeting.value = 'Good Evening,';
			}
		};

		const updateGreeting = () => {
			updateNow();

			setInterval(() => {
				updateNow();
			}, 60000);
		};
		
		watch(
			() => userStore.getUser,
			() => {
				user.value = userStore.getUser;
			}
		);

		onMounted(() => { 
			updateGreeting();
		});

		return {
			greeting,
			user,
		}
	}
});
</script>

<style scoped>
.nav-drawer-item {
	font-weight: bold;
	text-decoration: none !important;
	color: #ffffff;
}

.user-profile-item {
	font-weight: bold;
	text-decoration: none !important;
	text-transform: uppercase;
	text-align: center;
	color: #ffffff;
}

.user-profile-subscript {
	font-size: small;
	text-align: center;
	color: #ffffff;
}

.user-profile-subscript::after {
	content: '\a';
	white-space: pre;
}

.list-item {
	text-align: center;
	padding: 0;
	margin: 0;
}
.white--text {
	padding-right: 10px;
	padding-bottom: 5px;
}</style>
