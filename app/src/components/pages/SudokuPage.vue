<template>
  <progress-widget v-if="loading" />
  <sudoku-widget v-show="!loading" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, Ref, ref, watch } from "vue";
import { useRouter, useRoute } from 'vue-router';
import store from "@/store";
import { useAppStore } from "@/store/appStore/index";
import ProgressWidget from "@/components/widgets/common/ProgressWidget.vue";
import SudokuWidget from "@/components/widgets/sudoku/SudokuWidget.vue";
import commonUtitlities from "@/utilities/common";
import { User } from "@/models/domain/user";

export default defineComponent({
  name: "SudokuPage",
  components: { ProgressWidget, SudokuWidget },
  props: {
    action: {
      type: String,
      default: ""
    },
  },
  setup(props) {
    const appStore = useAppStore();
    const router = useRouter();
    const route = useRoute();
    const { updateUrlWithAction } = commonUtitlities();
    let loading: Ref<boolean> = ref(
      store.getters["sudukuModule/getProcessing"]
    );
    watch(
      () => store.getters["sudokuModule/getProcessing"],
      () => {
        loading.value = store.getters["sudokuModule/getProcessing"];
      }
    );
    watch(
      () => appStore.getUserIsLoggingIn,
      () => {
        const userIsLoggingIn: boolean = appStore.getUserIsLoggingIn;
        updateUrlWithAction(
          userIsLoggingIn,
          "/sudoku",
          "login",
          router,
          route);
      }
    )
    onBeforeMount(() => {
      appStore.updateProcessingMessage("processing, please do not navigate away");
      if (props.action.toLowerCase() === 'login') {
        const user: User = appStore.getUser;
        user.isLoggingIn = true;
        appStore.updateUser(user)
      }
    });
    return {
      loading,
    };
  },
});
</script>
