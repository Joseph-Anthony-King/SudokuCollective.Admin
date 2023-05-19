<template>
  <v-container fluid class='app-responsive-viewport'>
    <progress-widget v-if='loading' />
    <sudoku-widget v-show='!loading' />
  </v-container>
</template>

<script lang='ts'>
import { defineComponent, onBeforeMount, Ref, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAppStore } from '@/store/appStore/index';
import { useSudokuStore } from '@/store/sudokuStore/index';
import { useUserStore } from '@/store/userStore/index';
import ProgressWidget from '@/components/widgets/common/ProgressWidget.vue';
import SudokuWidget from '@/components/widgets/sudoku/SudokuWidget.vue';
import commonUtitlities from '@/utilities/common';
import { User } from '@/models/domain/user';

export default defineComponent({
  name: 'SudokuPage',
  components: { ProgressWidget, SudokuWidget },
  props: {
    action: {
      type: String,
      default: ''
    },
  },
  setup(props) {
    const appStore = useAppStore();
    const sudokuStore = useSudokuStore();
    const userStore = useUserStore();
    const router = useRouter();
    const route = useRoute();
    const { updateUrlWithAction } = commonUtitlities();
    let loading: Ref<boolean> = ref(
      sudokuStore.getProcessing
    );
    watch(
      () => sudokuStore.getProcessing,
      () => {
        loading.value = sudokuStore.getProcessing;
      }
    );
    watch(
      () => userStore.getUserIsLoggingIn,
      () => {
        const userIsLoggingIn: boolean = userStore.getUserIsLoggingIn;
        updateUrlWithAction(
          userIsLoggingIn,
          '/sudoku',
          'login',
          router,
          route);
      }
    )
    onBeforeMount(() => {
      appStore.updateProcessingMessage('processing, please do not navigate away');
      if (props.action.toLowerCase() === 'login') {
        const user: User = userStore.getUser;
        user.isLoggingIn = true;
        userStore.updateUser(user)
      }
    });
    return {
      loading,
    };
  },
});
</script>
