<template>
  <HeroWidget headline="Welcome to Sudoku Collective Admin Vue">
    <v-row>
      <v-col cols="12">
        <p class="motto text-center text-padding">
          Code, Create, Inspire...
        </p>
        <p
          class="description text-center text-padding"
          v-html="missionStatement"
        ></p>
      </v-col>
    </v-row>
  </HeroWidget>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch } from "vue";
import { useRoute } from "vue-router";
import router from "@/router/index";
import { useUserStore } from "@/store/userStore";
import { useValuesStore } from "@/store/valuesStore";
import HeroWidget from "@/components/widgets/common/HeroWidget.vue";
import commonUtitlities from "@/utilities/common";
import { User } from "@/models/domain/user";

const props = defineProps({
  action: {
    type: String,
    default: "",
  },
});

const userStore = useUserStore();
const valuesStore = useValuesStore();
const route = useRoute();
const { updateUrlWithAction } = commonUtitlities();
const missionStatement = ref(valuesStore.getMissionStatement);

watch(
  () => valuesStore.getMissionStatement,
  () => {
    missionStatement.value = valuesStore.getMissionStatement;
  }
);
watch(
  () => userStore.getUserIsLoggingIn,
  () => {
    const userIsLoggingIn: boolean = userStore.getUserIsLoggingIn;
    updateUrlWithAction(userIsLoggingIn, "/", "login", router, route);
  }
);
watch(
  () => userStore.getUserIsSigningUp,
  () => {
    const userIsSigningUp: boolean = userStore.getUserIsSigningUp;
    updateUrlWithAction(userIsSigningUp, "/", "signup", router, route);
  }
);
// Lifecycle hooks
onBeforeMount(() => {
  const user: User = userStore.getUser;
  if (props.action.toLowerCase() === "login") {
    user.isLoggingIn = true;
    userStore.updateUser(user);
  } else if (props.action.toLowerCase() === "signup") {
    user.isSigningUp = true;
    userStore.updateUser(user);
  }
});
</script>

<style lang="scss" scoped>
.text-padding {
  @media (max-width: 600px) {
    padding: 10px 20px 0 20px;
  }
  @media (min-width: 601px) {
    padding: 35px 70px 0 70px;
  }
}
.motto {
  margin: auto;
  font-style: italic;
  color: var(--v-secondary);
  font-size: 2.5em;
  font-weight: 500;
  font-family: "SegoeUI-BoldItalic", sans-serif;
}
.description {
  color: var(--v-secondary);
  font-size: 1em;
  padding-bottom: 50px;
}
</style>
