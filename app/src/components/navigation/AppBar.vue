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
            <div v-for="(link, index) in interiorLinks" :key="index">
              <v-tooltip bottom v-if="link.condition">
                <template v-slot:activator="{ props }">
                  <v-list-item v-bind="props">
                    <v-list-item-content>
                      <v-list-item-title>
                        <a
                          :href="link.url"
                          :target="link.target"
                          class="menu-item"
                        >
                          <v-icon>{{ link.mdiIcon }}</v-icon>
                          <span class="mr-2">{{ link.title }}</span>
                        </a>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <span>{{ link.tooltip }}</span>
              </v-tooltip>
            </div>
            <hr v-if="outsideLinks.length > 1" class="mx-2" />
            <v-tooltip bottom>
              <template v-slot:activator="{ props }">
                <v-list-item
                  v-if="outsideLinks.length > 1"
                  v-bind="props"
                >
                  <v-menu left bottom>
                    <template v-slot:activator="{ props }">
                      <div class="menu-item" v-bind="props">
                        <span class="mr-2">Links</span>
                      </div>
                    </template>
                    <v-list class="menu-link-list">
                      <!-- outside links -->
                      <div v-for="(link, index) in outsideLinks" :key="index">
                        <v-tooltip bottom v-if="link.condition">
                          <template v-slot:activator="{ props }">
                            <v-list-item v-bind="props">
                              <v-list-item-content>
                                <v-list-item-title>
                                  <a
                                    :href="link.url"
                                    :target="link.target"
                                    class="menu-item"
                                  >
                                    <v-icon>{{ link.mdiIcon }}</v-icon>
                                    <span class="mr-2">{{ link.title }}</span>
                                  </a>
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </template>
                          <span>{{ link.tooltip }}</span>
                        </v-tooltip>
                      </div>
                    </v-list>
                  </v-menu>
                </v-list-item>
              </template>
              <span>Links to sites and resources</span>
            </v-tooltip>
          </v-list>
        </v-menu>
      </div>
    </div>
  </v-app-bar>
</template>

<script lang='ts'>
  import { defineComponent, ref } from 'vue';
  import { onBeforeMount } from '@vue/runtime-core';
  import { InteriorLinks } from "@/utilities/links/interiorLinks";
  import { OutsideLinks } from "@/utilities/links/outsideLinks";
  import { MenuItem } from '@/models/infrastructure/menuItem';

  export default defineComponent({
    name: 'AppBar',
    setup() {
      const interiorLinks = ref(Array<MenuItem>());
      const outsideLinks = ref(Array<MenuItem>());
      onBeforeMount(() => {
        InteriorLinks.forEach((link: MenuItem) => {
          interiorLinks.value.push(link);
        });
        OutsideLinks.forEach((link: MenuItem) => {
          outsideLinks.value.push(link);
        });
      });
      return {
        interiorLinks,
        outsideLinks
      }
    }
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
    color: #63666A;
    cursor: pointer;
  }
</style>
