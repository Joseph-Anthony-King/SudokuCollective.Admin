<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex app-viewport">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-app-bar-title>
        <router-link to="/" class="inline-flex">
          <v-img
            alt="Vuetify Logo"
            class="shrink mr-2 header-logo"
            contain
            src="/images/logo.png"
            transition="scale-transition"
            width="40"
          />
          <span class="nav-text">
            Sudoku Collective Admin Vue
          </span>
        </router-link>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <div class="inline-flex">
        <v-menu bottom>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props">
              <span class="mr-2 menu-text">Menu</span>
              <v-btn icon="mdi-dots-vertical"></v-btn>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <router-link to="/about" class="menu-item">
                    About
                  </router-link>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
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
  .inline-flex {
    display: inline-flex;
  }
  .header-logo {
    margin: 0 0 0 10px;
  }
  .nav-text {
    color: #fff;
    font-size: x-large;
    font-weight: bolder;
    text-shadow: 2px 2px var(--v-secondary);
    margin: auto;
    padding: auto;
    @media (max-width: 1264px) {
      display: none;
    }
  }
  .menu-text {
    color: #fff;
    text-shadow: 2px 2px var(--v-secondary);
    margin: auto;
    padding: auto;
  }
  .menu-item {
    text-decoration: none !important;
    color: var(--v-secondary);
    cursor: pointer;
  }
</style>
