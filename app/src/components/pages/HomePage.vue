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
  import { useValueStore } from '@/stores/valuesStore';
  import HeroWidget from '@/components/widgets/common/HeroWidget.vue';
  import { storeToRefs } from 'pinia';

  //#region Destructure Stores
  const valuesStore = useValueStore();
  const { getMissionStatement } = storeToRefs(valuesStore);
  //#endregion

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
