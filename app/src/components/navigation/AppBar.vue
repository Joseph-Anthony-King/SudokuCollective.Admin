<template>
  <v-app-bar
    app
    color="primary"
    dark>
    <div class="d-flex app-bar-viewport">
      <v-app-bar-nav-icon
        v-if="user.isLoggedIn && $vuetify.display.smAndDown"
        @click="updateNavDrawerHandler($event)">
      </v-app-bar-nav-icon>
      <v-app-bar-title>
        <router-link
          to="/"
          class="inline-flex">
          <v-img
            alt="Vuetify Logo"
            class="shrink mr-2 header-logo"
            contain
            src="/images/logo.png"
            transition="scale-transition"
            width="40" />
          <span class="nav-text"> Sudoku Collective Admin Console </span>
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
            <div
              v-for="(link, index) in interiorLinks"
              :key="index">
              <v-tooltip
                open-delay="2000"
                location="start"
                v-if="link.condition"
                :disabled="isSmallViewPort">
                <template v-slot:activator="{ props }">
                  <v-list-item v-bind="props">
                    <v-list-item-title>
                      <a
                        :href="link.url"
                        :target="link.target"
                        class="menu-item">
                        <v-icon>{{ link.mdiIcon }}</v-icon>
                        <span class="mr-2">{{ link.title }}</span>
                      </a>
                    </v-list-item-title>
                  </v-list-item>
                </template>
                <span>{{ link.tooltip }}</span>
              </v-tooltip>
            </div>
            <v-tooltip
              open-delay="2000"
              location="start"
              v-if="!user.isLoggedIn"
              :disabled="isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props">
                  <v-list-item-title>
                    <div
                      class="menu-item"
                      @click="loginHandler($event)">
                      <v-icon>mdi-login-variant</v-icon>
                      <span class="mr-2">Login</span>
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </template>
              <span>Login to SudokuCollective.com</span>
            </v-tooltip>
            <v-tooltip
              open-delay="2000"
              location="start"
              v-if="!user.isLoggedIn"
              :disabled="isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props">
                  <v-list-item-title>
                    <div
                      class="menu-item"
                      @click="signUpHandler($event)">
                      <v-icon>mdi-account-plus</v-icon>
                      <span class="mr-2">Sign Up</span>
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </template>
              <span>Sign up with SudokuCollective.com</span>
            </v-tooltip>
            <v-tooltip
              open-delay="2000"
              location="start"
              v-if="user.isLoggedIn"
              :disabled="isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props">
                  <v-list-item-title>
                    <div
                      class="menu-item"
                      @click="confirmLogoutHandler">
                      <v-icon>mdi-logout-variant</v-icon>
                      <span class="mr-2">Log Out</span>
                    </div>
                  </v-list-item-title>
                </v-list-item>
              </template>
              <span>Log out of SudokuCollective.com</span>
            </v-tooltip>
            <hr
              v-if="exteriorLinks.length > 1"
              class="mx-2" />
            <v-tooltip
              open-delay="2000"
              location="start"
              :disabled="isSmallViewPort">
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-if="exteriorLinks.length > 1"
                  v-bind="props">
                  <v-menu
                    left
                    bottom>
                    <template v-slot:activator="{ props }">
                      <div
                        class="menu-item"
                        v-bind="props">
                        <span class="mr-2">Links</span>
                      </div>
                    </template>
                    <v-list class="menu-link-list">
                      <!-- outside links -->
                      <div
                        v-for="(link, index) in exteriorLinks"
                        :key="index">
                        <v-tooltip
                          open-delay="2000"
                          location="start"
                          v-if="link.condition"
                          :disabled="isSmallViewPort">
                          <template v-slot:activator="{ props }">
                            <v-list-item v-bind="props">
                              <v-list-item-title>
                                <a
                                  :href="link.url"
                                  :target="link.target"
                                  class="menu-item">
                                  <v-icon>{{ link.mdiIcon }}</v-icon>
                                  <span class="mr-2">{{ link.title }}</span>
                                </a>
                              </v-list-item-title>
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
</template>

<script setup lang="ts">
  /* eslint-disable no-undef */
  /* eslint-disable no-unused-vars */
  import { type Ref, ref, watch, onMounted, onUnmounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useDialogStore } from '@/stores/dialogStore';
  import { useUserStore } from '@/stores/userStore';
  import { User } from '@/models/domain/user';
  import { MenuItem } from '@/models/infrastructure/menuItem';
  import { DialogType } from '@/enums/dialogType';
  import { ExteriorLinks } from '@/utilities/links/exteriorLinks';
  import { InteriorLinks } from '@/utilities/links/interiorLinks';
  import commonUtilities from '@/utilities/common';

  const emit = defineEmits(['user-logging-in', 'user-signing-up', 'update-nav-drawer']);

  const { resetViewPort } = commonUtilities();

  //#region Destructure Stores
  //#region UserStore
  const userStore = useUserStore();
  const { getUser } = storeToRefs(userStore);
  const { updateUserIsLoggingOut } = userStore;
  //#endregion
  //#region DialogStore
  const dialogStore = useDialogStore();
  const { updateDialog } = dialogStore;
  //#endregion
  //#endregion

  //#region Properties
  const user: Ref<User> = ref(getUser.value);
  const interiorLinks: Ref<MenuItem[]> = ref(InteriorLinks);
  const exteriorLinks: Ref<MenuItem[]> = ref(ExteriorLinks);
  const isSmallViewPort: Ref<boolean> = ref(true);
  //#endregion

  //#region Action Handlers
  const loginHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    emit('user-logging-in', null, null);
  };
  const confirmLogoutHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    updateDialog(
      'Confirm Logout',
      `Are you sure you want to log out ${user.value.userName}?`,
      DialogType.CONFIRM,
      () => updateUserIsLoggingOut(true),
      () => updateUserIsLoggingOut(false),
    );
  };
  const signUpHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    emit('user-signing-up', null, null);
  };
  const updateNavDrawerHandler = (event: Event | null = null): void => {
    event?.preventDefault();
    emit('update-nav-drawer', null, null);
  };

  watch(
    () => getUser.value,
    (newValue, oldValue) => {
      user.value = newValue;
    },
    {
      immediate: true,
      deep: true,
    },
  );
  //#endregion

  //#region Lifecycle Hooks
  onMounted(async () => {
    resetViewPort(isSmallViewPort);
    let resizeTimeout: number | undefined;
    window.addEventListener(
      'resize',
      () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(
          () => {
            resetViewPort(isSmallViewPort);
          },
          250,
          'Resized',
        );
      },
      { once: true },
    );
  });
  onUnmounted(() => {
    window.removeEventListener('resize', () => {
      resetViewPort(isSmallViewPort);
    });
  });
  //#endregion
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
