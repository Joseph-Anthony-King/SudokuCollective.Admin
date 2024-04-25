<template>
  <SudokuWidget />
</template>

<script setup lang="ts">
  /* eslint-disable no-undef */
  /* eslint-disable no-unused-vars */
  import { onBeforeMount, watch } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useRoute } from 'vue-router';
  import router from '@/router/index';
  import { useUserStore } from '@/stores/userStore';
  import SudokuWidget from '@/components/widgets/sudoku/SudokuWidget.vue';
  import commonUtitlities from '@/utilities/common';
  import { User } from '@/models/domain/user';

  const props = defineProps({
    action: {
      type: String,
      default: '',
    },
  });

  const { updateUrlWithAction } = commonUtitlities();
  const route = useRoute();

  const userStore = useUserStore();
  const { getUser, getUserIsLoggingIn, getUserIsSigningUp } = storeToRefs(userStore);
  const { updateUser } = userStore;

  watch(
    () => getUserIsLoggingIn.value,
    (newValue, oldValue) => {
      const userIsLoggingIn: boolean = newValue;
      updateUrlWithAction(userIsLoggingIn, '/sudoku', 'login', router, route);
    },
    {
      immediate: true,
      deep: true,
    },
  );
  watch(
    () => getUserIsSigningUp.value,
    (newValue, oldValue) => {
      const userIsSigningUp: boolean = newValue;
      updateUrlWithAction(userIsSigningUp, '/sudoku', 'signup', router, route);
    },
    {
      immediate: true,
      deep: true,
    },
  );

  onBeforeMount(() => {
    if (router.options.history.state.position === 1) {
      const user: User = getUser.value;
      if (props.action.toLowerCase() === 'login') {
        user.isLoggingIn = true;
      } else if (props.action.toLowerCase() === 'signup') {
        user.isSigningUp = true;
      }
      updateUser(user);
    }
  });
</script>
