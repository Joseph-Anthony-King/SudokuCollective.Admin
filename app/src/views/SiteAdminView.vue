<template>
  <SiteAdminPage />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SiteAdminPage from "@/components/pages/SiteAdminPage.vue";

export default defineComponent({
  name: "SiteAdminView",
  components: {
    SiteAdminPage,
  },
});
</script>
