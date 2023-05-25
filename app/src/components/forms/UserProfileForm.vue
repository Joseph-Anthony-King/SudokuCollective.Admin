<template>
	<v-form>
		<v-row>
			<v-col cols="12" lg="6" xl="6">
				<v-text-field v-model="user.id" label="Id" prepend-icon="mdi-account-circle" readonly></v-text-field>
				<v-text-field v-model="user.userName" label="User Name" prepend-icon="mdi-account-circle" readonly></v-text-field>
				<v-text-field v-model="user.firstName" label="First Name" prepend-icon="mdi-account-circle" readonly></v-text-field>
				<v-text-field v-model="user.lastName" label="Last Name" prepend-icon="mdi-account-circle" readonly></v-text-field>
				<v-text-field v-model="user.nickName" label="Nickname" prepend-icon="mdi-account-circle" readonly></v-text-field>
				<v-checkbox v-model="user.isAdmin" label="Admin Privileges" readonly ></v-checkbox>
				<v-checkbox v-if="user.isSuperUser" v-model="user.isSuperUser" label="Super User Privileges" readonly></v-checkbox>
			</v-col>
			<v-col cols="12" lg="6" xl="6">
				<v-text-field v-model="formattedDateCreated" label="Date Created" hint="MM/DD/YYYY format" persistent-hint prepend-icon="mdi-calendar" readonly></v-text-field>
				<v-text-field v-model="formattedDateUpdated" label="Date Updated" hint="MM/DD/YYYY format" persistent-hint prepend-icon="mdi-calendar" readonly></v-text-field>
				<v-text-field v-model="user.email" label="Email" readonly prepend-icon="mdi-email"></v-text-field>
				<v-checkbox v-model="user.isEmailConfirmed" label="Email Confirmed" readonly></v-checkbox>
			</v-col>
		</v-row>
	</v-form>
</template>

<script lang='ts'>
import { ComputedRef, Ref, defineComponent, ref } from 'vue';
import { useUserStore } from '@/store/userStore/index';
import { User } from '@/models/domain/user';
import { computed } from 'vue';

export default defineComponent({
	name: 'UserProfileForm',
	setup() {
		const userStore = useUserStore();
		const user: Ref<User> = ref(userStore.getUser);

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

		return {
			user,
			formattedDateCreated,
			formattedDateUpdated
		};
	}
});
</script>
