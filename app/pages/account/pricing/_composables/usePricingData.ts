import { computed, ref } from 'vue';

import { getModels as fetchModelsApi } from '~/domain/model/api/models.api';
import type { Model } from '~/domain/model/models/model.types';
import { getAvailableSubscriptions } from '~/domain/subscription/api/payments.api';
import type { SubscriptionAvailable } from '~/domain/subscription/models/subscription.types';
import useUserStore from '~/domain/user/stores/user';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';

export type ProviderGroup = {
  provider: string;
  models: { id: string; name: string }[];
};

export default function usePricingData() {
  const userStore = useUserStore();
  const { toastError } = useCustomToast();

  const subscriptions = ref<SubscriptionAvailable[]>([]);
  const models = ref<Model[]>([]);
  const loading = ref(true);

  function isCurrentSubscription(subId: string): boolean {
    return (
      userStore.subscriptions?.some((s) => s.subscription_id === subId) ?? false
    );
  }

  function getModelsForSubscription(sub: SubscriptionAvailable): ProviderGroup[] {
    if (!sub.permission_ids || sub.permission_ids.length === 0) return [];

    const subPermSet = new Set(sub.permission_ids);

    const matched = models.value.filter((m) => {
      if (!m.permissions || m.permissions.length === 0) return false;
      return m.permissions.every((p) => subPermSet.has(p.id));
    });

    const groups = new Map<string, { id: string; name: string }[]>();
    for (const m of matched) {
      const providerName = m.provider_name || 'Другие';
      if (!groups.has(providerName)) {
        groups.set(providerName, []);
      }
      groups.get(providerName)!.push({ id: m.id, name: m.name });
    }

    return Array.from(groups.entries()).map(([provider, mdls]) => ({
      provider,
      models: mdls,
    }));
  }

  function getTotalModelsCount(sub: SubscriptionAvailable): number {
    return getModelsForSubscription(sub).reduce((sum, g) => sum + g.models.length, 0);
  }

  function getProvidersCount(sub: SubscriptionAvailable): number {
    return getModelsForSubscription(sub).length;
  }

  async function fetchData() {
    try {
      loading.value = true;

      const modelsParams = objectToQueryString({
        is_active: true,
        add_provider_name: true,
        include_permissions: true,
      });

      const [subsResponse, modelsResponse] = await Promise.all([
        getAvailableSubscriptions(),
        fetchModelsApi(modelsParams),
      ]);

      subscriptions.value = subsResponse.data;
      models.value = modelsResponse.data;
    } catch {
      toastError('Не удалось загрузить тарифы');
    } finally {
      loading.value = false;
    }
  }

  return {
    subscriptions,
    loading,
    fetchData,
    isCurrentSubscription,
    getModelsForSubscription,
    getTotalModelsCount,
    getProvidersCount,
  };
}
