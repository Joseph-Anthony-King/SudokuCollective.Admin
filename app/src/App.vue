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
          <LoginForm
            :formStatus="user.isLoggingIn"
            v-on:cancel-login="user.isLoggingIn = false"
          />
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
  computed,
  ComputedRef,
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
    const user: Ref<User> = ref(
      toRaw(store.getters["appModule/getUser"]) as User
    );
    const isSmallViewPort: Ref<boolean> = ref(true);
    const maxDialogWidth: Ref<string> = ref("auto");
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
      store.dispatch("appModule/logout");
      store.dispatch("appModule/updateToken", "");
    };
    const userIsLoggingIn: ComputedRef<boolean> = computed(() => {
      return user.value?.isLoggingIn;
    });
    watch(
      () => store.getters["appModule/getUser"],
      () => {
        user.value = toRaw(store.getters["appModule/getUser"]) as User;
      }
    );
    watch(
      () => store.getters["appModule/getUserIsLoggedIn"],
      () => {
        const isLoggedIn = toRaw(store.getters["appModule/getUserIsLoggedIn"]);
        if (isLoggedIn) {
          user.value = toRaw(store.getters["appModule/getUser"]) as User;
          alert(`Welcome back ${user.value.userName}!`);
        }
      }
    );
    onMounted(() => {
      store.dispatch("appModule/addLicense", StaticMethods.getLicense());
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
      userIsLoggingIn
    };
  },
});
</script>

<style lang="scss">
@import "@/assets/styles/site.scss";
</style>
