<template>
  <v-app>
    <div class="app-viewport">
      <app-bar />
      <v-main>
        <router-view />
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
  import { onMounted, ref } from '@vue/runtime-core';
  import store from '@/store';
  import AppBar from '@/components/navigation/AppBar.vue';
  import FooterNav from '@/components/navigation/FooterNav.vue';
  import { User } from '@/models/domain/user';
  import { StaticMethods } from '@/utilities/common';

  export default defineComponent({
    name: 'App',
    components: { AppBar, FooterNav },
    setup() {
      const user = ref(new User());
      onMounted(() => {
        store.dispatch('addLicense', StaticMethods.getLicense());
        store.dispatch('addUser', user);
        store.dispatch('valuesModule/initializeModuleAsync');
        store.dispatch('sudokuModule/initializeModule');
      });
    },
  });
</script>

<style lang="scss">
  @import '@/assets/styles/site.scss';
</style>
