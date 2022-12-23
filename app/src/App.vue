<template>
  <v-app>
    <div class="app-viewport">
      <app-bar
        v-on:user-logging-in="user.isLoggingIn = true"
        v-on:user-logging-out="logout"
      />
      <v-main>
        <router-view />
        <v-dialog
          v-model="user.isLoggingIn"
          persistent
          :fullscreen="isSmallViewPort"
          :max-width="maxDialogWidth"
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <LoginForm v-on:cancel-login="user.isLoggingIn = false" />
        </v-dialog>
      </v-main>
    </div>
    <div>
      <v-footer>
        <footer-nav />
      </v-footer>
    </div>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  onMounted,
  onUnmounted,
  Ref,
  ref,
  toRaw,
  watch,
} from "@vue/runtime-core";
import store from "@/store";
import AppBar from "@/components/navigation/AppBar.vue";
import FooterNav from "@/components/navigation/FooterNav.vue";
import LoginForm from "@/components/forms/LoginForm.vue";
import { User } from "@/models/domain/user";
import { StaticMethods } from "@/utilities/common";

export default defineComponent({
  name: "App",
  components: { AppBar, FooterNav, LoginForm },
  setup() {
    const isSmallViewPort: Ref<boolean> = ref(false);
    const maxDialogWidth: Ref<string> = ref("");
    const user: Ref<User> = ref(new User());
    const resetAppViewPort = (): void => {
      if (window.innerWidth <= 960) {
        isSmallViewPort.value = true;
        maxDialogWidth.value = "auto";
      } else {
        isSmallViewPort.value = false;
        maxDialogWidth.value = "960px";
      }
    };
    const logout = (): void => {
      user.value.logout();
      store.dispatch("appModule/updateUser", user.value);
    };
    watch(
      () => store.getters["appModule/getUser"],
      function () {
        user.value = toRaw(store.getters["appModule/getUser"]);
      }
    );
    watch(
      () => store.getters["appModule/getUserIsLoggedIn"],
      function () {
        const isLoggedIn = toRaw(store.getters["appModule/getUserIsLoggedIn"]);
        if (isLoggedIn) {
          const user = toRaw(store.getters["appModule/getUser"]) as User;
          alert(`Welcome back ${user.userName}!`);
        }
      }
    );
    onMounted(() => {
      store.dispatch("appModule/addLicense", StaticMethods.getLicense());
      store.dispatch("appModule/updateUser", user.value);
      store.dispatch("valuesModule/initializeModuleAsync");
      store.dispatch("sudokuModule/initializeModule");
      resetAppViewPort();
      window.addEventListener("resize", () => {
        resetAppViewPort();
      });
    });
    onUnmounted(() => {
      window.removeEventListener("resize", () => {
        resetAppViewPort();
      });
    });
    return {
      isSmallViewPort,
      maxDialogWidth,
      user,
      logout,
    };
  },
});
</script>

<style lang="scss">
@import "@/assets/styles/site.scss";
</style>
