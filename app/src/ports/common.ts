import { storeToRefs } from 'pinia';
import { toast } from 'vue3-toastify';
import { useGlobalStore } from '@/stores/globalStore';

// Defaults to 30 seconds
export const abortSignal = (timeoutMs: number = 30000): AbortSignal => {
  const { getProcessingStatus } = storeToRefs(useGlobalStore());
  const controller = new AbortController();
  setTimeout(() => {
    if (getProcessingStatus.value) {
      controller.abort();
      useGlobalStore().updateProcessingStatus(false);
      toast(`Request timed out.`, {
        position: toast.POSITION.TOP_CENTER,
        type: toast.TYPE.ERROR,
      });
    }
  }, timeoutMs);

  return controller.signal;
};

export const manualAbortSignal = (): AbortSignal => {
  const { updateProcessingStatus } = useGlobalStore();
  const controller = new AbortController();
  updateProcessingStatus(false);
  return controller.signal;
};
