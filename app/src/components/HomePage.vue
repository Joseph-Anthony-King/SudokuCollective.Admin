<template>
  <v-container>
    <v-card elevation="6" class="mx-16">
      <v-row class="text-center home-banner">
        <v-col cols="12">
          <h1 class="text-center centered-welcome-message text-padding">
            Welcome to Sudoku Collective Admin Vue
          </h1>
          <v-img
            src="/images/logo.png"
            class="my-3 centered-logo"
            contain
            height="200"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <p class="motto text-center text-padding">
            Code... Create... Inspire...
          </p>
          <p class="description text-center text-padding" v-html="missionStatement">
          </p>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from "vue";
  import { useStore } from "vuex"
  export default defineComponent({
    name: "HomePage",
    setup() {
      const store = useStore();
      const missionStatement = ref("");
      watch(() => store.getters.getMissionStatement, function() {
        missionStatement.value = store.getters.getMissionStatement;
      });
      return {
        missionStatement,
      }
    }
  }); 
</script>

<style lang="scss" scoped>
  .text-padding {
    padding: 35px 70px 0 70px;
  }
  .home-banner {
    position: relative;
    margin-bottom: 0;
    border: 0;
    border-color: transparent;
    min-height: 500px;
    background-image: url("../assets/banner.jpg");
    background-size: cover;
    background-repeat:   no-repeat;
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
    top: 40%;
    left: 0;
    width: 100%;
    filter: drop-shadow(2px 2px 2px var(--v-secondary));
  }
  .motto {
    margin: auto;
    font-style: italic;
    color: var(--v-secondary);
    font-size: 2em;
  }
  .description {
    color: var(--v-secondary);
    font-size: 1em;
    padding-bottom: 50px;
  }
</style>
