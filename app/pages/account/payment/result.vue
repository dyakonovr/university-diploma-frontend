<template>
  <account-form-header />

  <form-container class="divided">
    <template #header>
      <p class="form-container__title">Результат оплаты</p>
    </template>

    <div class="form-container-padding payment-result">
      <template v-if="status === PaymentResultStatus.Loading">
        <spinner-ui />
        <p>Проверяем статус оплаты...</p>
      </template>

      <template v-else-if="status === PaymentResultStatus.Succeeded">
        <notice-ui
          type="success"
          title="Оплата прошла успешно!">
          Подписка активирована. Токены начислены на ваш баланс.
        </notice-ui>
        <button-ui to="/account/profile">Перейти в профиль</button-ui>
      </template>

      <template v-else-if="status === PaymentResultStatus.Canceled">
        <notice-ui
          type="warning"
          title="Оплата отменена">
          Платёж не был завершён. Вы можете попробовать снова.
        </notice-ui>
        <button-ui to="/account/pricing">Вернуться к тарифам</button-ui>
      </template>

      <template v-else>
        <notice-ui
          type="error"
          title="Ошибка">
          Не удалось получить статус платежа. Попробуйте обновить страницу.
        </notice-ui>
        <button-ui to="/account/pricing">Вернуться к тарифам</button-ui>
      </template>
    </div>
  </form-container>
</template>

<script setup lang="ts">
import AccountFormHeader from '~/components/pages/account/AccountFormHeader.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import NoticeUi from '~/components/ui/NoticeUi.vue';
import SpinnerUi from '~/components/ui/SpinnerUi.vue';
import { PaymentResultStatus } from '~/domain/subscription/models/subscription.types';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';

import usePaymentPolling from './_composables/usePaymentPolling';

const route = useRoute();

const paymentId = computed(() => route.query.payment_id as string | undefined);
const { status, startPolling } = usePaymentPolling(paymentId);

onMounted(() => {
  startPolling();
});

// --- SEO ---
const PAGE_TITLE = 'Результат оплаты';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;

.payment-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-height: 200px;
  justify-content: center;

  p {
    color: colors.$text-light;
  }
}
</style>
