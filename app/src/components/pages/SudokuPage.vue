<template>
  <v-container fluid class='app-responsive-viewport'>
    <sudoku-widget />
  </v-container>
</template>

<script setup lang='ts'>
import { 
  onBeforeMount, 
  watch 
} from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router/index';
import { useAppStore } from '@/store/appStore/index';
import { useSudokuStore } from '@/store/sudokuStore/index';
import { useUserStore } from '@/store/userStore/index';
import SudokuWidget from '@/components/widgets/sudoku/SudokuWidget.vue';
import commonUtitlities from '@/utilities/common';
import { User } from '@/models/domain/user';

const props = defineProps({
  action: {
    type: String,
    default: ''
  },
});

const appStore = useAppStore();
const sudokuStore = useSudokuStore();
const userStore = useUserStore();
const route = useRoute();
const { updateUrlWithAction } = commonUtitlities();
watch(
  () => sudokuStore.getProcessing,
  () => {
    appStore.updateProcessingStatus(sudokuStore.getProcessing);
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
);
watch(
  () => userStore.getUserIsSigningUp,
  () => {
    const userIsSigningUp: boolean = userStore.getUserIsSigningUp;
    updateUrlWithAction(
      userIsSigningUp,
      '/sudoku',
      'signup',
      router,
      route);
  }
);
onBeforeMount(() => {
  appStore.updateProcessingMessage('processing, please do not navigate away');
  if (props.action.toLowerCase() === 'login') {
    const user: User = userStore.getUser;
    user.isLoggingIn = true;
    userStore.updateUser(user)
  } else if (props.action.toLowerCase() === 'signup') {
    const user = new User();
    user.isSigningUp = true;
    userStore.updateUser(user);
  }
});
</script>
