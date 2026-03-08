import type { ToastOptions } from 'vue-toastification/dist/types/types';

import { useNuxtApp } from '#imports';

// TODO: fix types
const baseOptions: ToastOptions = {
  position: 'top-center',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: false,
  rtl: false,
};

export const useCustomToast = () => {
  const app = useNuxtApp();
  type ToastFunc = typeof app.$toast;
  type ToastFuncArgs = Parameters<ToastFunc>;

  const toastInfo = (message: string) => app.$toast(message, baseOptions);
  const toastSuccess = (...args: ToastFuncArgs) =>
    app.$toast.success(args[0], {
      ...baseOptions,
      ...args[1],
      type: 'success',
    });
  const toastError = (message: string) =>
    app.$toast.error(message, { ...baseOptions, type: 'error' });

  return { toastError, toastInfo, toastSuccess };
};
