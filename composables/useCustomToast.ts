import { useNuxtApp } from '#imports';

export const useCustomToast = () => {
  const app = useNuxtApp();
  const options = {
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

  const toastInfo = (message: string) => app.$toast(message, options);
  const toastSuccess = (message: string) => app.$toast.success(message, options);
  const toastError = (message: string) => app.$toast.error(message, options);

  return { toastError, toastInfo, toastSuccess };
};