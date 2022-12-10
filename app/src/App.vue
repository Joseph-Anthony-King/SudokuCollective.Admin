<template>
  <v-app>
    <div class="app-viewport">
      <app-bar v-on:user-logging-in="(user.isLoggingIn = true)"/>
      <v-main>
        <router-view />
        <v-dialog 
          v-model="user.isLoggingIn" 
          persistent 
          :fullscreen="isSmallViewPort"
          :max-width="maxDialogWidth"
          hide-overlay 
          transition="dialog-bottom-transition">
          <LoginForm v-on:cancel-login="(user.isLoggingIn = false)" />
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
  import { defineComponent } from 'vue';
  import { onMounted, onUnmounted, reactive, Ref, ref } from '@vue/runtime-core';
  import store from '@/store';
  import AppBar from '@/components/navigation/AppBar.vue';
  import FooterNav from '@/components/navigation/FooterNav.vue';
  import LoginForm from '@/components/forms/LoginForm.vue';
  import { User } from '@/models/domain/user';
  import { StaticMethods } from '@/utilities/common';

  export default defineComponent({
    name: 'App',
    components: { AppBar, FooterNav, LoginForm },
    setup() {
      let isSmallViewPort: Ref<boolean> = ref(false);
      let maxDialogWidth: Ref<string> = ref('');
      const user = reactive(new User());
      const resetAppViewPort = (): void => {
        if (window.innerWidth <= 960) {
          isSmallViewPort.value = true;
          maxDialogWidth.value = 'auto';
        } else {
          isSmallViewPort.value = false;
          maxDialogWidth.value = '600px';
        }
      };
      onMounted(() => {
        store.dispatch('addLicense', StaticMethods.getLicense());
        store.dispatch('updateUser', user);
        store.dispatch('valuesModule/initializeModuleAsync');
        store.dispatch('sudokuModule/initializeModule');
        resetAppViewPort();
        window.addEventListener('resize', () => {
          resetAppViewPort();
        });
      });
      onUnmounted(() => {
        window.removeEventListener('resize', () => {
          resetAppViewPort();
        });
      });
      return {
        isSmallViewPort,
        maxDialogWidth,
        user
      };
    },
  });
</script>

<style lang="scss">
  @import '@/assets/styles/site.scss';
</style>
