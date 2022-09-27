<template>
  <v-app>
    <div class="app-viewport">
      <AppBar />
      <v-main>
        <router-view />
      </v-main>
    </div>
    <div>
      <v-footer>
        <FooterNav />
      </v-footer>
    </div>
  </v-app>
</template>

<script lang='ts'>
  import { defineComponent, provide, ref } from 'vue';
  import { onMounted, onBeforeMount } from '@vue/runtime-core';
  import store from '@/store';
  import AppBar from '@/components/navigation/AppBar.vue';
  import FooterNav from '@/components/navigation/Footer.vue';
  import { IndexConnector } from '@/connectors/indexConnector';
  import { ValuesConnector } from '@/connectors/valuesConnector';
  import { ValuesService } from '@/services/valuesService';
  import { StaticMethods } from '@/utilities/common';

  export default defineComponent({
    name: 'App',
    components: { AppBar, FooterNav },
    setup() {
      const indexConnector = ref(new IndexConnector());
      const valuesConnector = ref(new ValuesConnector());
      const valuesService = ref(
        new ValuesService(indexConnector.value, valuesConnector.value)
      );
      onBeforeMount(() => {
        provide('valuesService', valuesService.value);
      });
      onMounted(() => {
        store.dispatch('addLicense', StaticMethods.getLicense());
        store.dispatch('valuesModule/initializeModule', valuesService.value);
        store.dispatch('sudokuModule/initializeModule');
      });
    },
  });
</script>

<style lang='scss'>
  .app-viewport {
    @media (max-width: 600px) {
      min-width: 100%;
    }
    @media (min-width: 1921px) {
      display: flex;
      margin-left: auto !important;
      margin-right: auto !important;
      max-width: 60% !important;
      min-width: 60% !important;
    }
  }
  a {
    text-decoration: none;
    color: #1976d2;
  }
</style>
