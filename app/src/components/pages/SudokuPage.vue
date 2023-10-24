<template>
  <v-container fluid class="app-responsive-viewport">
    <SudokuWidget />
  </v-container>
</template>

<script setup lang="ts">
import { onBeforeMount, watch } from "vue";
import { useRoute } from "vue-router";
import router from "@/router/index";
import { useUserStore } from "@/store/userStore";
import SudokuWidget from "@/components/widgets/sudoku/SudokuWidget.vue";
import commonUtitlities from "@/utilities/common";
import { User } from "@/models/domain/user";

const props = defineProps({
  action: {
    type: String,
    default: "",
  },
});

const userStore = useUserStore();
const route = useRoute();
const { updateUrlWithAction } = commonUtitlities();

watch(
  () => userStore.getUserIsLoggingIn,
  () => {
    const userIsLoggingIn: boolean = userStore.getUserIsLoggingIn;
    updateUrlWithAction(userIsLoggingIn, "/sudoku", "login", router, route);
  }
);
watch(
  () => userStore.getUserIsSigningUp,
  () => {
    const userIsSigningUp: boolean = userStore.getUserIsSigningUp;
    updateUrlWithAction(userIsSigningUp, "/sudoku", "signup", router, route);
  }
);
// Lifecycle hooks
onBeforeMount(() => {
  if (router.options.history.state.position === 1) {
    const user: User = userStore.getUser;
    if (props.action.toLowerCase() === "login") {
      user.isLoggingIn = true;
      userStore.updateUser(user);
    } else if (props.action.toLowerCase() === "signup") {
      user.isSigningUp = true;
      userStore.updateUser(user);
    }
  }
});
</script>
