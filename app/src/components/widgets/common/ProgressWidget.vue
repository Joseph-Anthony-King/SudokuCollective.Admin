<template>
	<div class="d-flex ma-12 pa-12 justify-center">
		<v-progress-circular
			indeterminate
			color="primary"
			:size="100"
			:width="10"
			class="progress-circular"
		></v-progress-circular>
	</div>
	<div class="d-flex ma-12 pa-12 justify-center">
		<h1>{{ processingMessage }}</h1>
	</div>
</template>

<script lang='ts'>
	import { defineComponent, ref, watch } from 'vue';
	import store from '@/store';

	export default defineComponent({
		name: 'ProgressWidget',
		setup() {
			let processingMessage = ref(store.getters['getProcessingMessage']);
			watch(
				() => store.getters['getProcessingMessage'], 
				function() {
					processingMessage.value = store.getters['getProcessingMessage'];});
			return {
				processingMessage
			}
		}
	});
</script>