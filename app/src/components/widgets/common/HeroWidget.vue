<template>
  <v-container fluid class="app-responsive-viewport">
    <v-card elevation="6" class="mx-auto">
      <v-row class="text-center home-banner">
        <v-col cols="12">
          <h1 class="text-center centered-welcome-message text-padding">
            {{ headline }}
          </h1>
          <v-img
            src="/images/logo.png"
            class="my-3 centered-logo"
            contain
            height="200"
          />
        </v-col>
      </v-row>
      <slot></slot>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars*/
const props = defineProps({
  headline: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.v-card {
  @media (max-width: 600px) {
    padding: 0 0 0 0 !important;
    margin: 0 0 0 0 !important;
  }
  width: 100%;
}
.text-padding {
  @media (max-width: 600px) {
    padding: 10px 20px 0 20px;
  }
  @media (min-width: 601px) {
    padding: 35px 70px 0 70px;
  }
}
.home-banner {
  position: relative;
  margin-bottom: 0;
  border: 0;
  border-color: transparent;
  min-height: 500px;
  background-image: url("@/assets/banner.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
.centered-welcome-message {
  position: absolute;
  top: 10%;
  left: 0;
  width: 100%;
  color: white;
  text-shadow: 2px 2px var(--v-secondary);
}
.centered-logo {
  position: absolute;
  left: 0;
  width: 100%;
  filter: drop-shadow(2px 2px 2px var(--v-secondary));
  top: 40%;
}
</style>
