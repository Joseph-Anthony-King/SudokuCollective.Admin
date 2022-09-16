<template>
  <v-container>
    <v-card elevation="6" class="mx-16">
      <h1 class="text-center h1-margin">This is the about page</h1>
    </v-card>
  </v-container>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AboutView',
})
</script>

<style lang='scss' scoped>
  .h1-margin {
    margin: 100px 0 100px 0;
  }
</style>
