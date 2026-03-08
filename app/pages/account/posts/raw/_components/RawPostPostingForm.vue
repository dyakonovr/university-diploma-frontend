<template>
  <div class="raw-post-posting-form form-container-padding">
    <p class="raw-post-posting-form__title text-14 weight-600">
      Опубликовать пост
    </p>

    <select-ui
      v-model="formData.social_network"
      label="Соц. сеть"
      :options="providers.data.value || []"
      :error="formErrors.social_network"
      :select-props="{
        placeholder: 'Выберите соц. сеть',
        disabled: providers.loading.value || isFormDisabled,
      }"
      :searchable="false"
      form-wrapper-class="form-container-padding-y"
      @update:search-query="providers.debouncedGetData(1, true)"
      @reach-end="providers.getData(providers.meta.value.page + 1)"
    >
      <template #selected="{ value }">
        <social-badge :provider="value as SocialAccountProviderName" />
      </template>
      <template #option="{ option }">
        <social-badge :provider="option.value as SocialAccountProviderName" />
      </template>
    </select-ui>

    <select-ui
      v-model="formData.social_accounts"
      label="Аккаунт(ы)"
      :options="socialAccounts.data.value || []"
      :error="formErrors.social_accounts"
      :select-props="{
        placeholder: 'Выберите аккаунт(ы)',
        disabled: socialAccounts.loading.value || isFormDisabled,
      }"
      is-multiple
      :searchable="false"
      form-wrapper-class="form-container-padding-y"
      @update:search-query="socialAccounts.debouncedGetData(1, true)"
      @reach-end="socialAccounts.getData(socialAccounts.meta.value.page + 1)"
    />

    <!-- <datepicker-ui
      v-model="formData.post_time"
      label="Дата и время постинга"
      :error="formErrors.post_time"
      :disabled="isFormDisabled"
      :min-date="minDate"
    /> -->

    <div class="form-container-padding-y">
      <button-ui
        :disabled="isFormDisabled"
        @click="publishPost"
      >Опубликовать</button-ui
      >
    </div>

    <social-post-preview
      :preview="preview"
      :loading="previewLoading" />
  </div>
</template>

<script lang="ts" setup>
import SocialBadge from '~/components/SocialBadge.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
// import DatepickerUi from '~/components/ui/form/DatepickerUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import type { SocialAccountProviderName } from '~/domain/social-account/models/social-account-provider';
import SocialPostPreview from '~/domain/social-post/ui/SocialPostPreview.vue';

import { useRawPostPostingForm } from '../_composables/useRawPostPostingForm';
import { useRawPostStore } from '../_stores/raw-post-form';

const rawPostStore = useRawPostStore();

const {
  formData,
  formErrors,
  providers,
  socialAccounts,
  globalLoading,
  // minDate,
  loading,
  preview,
  previewLoading,
  getPreview,
  publishPost,
} = useRawPostPostingForm();

const isFormDisabled = computed(() => loading.value || globalLoading.value);

onBeforeMount(async () => {
  loading.value = true;
  await Promise.all([providers.getData(1), socialAccounts.getData(1)]);
  loading.value = false;
});

watch(
  () => formData.value.social_network,
  async () => {
    formData.value.social_accounts = null;
    await Promise.all([socialAccounts.getData(1), getPreview()]);
  },
  { immediate: true },
);

watch(
  () => rawPostStore.previewRevision,
  (revision) => {
    if (revision > 0) getPreview();
  },
);
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.raw-post-posting-form {
  border-left: 1px solid colors.$border;

  &__title {
    margin-bottom: 16px;
  }
}
</style>
