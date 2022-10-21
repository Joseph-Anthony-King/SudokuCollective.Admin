<template>
  <ProgressWidget v-if="loading" />
  <sudoku-widget v-show="!loading"/>
</template>

<script lang='ts'>
  import { defineComponent, Ref, ref, watch } from 'vue';
  import store from '@/store';
	import ProgressWidget from '@/components/widgets/common/ProgressWidget.vue';
  import SudokuWidget from '@/components/widgets/sudoku/SudokuWidget.vue';

  export default defineComponent({
    name: 'SudokuPage',
		components: { ProgressWidget, SudokuWidget},
    setup() {
			let loading: Ref<boolean> = ref(store.getters['sudukuModule/getProcessing']);
      watch(
        () => store.getters['sudokuModule/getProcessing'],
        function () {
          loading.value = store.getters['sudokuModule/getProcessing'];
        }
      );
      return {
				loading,
      }
    }
  });
</script>
