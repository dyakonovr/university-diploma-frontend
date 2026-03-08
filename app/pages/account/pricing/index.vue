<template>
  <account-form-header />

  <form-container class="divided">
    <template #header>
      <p>Тарифы</p>
    </template>

    <div class="form-container-padding">
      <div
        v-if="loading"
        class="pricing__loader">
        <spinner-ui />
      </div>

      <div
        v-else
        class="pricing__grid">
        <pricing-card
          v-for="sub in subscriptions"
          :key="sub.id"
          :subscription="sub"
          :is-current="isCurrentSubscription(sub.id)"
          :subscribing="paymentLoading === sub.id"
          :models-count="getTotalModelsCount(sub)"
          :providers-count="getProvidersCount(sub)"
          @subscribe="handleSubscribe(sub.id)"
          @show-models="openModelsDialog(sub)"
        />
      </div>
    </div>
  </form-container>

  <pricing-models-dialog
    v-model="modelsDialogVisible"
    :subscription="modelsDialogSub"
    :groups="modelsDialogGroups"
    :total-models="modelsDialogSub ? getTotalModelsCount(modelsDialogSub) : 0"
    :is-current="
      modelsDialogSub ? isCurrentSubscription(modelsDialogSub.id) : false
    "
    :subscribing="
      modelsDialogSub ? paymentLoading === modelsDialogSub.id : false
    "
    @subscribe="modelsDialogSub && handleSubscribe(modelsDialogSub.id)"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import AccountFormHeader from '~/components/pages/account/AccountFormHeader.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import SpinnerUi from '~/components/ui/SpinnerUi.vue';
import type { SubscriptionAvailable } from '~/domain/subscription/models/subscription.types';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';

import PricingCard from './_components/PricingCard.vue';
import PricingModelsDialog from './_components/PricingModelsDialog.vue';
import usePricingData from './_composables/usePricingData';
import usePricingPayment from './_composables/usePricingPayment';

const {
  subscriptions,
  loading,
  fetchData,
  isCurrentSubscription,
  getModelsForSubscription,
  getTotalModelsCount,
  getProvidersCount,
} = usePricingData();

const { paymentLoading, handleSubscribe } = usePricingPayment();

const modelsDialogVisible = ref(false);
const modelsDialogSub = ref<SubscriptionAvailable | null>(null);

const modelsDialogGroups = computed(() => {
  if (!modelsDialogSub.value) return [];
  return getModelsForSubscription(modelsDialogSub.value);
});

function openModelsDialog(sub: SubscriptionAvailable) {
  modelsDialogSub.value = sub;
  modelsDialogVisible.value = true;
}

onBeforeMount(() => {
  void fetchData();
});

// --- SEO ---
const PAGE_TITLE = 'Тарифы';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss" scoped>
.pricing {
  &__loader {
    display: flex;
    justify-content: center;
    padding: 40px 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }
}
</style>
