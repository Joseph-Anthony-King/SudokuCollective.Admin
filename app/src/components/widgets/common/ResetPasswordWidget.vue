<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { onMounted } from 'vue';
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import router from "@/router/index";
import { useUserStore } from "@/store/userStore";
import commonUtilities from "@/utilities/common";
import { StoreType } from '@/enums/storeTypes';
import { ResetPasswordRequestData } from '@/models/requests/resetPasswordRequestData';

const {
  displaySuccessfulToast,
  displayFailedToastAsync,
  updateAppProcessingAsync } = commonUtilities();

const props = defineProps({
  token: {
    type: String,
    default: "",
  },
});

const userStore = useUserStore();

onMounted(async () => {
  updateAppProcessingAsync(async () => {
    if (/^([0-9A-Fa-f]{8}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{4}[-][0-9A-Fa-f]{12})$/.test(props.token)) {
      const data = new ResetPasswordRequestData(props.token, "P@ssw0rd!");
      const result = await userStore.resetPasswordAsync(data);
      if (result) {
        displaySuccessfulToast(StoreType.USERSTORE);
        if (userStore.getUserIsLoggedIn) {
          await userStore.getUserAsync();
          useUserStore().updateServiceMessage();
          router.push("/user-profile");
        }
      } else {
        displayFailedToastAsync(undefined, undefined);
        router.push("/");
      }
    } else {
      toast("The token you submitted is not valid", {
        position: toast.POSITION.TOP_CENTER,
        type: toast.TYPE.ERROR,
      });
      router.push("/");
    }
  });
});
</script>
