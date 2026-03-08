import { onBeforeUnmount, ref } from 'vue';

import { getPaymentStatus } from '~/domain/subscription/api/payments.api';
import {
  PaymentResultStatus,
  PaymentStatus,
} from '~/domain/subscription/models/subscription.types';
import useUserStore from '~/domain/user/stores/user';

const POLL_INTERVAL = 3000;

export default function usePaymentPolling(paymentId: Ref<string | undefined>) {
  const userStore = useUserStore();

  const status = ref<PaymentResultStatus>(PaymentResultStatus.Loading);
  let pollTimer: ReturnType<typeof setInterval> | null = null;

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  async function checkPayment() {
    if (!paymentId.value) {
      status.value = PaymentResultStatus.Error;
      return;
    }

    try {
      const response = await getPaymentStatus(paymentId.value);
      const paymentStatus = response.data.status;

      if (paymentStatus === PaymentStatus.Succeeded) {
        status.value = PaymentResultStatus.Succeeded;
        stopPolling();
        await userStore.fetchSubscriptions();
      } else if (paymentStatus === PaymentStatus.Canceled) {
        status.value = PaymentResultStatus.Canceled;
        stopPolling();
      }
    } catch {
      status.value = PaymentResultStatus.Error;
      stopPolling();
    }
  }

  function startPolling() {
    void checkPayment();
    pollTimer = setInterval(() => {
      void checkPayment();
    }, POLL_INTERVAL);
  }

  onBeforeUnmount(() => {
    stopPolling();
  });

  return {
    status,
    startPolling,
  };
}
