<template>
  <v-container fluid class='app-responsive-viewport'>
    <ProgressWidget v-if='loading' />
    <v-card elevation='6' class='mx-16' v-show='!loading'>
      <v-row class='text-center home-banner'>
        <v-col cols='12'>
          <h1 class='text-center centered-welcome-message text-padding'>
            Welcome to Sudoku Collective Admin Vue
          </h1>
          <v-img
            src='/images/logo.png'
            class='my-3 centered-logo'
            contain
            height='200'
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols='12'>
          <p class='motto text-center text-padding'>
            Code... Create... Inspire...
          </p>
          <p
            class='description text-center text-padding'
            v-html='missionStatement'
          ></p>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang='ts'>
import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router/index';
import { useAppStore } from '@/store/appStore/index';
import { useUserStore } from '@/store/userStore/index';
import { useValuesStore } from '@/store/valuesStore/index';
import ProgressWidget from '@/components/widgets/common/ProgressWidget.vue';
import commonUtitlities from '@/utilities/common';
import { User } from '@/models/domain/user';

export default defineComponent({
  name: 'HomePage',
  components: { ProgressWidget },
  props: {
    action: {
      type: String,
      default: ''
    },
  },
  setup(props) {
    const appStore = useAppStore();
    const userStore = useUserStore();
    const valuesStore = useValuesStore();
    const route = useRoute();
    const { updateUrlWithAction } = commonUtitlities();
    const missionStatement = ref(
      valuesStore.getMissionStatement
    );
    const loading = computed(() => {
      return missionStatement.value === '';
    });
    watch(
      () => valuesStore.getMissionStatement,
      () => {
        missionStatement.value =
          valuesStore.getMissionStatement;
      }
    );
    watch(
      () => userStore.getUserIsLoggingIn,
      () => {
        const userIsLoggingIn: boolean = userStore.getUserIsLoggingIn;
        updateUrlWithAction(
          userIsLoggingIn,
          '/',
          'login',
          router,
          route);
      }
    );
    watch(
      () => userStore.getUserIsSigningUp,
      () => {
        const userIsSigningUp: boolean = userStore.getUserIsSigningUp;
        updateUrlWithAction(
          userIsSigningUp,
          '/',
          'signup',
          router,
          route);
      }
    );
    onBeforeMount(() => {
      appStore.updateProcessingMessage('loading, please wait');
      const user: User = userStore.getUser;
      if (props.action.toLowerCase() === 'login') {
        user.isLoggingIn = true;
        userStore.updateUser(user)
      } else if (props.action.toLowerCase() === 'signup') {
        user.isSigningUp = true;
        userStore.updateUser(user);
      }
    });
    return {
      loading,
      missionStatement,
    };
  },
});
</script>

<style lang='scss' scoped>
.v-card {
  @media (max-width: 600px) {
    padding: 0 0 0 0 !important;
    margin: 0 0 0 0 !important;
  }
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
  background-image: url('@/assets/banner.jpg');
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
