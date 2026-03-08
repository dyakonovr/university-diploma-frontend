<template>
  <account-form-header @get-back="getBack" />
  <form-container :loading="loading">
    <input-ui
      v-model="formData.account_name"
      label="Название"
      :error="formErrors.account_name"
      :input-props="{ disabled: loading, placeholder: 'Введите название' }"
    />
    <select-ui
      v-model="formData.provider"
      label="Соц. сеть"
      :options="providers.data.value || []"
      :error="formErrors.provider"
      :select-props="{
        placeholder: 'Выберите соц. сеть',
        disabled: loading || providers.loading.value || isEditMode,
      }"
      :searchable="false"
      @update:model-value="onProviderChange($event as string | null)"
      @update:search-query="providers.debouncedGetData(1, true)"
      @reach-end="providers.getData(providers.meta.value.page + 1)"
    />
    <switch-ui
      v-model="formData.is_active"
      label="Активный?"
      with-label
      enabled-label="Да"
      disabled-label="Нет"
      :switch-props="{ disabled: loading }"
    />
  </form-container>

  <form-container
    class="divided"
    :loading="loading">
    <template #header>
      <p class="form-container__title">Proxy</p>
    </template>

    <input-ui
      v-model="formData.proxy_http"
      label="HTTP"
      :error="formErrors.proxy_http"
      :input-props="{ disabled: loading, placeholder: 'Введите значение' }"
    />
    <input-ui
      v-model="formData.proxy_https"
      label="HTTPS"
      :error="formErrors.proxy_https"
      :input-props="{ disabled: loading, placeholder: 'Введите значение' }"
    />
  </form-container>

  <form-container
    v-if="formData.provider"
    class="divided"
    :loading="loading">
    <template #header>
      <p class="form-container__title">Данные соц. сети</p>

      <div
        v-if="isWarningShowed"
        class="social-account-form__fetch-credentials"
      >
        <p class="social-account-form__warning text-14 weight-400">
          В целях безопасности данные для подключения скрыты
        </p>

        <button-ui
          :disabled="credentialsLoading"
          @click="fetchCredentials"
        >Запросить данные</button-ui
        >
      </div>

      <p
        v-if="!isWarningShowed && credentialsDescription"
        class="social-account-form__credentials-descr text-14 weight-400"
        v-html="credentialsDescription"
      />
    </template>

    <social-account-form-credentials
      v-if="formData.credentials && currentProvider"
      v-model="formData.credentials"
      :errors="credentialsErrors"
      :current-provider="currentProvider"
    />
  </form-container>

  <social-post-statistic
    v-if="isEditMode"
    :request-func="requestStatistic"
    dynamic-title="Динамика по всем постам аккаунта"
    total-title="Общая статистика всех постов аккаунта"
  />

  <form-buttons
    :disabled="loading"
    @cancel="getBack"
    @submit="onSubmit" />
</template>

<script setup lang="ts">
import AccountFormHeader from '~/components/pages/account/AccountFormHeader.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import FormButtons from '~/components/ui/form/FormButtons.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import SwitchUi from '~/components/ui/form/SwitchUi.vue';
import { SOCIAL_ACCOUNT_PROVIDER_INSTRUCTIONS } from '~/domain/social-account/constants/social-account-provider.const';
import { createEmptySocialAccountCredentials } from '~/domain/social-account/services/credentials-logic';
import SocialAccountFormCredentials from '~/domain/social-account/ui/SocialAccountFormCredentials.vue';
import { getSocialPostsDynamicStatisticByAccountId } from '~/domain/social-post/api/social-post-statistic.api';
import SocialPostStatistic from '~/domain/social-post/ui/statistic/SocialPostStatistic.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import useFormKeyboard from '~/shared/composables/useFormKeyboard';
import type { QueryParams } from '~/shared/types/core/request.types';

import useSocialAccountForm from './_composables/useSocialAccountForm';

const {
  isEditMode,
  editId,
  formData,
  formErrors,
  credentialsErrors,
  loading,
  providers,
  credentialsLoading,
  currentProvider,
  getData,
  onSubmit,
  getBack,
  fetchCredentials,
} = useSocialAccountForm();

useFormKeyboard({ onSubmit, onCancel: getBack, disabled: loading });

const isWarningShowed = computed(
  () => !formData.value.credentials && isEditMode,
);

const credentialsDescription = computed<string>(() => {
  if (!formData.value.provider) return '';
  return SOCIAL_ACCOUNT_PROVIDER_INSTRUCTIONS[formData.value.provider] ?? '';
});

const onProviderChange = (providerName: string | null) => {
  if (!providerName) return;

  const p = providers.rawData.value?.find((el) => el.name === providerName);
  if (!p) return;

  formData.value.credentials = createEmptySocialAccountCredentials([
    ...p.required_fields,
    ...(p.optional_fields || []),
  ]);
  credentialsErrors.value = {};
};

const requestStatistic = async (params: QueryParams) => {
  if (!editId.value) return [];

  const response = await getSocialPostsDynamicStatisticByAccountId(
    editId.value,
    params,
  );
  return response.data.data;
};

onBeforeMount(async () => {
  loading.value = true;
  await Promise.all([getData(), providers.getData(1)]);
  loading.value = false;
});

// --- SEO ---
definePageMeta({ title: 'Аккаунт' });
useAccountSeoTitle(() => formData.value.account_name, {
  snapshot: true,
  fallback: 'Аккаунт',
});
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;

.social-account-form {
  &__fetch-credentials {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
  }

  &__credentials-descr {
    margin-top: 4px;

    :deep(a) {
      color: blue;
    }

    :deep(code) {
      padding: 2px;
      border-radius: 6px;
      background-color: colors.$border;
    }
  }
}
</style>
