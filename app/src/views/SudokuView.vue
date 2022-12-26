<template>
  <sudoku-page />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SudokuPage from "@/components/pages/SudokuPage.vue";

export default defineComponent({
  name: "SudokuView",
  components: { SudokuPage },
});
</script>
