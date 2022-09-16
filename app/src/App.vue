<template>
  <v-app>
    <div class="app-viewport">
      <AppBar />
      <v-main>
        <router-view/>
      </v-main>
    </div>
  </v-app>
</template>

<script lang='ts'>
  import { defineComponent, provide, ref } from 'vue';
  import { onMounted, onBeforeMount } from '@vue/runtime-core';
  import store from '@/store';
  import AppBar from '@/components/navigation/AppBar.vue';
  import { IndexConnector } from '@/connectors/IndexConnector';
  import { ValuesConnector } from '@/connectors/ValuesConnector';
  import { ValuesService } from '@/services/ValuesService';

  export default defineComponent({
    name: 'App',
    components: { AppBar },
    setup() {
      const indexConnector = ref(new IndexConnector());
      const valuesConnector = ref(new ValuesConnector());
      const valuesService = ref(new ValuesService(indexConnector.value, valuesConnector.value));
      onBeforeMount(() => {
        provide('valuesService', valuesService.value);
      });
      onMounted(() => {
        store.dispatch('addLicense', process.env.VUE_APP_LICENSE);
        store.dispatch('valuesModule/getValues', valuesService.value);
      });
    }
  }); 
</script>

<style lang='scss'>
  .app-viewport{
    @media (max-width: 600px) {
      min-width: 125%;
    }
    @media (min-width: 1904px) {
      display: flex;
      margin-left: auto !important;
      margin-right: auto !important;
      max-width: 60% !important;
      min-width: 60% !important;
    }
  }
  a {
    text-decoration: none;
    color: #1976D2;
  }
</style>
