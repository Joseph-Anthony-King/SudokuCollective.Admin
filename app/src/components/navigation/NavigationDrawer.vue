<template>
  <v-navigation-drawer
    color="secondary"
    :model-value="navDrawerStatus"
    :permanent="user.isLoggedIn && $vuetify.display.mdAndUp"
    v-if="userLoggedIn"
  >
    <v-list>
      <v-list-item class="list-item">
        <v-icon x-large color="white" icon="mdi-account-circle"></v-icon>
      </v-list-item>
      <v-list-item class="list-item">
        <span class="user-profile-subscript">{{ greeting }}</span>
        <span class="user-profile-item">{{ user.userName }}</span>
      </v-list-item>
    </v-list>
    <v-list>
      <div v-for="(navItem, index) in navDrawerItems" :key="index">
        <v-list-item v-if="navItem.condition">
          <v-list-item-content>
            <v-list-item-title>
              <v-icon class="white--text">{{ navItem.mdiIcon }}</v-icon>
              <router-link :to="navItem.url" class="nav-drawer-item">
                {{ navItem.title }}
              </router-link>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars*/
import { Ref, ref, watch } from "vue";
import { onBeforeMount } from "vue";
import { onBeforeUpdate } from "vue";
import { useUserStore } from "@/store/userStore";
import { NavDrawerLinks } from "@/utilities/links/navDrawerLinks";
import { User } from "@/models/domain/user";
import { MenuItem } from "@/models/infrastructure/menuItem";

const props = defineProps({
  navDrawerStatus: {
    type: Boolean,
    default: false,
  },
  userLoggedIn: {
    type: Boolean,
    default: false,
  },
});

//#region Instantiate the Stores
const userStore = useUserStore();
//#endregion

//#region Properties
const greeting: Ref<string> = ref("");
const navDrawerItems: Ref<MenuItem[]> = ref(NavDrawerLinks);
const user: Ref<User> = ref(userStore.getUser);
//#endregion

//#region Actions
const updateNow = () => {
  const now = new Date();

  if (now.getHours() < 12) {
    greeting.value = "Good Morning,";
  } else if (now.getHours() < 18) {
    greeting.value = "Good Afternoon,";
  } else {
    greeting.value = "Good Evening,";
  }
};
const updateGreeting = () => {
  updateNow();

  setInterval(() => {
    updateNow();
  }, 60000);
};
const updateSiteAdminVisibility = () => {
  const navItemIndex = navDrawerItems.value.findIndex(
    (item) => item.title === "Site Administration"
  );
  if (navItemIndex !== -1) {
    if (user.value.isSuperUser === true) {
      navDrawerItems.value[navItemIndex].condition = true;
    } else {
      if (navDrawerItems.value[navItemIndex].condition === true) {
        navDrawerItems.value[navItemIndex].condition = false;
      }
    }
  }
};
//#endregion

//#region Watches
watch(
  () => userStore.getUser,
  () => {
    user.value = userStore.getUser;
  }
);
//#endregion

//#region Lifecycle Hooks
onBeforeMount(() => {
  updateGreeting();
  updateSiteAdminVisibility();
});
onBeforeUpdate(() => {
  updateSiteAdminVisibility();
});
//#endregion
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
  content: "\a";
  white-space: pre;
}

.list-item {
  text-align: center;
  padding: 0;
  margin: 0;
}
.white--text {
  padding-left: 25px;
  padding-right: 25px;
  padding-bottom: 5px;
}
</style>
