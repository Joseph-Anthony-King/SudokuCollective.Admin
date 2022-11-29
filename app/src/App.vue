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
  import { onMounted } from '@vue/runtime-core';
  import store from '@/store';
  import AppBar from '@/components/navigation/AppBar.vue';
  import FooterNav from '@/components/navigation/FooterNav.vue';
  import { StaticMethods } from '@/utilities/common';

  export default defineComponent({
    name: 'App',
    components: { AppBar, FooterNav },
    setup() {
      onMounted(() => {
        store.dispatch('addLicense', StaticMethods.getLicense());
        store.dispatch('valuesModule/initializeModuleAsync');
        store.dispatch('sudokuModule/initializeModule');
      });
    },
  });
</script>

<style lang="scss">
  @import '@/assets/styles/site.scss';
</style>
