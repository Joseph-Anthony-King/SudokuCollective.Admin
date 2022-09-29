<template>
  <v-container fluid>
    <v-card elevation="6" class="mx-16">
      <v-row>
        <v-col cols="12">
          <h1 class="text-center h1-margin">This is the about page</h1>
        </v-col>
      </v-row>
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
  .v-card {
    @media (max-width: 600px) {
      padding: 0 0 0 0 !important;
      margin: 0 0 0 0 !important;
    }
  }
  .h1-margin {
    margin: 100px 0 100px 0;
  }
</style>
