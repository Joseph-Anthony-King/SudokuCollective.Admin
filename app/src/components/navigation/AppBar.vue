<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center app-viewport">
      <router-link to="/">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2 header-logo"
          contain
          src="/images/logo.png"
          transition="scale-transition"
          width="40"
        />
      </router-link>

      <router-link to="/">
        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="269"
          src="/images/name-logo.png"
          width="269"
        />
      </router-link>
      <div class="hidden-md-and-up name-logo">
        <router-link to="/">
          <v-img
            alt="Vuetify Name"
            contain
            max-width="180"
            src="/images/name-logo.png"
            transition="scale-transition"
            width="180"
          />
        </router-link>
      </div>
    </div>
  </v-app-bar>
</template>

<script lang='ts'>
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'AppBar',
  }); 
</script>

<style lang='scss' scoped>
.header-logo {
  margin: 0 0 0 10px;
}
.name-logo {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
