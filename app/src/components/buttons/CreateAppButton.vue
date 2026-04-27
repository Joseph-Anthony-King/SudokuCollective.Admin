<template>
  <v-card
    class="app-button create-app-button"
    @click="handleClick">
    <v-card-title>
      <span class="select-app-title">Create New App</span>
    </v-card-title>
  </v-card>
</template>

<script setup lang="ts">
  const emit = defineEmits(['create-app-clicked']);

  const handleClick = () => {
    emit('create-app-clicked');
  };
</script>

<style scoped lang="scss">
  .create-app-button {
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
    cursor: pointer;
    background: #1976d2; /* Vuetify primary color */
    color: white;
  }
  .select-app-title {
    white-space: pre-wrap;
    text-decoration: none !important;
    color: white;
  }
  @media only screen and (min-width: 482px) {
    .create-app-button {
      min-height: 200px;
      max-height: 200px;
      min-width: 200px;
      max-width: 200px;
    }
  }
</style>
