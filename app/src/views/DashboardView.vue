<template>
  <DashboardPage />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DashboardPage from "@/components/pages/DashboardPage.vue";

export default defineComponent({
  name: "DashboardView",
  components: {
    DashboardPage,
  },
});
</script>
