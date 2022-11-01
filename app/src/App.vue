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
  import { defineComponent, provide, ref } from 'vue';
  import { onMounted, onBeforeMount } from '@vue/runtime-core';
  import store from '@/store';
  import AppBar from '@/components/navigation/AppBar.vue';
  import FooterNav from '@/components/navigation/FooterNav.vue';
  import { GamesConnector } from '@/connectors/gamesConnector';
  import { IndexConnector } from '@/connectors/indexConnector';
  import { SolutionsConnector } from '@/connectors/solutionsConnector';
  import { ValuesConnector } from '@/connectors/valuesConnector';
  import { ValuesService } from '@/services/valuesService';
  import { StaticMethods } from '@/utilities/common';
  import { GamesService } from './services/gamesService';

  export default defineComponent({
    name: 'App',
    components: { AppBar, FooterNav },
    setup() {
      const gamesConnector = ref(new GamesConnector());
      const indexConnector = ref(new IndexConnector());
      const solutionsConnector = ref(new SolutionsConnector());
      const valuesConnector = ref(new ValuesConnector());
      const gameService = ref(
        new GamesService(gamesConnector.value, solutionsConnector.value)
      );
      const valuesService = ref(
        new ValuesService(indexConnector.value, valuesConnector.value)
      );
      onBeforeMount(() => {
        provide('gamesService', gameService.value);
        provide('valuesService', valuesService.value);
      });
      onMounted(() => {
        store.dispatch('addLicense', StaticMethods.getLicense());
        store.dispatch('valuesModule/initializeModuleAsync', valuesService.value);
        store.dispatch('sudokuModule/initializeModule');
      });
    },
  });
</script>

<style lang="scss">
  @import '@/assets/styles/site.scss';
</style>
