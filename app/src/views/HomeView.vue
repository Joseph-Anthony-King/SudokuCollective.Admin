<template>
  <home-page :action="action" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HomePage from "@/components/pages/HomePage.vue";

export default defineComponent({
  name: "HomeView",
  props: {
    action: {
      type: String,
      default: ""
    },
  },
  components: {
    HomePage,
  },
});
</script>
