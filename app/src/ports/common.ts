import { toast } from "vue3-toastify";
import { useGlobalStore } from "@/stores/globalStore";

// Defaults to 30 seconds
export const abortSignal = (timeoutMs: number = 30000) => {
  const controller = new AbortController();
  setTimeout(() => { 
    controller.abort();
    useGlobalStore().updateProcessingStatus(false);
    toast(`Request timed out.`, {
      position: toast.POSITION.TOP_CENTER,
      type: toast.TYPE.ERROR,
    });
  }, timeoutMs);

  return controller.signal;
}
