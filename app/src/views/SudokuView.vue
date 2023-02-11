<template>
  <sudoku-page :action="action"/>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SudokuPage from "@/components/pages/SudokuPage.vue";

export default defineComponent({
  name: "SudokuView",
  props: {
    action: {
      type: String,
      default: ""
    },
  },
  components: { SudokuPage },
});
</script>
