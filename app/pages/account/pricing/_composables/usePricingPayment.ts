import { ref } from 'vue';

import { createPayment } from '~/domain/subscription/api/payments.api';
import { useCustomToast } from '~/shared/composables/useCustomToast';

export default function usePricingPayment() {
  const { toastError } = useCustomToast();

  const paymentLoading = ref<string | null>(null);

  async function handleSubscribe(subscriptionId: string) {
    try {
      paymentLoading.value = subscriptionId;
      const response = await createPayment(subscriptionId);
      const { confirmation_url } = response.data;
      if (confirmation_url) {
        window.location.href = confirmation_url;
      }
    } catch {
      toastError('Не удалось создать платёж');
    } finally {
      paymentLoading.value = null;
    }
  }

  return {
    paymentLoading,
    handleSubscribe,
  };
}
