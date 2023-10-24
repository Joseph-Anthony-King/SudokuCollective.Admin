<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex app-bar-viewport">
      <v-app-bar-nav-icon
        v-if="user.isLoggedIn && $vuetify.display.smAndDown"
        @click="updateNavDrawerHandler($event)"
      >
      </v-app-bar-nav-icon>
      <v-app-bar-title>
        <router-link to="/" class="inline-flex">
          <v-img
            alt="Vuetify Logo"
            class="shrink mr-2 header-logo"
            contain
            src="/images/logo.png"
            transition="scale-transition"
            width="40"
          />
          <span class="nav-text"> Sudoku Collective Admin Vue </span>
        </router-link>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <div class="inline-flex">
        <v-menu bottom>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props">
              <span class="mr-2 menu-text">Menu</span>
              <v-btn icon="mdi-dots-vertical"></v-btn>
            </v-btn>
          </template>
          <v-list>
            <div v-for="(link, index) in interiorLinks" :key="index">
              <v-tooltip
                open-delay="2000"
                location="start"
                v-if="link.condition"
                :disabled="isSmallViewPort"
              >
                <template v-slot:activator="{ props }">
                  <v-list-item v-bind="props">
                    <v-list-item-content>
                      <v-list-item-title>
                        <a
                          :href="link.url"
                          :target="link.target"
                          class="menu-item"
                        >
                          <v-icon>{{ link.mdiIcon }}</v-icon>
                          <span class="mr-2">{{ link.title }}</span>
                        </a>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <span>{{ link.tooltip }}</span>
              </v-tooltip>
            </div>
            <v-tooltip
              open-delay="2000"
              location="start"
              v-if="!user.isLoggedIn"
              :disabled="isSmallViewPort"
            >
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props">
                  <v-list-item-content>
                    <v-list-item-title>
                      <div class="menu-item" @click="loginHandler($event)">
                        <v-icon>mdi-login-variant</v-icon>
                        <span class="mr-2">Login</span>
                      </div>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <span>Login to SudokuCollective.com</span>
            </v-tooltip>
            <v-tooltip
              open-delay="2000"
              location="start"
              v-if="!user.isLoggedIn"
              :disabled="isSmallViewPort"
            >
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props">
                  <v-list-item-content>
                    <v-list-item-title>
                      <div class="menu-item" @click="signUpHandler($event)">
                        <v-icon>mdi-account-plus</v-icon>
                        <span class="mr-2">Sign Up</span>
                      </div>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <span>Sign up with SudokuCollective.com</span>
            </v-tooltip>
            <v-tooltip
              open-delay="2000"
              location="start"
              v-if="user.isLoggedIn"
              :disabled="isSmallViewPort"
            >
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props">
                  <v-list-item-content>
                    <v-list-item-title>
                      <div class="menu-item" @click="confirmUserLogout = true">
                        <v-icon>mdi-logout-variant</v-icon>
                        <span class="mr-2">Log Out</span>
                      </div>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <span>Log out of SudokuCollective.com</span>
            </v-tooltip>
            <hr v-if="exteriorLinks.length > 1" class="mx-2" />
            <v-tooltip open-delay="2000" location="start" :disabled="isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-list-item v-if="exteriorLinks.length > 1" v-bind="props">
                  <v-menu left bottom>
                    <template v-slot:activator="{ props }">
                      <div class="menu-item" v-bind="props">
                        <span class="mr-2">Links</span>
                      </div>
                    </template>
                    <v-list class="menu-link-list">
                      <!-- outside links -->
                      <div v-for="(link, index) in exteriorLinks" :key="index">
                        <v-tooltip
                          open-delay="2000"
                          location="start"
                          v-if="link.condition"
                          :disabled="isSmallViewPort"
                        >
                          <template v-slot:activator="{ props }">
                            <v-list-item v-bind="props">
                              <v-list-item-content>
                                <v-list-item-title>
                                  <a
                                    :href="link.url"
                                    :target="link.target"
                                    class="menu-item"
                                  >
                                    <v-icon>{{ link.mdiIcon }}</v-icon>
                                    <span class="mr-2">{{ link.title }}</span>
                                  </a>
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </template>
                          <span>{{ link.tooltip }}</span>
                        </v-tooltip>
                      </div>
                    </v-list>
                  </v-menu>
                </v-list-item>
              </template>
              <span>Links to sites and resources</span>
            </v-tooltip>
          </v-list>
        </v-menu>
      </div>
    </div>
  </v-app-bar>
  <v-dialog
    v-model="confirmUserLogout"
    persistent
    :fullscreen="isSmallViewPort"
    :max-width="maxDialogWidth"
    hide-overlay
    transition="dialog-top-transition"
  >
    <ConfirmDialog
      title="Confirm Logout"
      :message="confirmMessage"
      v-on:action-confirmed="logoutHandler"
      v-on:action-not-confirmed="confirmUserLogout = false"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import {
  Ref,
  ref,
  ComputedRef,
  computed,
  watch,
  onMounted,
  onUnmounted,
} from "vue";
import { useUserStore } from "@/store/userStore";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog.vue";
import { User } from "@/models/domain/user";
import { MenuItem } from "@/models/infrastructure/menuItem";
import { ExteriorLinks } from "@/utilities/links/exteriorLinks";
import { InteriorLinks } from "@/utilities/links/interiorLinks";
import commonUtilities from "@/utilities/common";

const emit = defineEmits([
  "user-logging-in",
  "user-logging-out",
  "user-signing-up",
  "update-nav-drawer",
]);

// Instantiate the stores
const userStore = useUserStore();

const { resetViewPort } = commonUtilities();

const user: Ref<User> = ref(userStore.getUser);
const interiorLinks: Ref<MenuItem[]> = ref(InteriorLinks);
const exteriorLinks: Ref<MenuItem[]> = ref(ExteriorLinks);
const isSmallViewPort: Ref<boolean> = ref(true);
const maxDialogWidth: Ref<string> = ref("auto");
const confirmUserLogout: Ref<boolean> = ref(false);
const confirmMessage: ComputedRef<string> = computed(() => {
  return `Are you sure you want to log out ${user.value.userName}?`;
});

// Actions
const loginHandler = (event: Event | null = null): void => {
  event?.preventDefault();
  emit("user-logging-in", null, null);
};
const logoutHandler = (event: Event | null = null): void => {
  event?.preventDefault();
  confirmUserLogout.value = false;
  emit("user-logging-out", null, null);
};
const signUpHandler = (event: Event | null = null): void => {
  event?.preventDefault();
  emit("user-signing-up", null, null);
};
const updateNavDrawerHandler = (event: Event | null = null): void => {
  event?.preventDefault();
  emit("update-nav-drawer", null, null);
};

watch(
  () => userStore.getUser,
  () => {
    user.value = userStore.getUser;
  }
);
// Lifecycle hooks
onMounted(async () => {
  resetViewPort(isSmallViewPort, maxDialogWidth);
  let resizeTimeout: number | undefined;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(
      () => {
        resetViewPort(isSmallViewPort, maxDialogWidth);
      },
      250,
      "Resized"
    );
  });
});
onUnmounted(() => {
  window.removeEventListener("resize", () => {
    resetViewPort(isSmallViewPort, maxDialogWidth);
  });
});
</script>

<style lang="scss" scoped>
.app-bar-viewport {
  display: flex;
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
  min-width: 100%;
}
.inline-flex {
  display: inline-flex;
}
.header-logo {
  margin: 0 0 0 10px;
}
.nav-text {
  color: #fff;
  font-size: x-large;
  font-weight: bolder;
  text-shadow: 2px 2px var(--v-secondary);
  margin: auto;
  padding: auto;
  @media (max-width: 1264px) {
    display: none;
  }
}
.menu-text {
  color: #fff;
  text-shadow: 2px 2px var(--v-secondary);
  margin: auto;
  padding: auto;
}
.menu-item {
  text-decoration: none !important;
  color: #63666a;
  cursor: pointer;
}
</style>
