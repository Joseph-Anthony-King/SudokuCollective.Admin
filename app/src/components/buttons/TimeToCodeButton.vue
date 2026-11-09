<template>
  <v-card
    class="time-to-code-button"
    @click="getMessage">
    <v-card-title>
      <span class="time-to-code-title">Time to Get Coding!</span>
    </v-card-title>
  </v-card>
</template>

<script setup lang="ts">
  import { useDialogStore } from '@/stores/dialogStore';
  import { DialogType } from '@/enums/dialogType';

  const { updateDialog } = useDialogStore();

  const getMessage = (): void => {
    updateDialog(
      'Time to Get Code!',
      'Don\'t be nervous! You can create your first app by clicking the "Create New App" button!',
      DialogType.OK,
    );
  };
</script>

<style scoped lang="scss">
  .time-to-code-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 170px;
    max-height: 170px;
    min-width: 170px;
    max-width: 170px;
    margin-right: 10px;
    margin-bottom: 30px;
    background-color: #d3d3d3;
  }

  @media only screen and (min-width: 482px) {
    .time-to-code-button {
      min-height: 200px;
      max-height: 200px;
      min-width: 200px;
      max-width: 200px;
      background-color: #d3d3d3;
    }
  }
</style>
