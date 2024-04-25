<template>
  <HeroWidget headline="Welcome to Sudoku Collective Admin Console">
    <v-row>
      <v-col cols="12">
        <p class="motto text-center text-padding">Code, Create, Inspire...</p>
        <p
          class="description text-center text-padding"
          v-html="missionStatement"></p>
      </v-col>
    </v-row>
  </HeroWidget>
</template>

<script setup lang="ts">
  /* eslint-disable no-unused-vars */
  /* eslint-disable no-undef */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  import { ref, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import router from '@/router/index';
  import { useUserStore } from '@/stores/userStore';
  import { useValueStore } from '@/stores/valueStore';
  import HeroWidget from '@/components/widgets/common/HeroWidget.vue';
  import commonUtitlities from '@/utilities/common';
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    action: {
      type: String,
      default: '',
    },
  });

  //#region Destructure Stores
  const userStore = useUserStore();
  const { getUserIsLoggingIn, getUserIsSigningUp } = storeToRefs(userStore);
  const valueStore = useValueStore();
  const { getMissionStatement } = storeToRefs(valueStore);
  //#endregion

  const route = useRoute();
  const { updateUrlWithAction } = commonUtitlities();
  const missionStatement = ref(getMissionStatement.value);

  watch(
    () => getMissionStatement.value,
    (newValue, oldValue) => {
      missionStatement.value = newValue;
    },
    {
      immediate: true,
      deep: true,
    },
  );
  watch(
    () => getUserIsLoggingIn.value,
    (newValue, oldValue) => {
      const userIsLoggingIn: boolean = newValue;
      updateUrlWithAction(userIsLoggingIn, '/', 'login', router, route);
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
      updateUrlWithAction(userIsSigningUp, '/', 'signup', router, route);
    },
    {
      immediate: true,
      deep: true,
    },
  );
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
    font-family: 'SegoeUI-BoldItalic', sans-serif;
  }
  .description {
    color: var(--v-secondary);
    font-size: 1em;
    padding-bottom: 50px;
  }
</style>
