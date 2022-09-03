<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
  import { defineComponent, provide, ref } from "vue";
  import { onMounted, onBeforeMount } from "@vue/runtime-core";
  import { IndexService } from "./services/IndexService";
  import { ValuesService } from "./services/ValuesService";
  import { useStore } from "vuex"

  export default defineComponent({
    name: "App",
    setup() {
      const indexService = ref(new IndexService());
      const valuesService = ref(new ValuesService());
      onBeforeMount(() => {
        provide("indexService", indexService.value);
        provide("valuesService", valuesService.value);
      });
      onMounted(() => {
        const store = useStore();
        store.dispatch("getValues", { indexService: indexService.value, valuesService: valuesService.value });
      });
    }
  }); 
</script>
