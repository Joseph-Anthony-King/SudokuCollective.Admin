<template>
  <progress-widget v-if="loading" />
  <sudoku-widget v-show="!loading" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, Ref, ref, watch } from "vue";
import { useRouter, useRoute } from 'vue-router';
import store from "@/store";
import ProgressWidget from "@/components/widgets/common/ProgressWidget.vue";
import SudokuWidget from "@/components/widgets/sudoku/SudokuWidget.vue";
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
    const router = useRouter();
    const route = useRoute();
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
      () => store.getters["appModule/getUserIsLoggingIn"],
      () => {
        const userIsLoggingIn: boolean = store.getters["appModule/getUserIsLoggingIn"];
        if (userIsLoggingIn === false) {
          router.push("/sudoku");
        } else if (userIsLoggingIn === true && route.params.action === "") {
          router.push("/sudoku/login");
        }
      }
    )
    onBeforeMount(() => {
      store.dispatch(
        "appModule/updateProcessingMessage",
        "processing, please do not navigate away"
      );
      if (props.action.toLowerCase() === 'login') {
        const user: User = store.getters["appModule/getUser"];
        user.isLoggingIn = true;
        store.dispatch("appModule/updateUser", user)
      }
    });
    return {
      loading,
    };
  },
});
</script>
