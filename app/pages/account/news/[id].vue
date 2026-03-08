<template>
  <account-form-header @get-back="getBack" />
  <form-container :loading="loading">
    <input-ui
      v-model="formData.title"
      label="Заголовок"
      :error="formErrors.title"
      :input-props="{ disabled: loading, placeholder: 'Введите заголовок' }"
    />
    <select-ui
      v-model="formData.subcategory_id"
      label="Подкатегория"
      :options="subcategories.data.value || []"
      :initial-option="subcategories.initialOption.value"
      :error="formErrors.subcategory_id"
      :select-props="{
        placeholder: 'Выберите подкатегорию',
        disabled: loading || subcategories.loading.value,
      }"
      @update:search-query="subcategories.debouncedGetData(1, true)"
      @reach-end="subcategories.getData(subcategories.meta.value.page + 1)"
    >
      <template #option="{ option }">
        {{ option.label }}
        <tag-ui :type="option.is_visible ? 'success' : 'error'">
          {{ option.is_visible ? 'Видна' : 'Скрыта' }}
        </tag-ui>
      </template>
      <template #selected="{ value }">
        {{ findSubcategoryOption(value)?.label }}
        <tag-ui
          v-if="findSubcategoryOption(value)"
          :type="findSubcategoryOption(value)?.is_visible ? 'success' : 'error'"
          class="ml"
        >
          {{ findSubcategoryOption(value)?.is_visible ? 'Видна' : 'Скрыта' }}
        </tag-ui>
      </template>
    </select-ui>
    <news-content-editor
      v-model="formData.content"
      label="Контент"
      :error="formErrors.content"
    />
    <upload-file-ui
      v-model="previewImageFile"
      label="Превью-изображение"
      allowed-file-extensions="png,jpg,jpeg,gif,webp"
      :error="formErrors.preview_image_key"
      @file-uploaded="onPreviewImageUploaded"
    >
      <template
        v-if="isEditMode && previewImageUrl"
        #afterComponent>
        <a
          :href="previewImageUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="news-preview-link"
        >
          <img
            :src="previewImageUrl"
            alt="Превью изображение"
            class="news-preview-image"
          >
        </a>
      </template>
    </upload-file-ui>
    <select-with-tags-ui
      v-model="formData.hashtags"
      v-model:search-query="hashtags.searchValue.value"
      label="Хэштеги"
      :options="hashtags.data.value || []"
      :select-props="{
        placeholder: 'Выберите хэштеги для добавления',
        disabled: loading || hashtags.loading.value,
      }"
      form-wrapper-class="full"
      @reach-end="hashtags.getData(hashtags.meta.value.page + 1)"
      @update:search-query="hashtags.debouncedGetData(1, true)"
    />
    <input-ui
      v-model="formData.url"
      label="URL новости"
      :description="urlDescription"
      :error="formErrors.url"
      :input-props="{ disabled: loading, placeholder: 'my-news-article' }"
    />
    <switch-ui
      v-model="formData.is_visible"
      label="Видима на сайте?"
      with-label
      enabled-label="Да"
      disabled-label="Нет"
      :switch-props="{ disabled: loading }"
      :description="isVisibleDescription"
    />
  </form-container>

  <form-container
    class="divided"
    :loading="loading">
    <template #header>
      <p class="form-container__title">SEO-настройки</p>
    </template>
    <input-ui
      v-model="formData.seo_title"
      label="SEO Title"
      :error="formErrors.seo_title"
      :input-props="{ disabled: loading, placeholder: 'Введите SEO Title' }"
    />
    <input-ui
      v-model="formData.seo_description"
      label="SEO Description"
      :error="formErrors.seo_description"
      :input-props="{
        disabled: loading,
        placeholder: 'Введите SEO Description',
      }"
    />
  </form-container>

  <form-buttons
    :disabled="loading"
    @cancel="getBack"
    @submit="onSubmit" />
</template>

<script setup lang="ts">
import AccountFormHeader from '~/components/pages/account/AccountFormHeader.vue';
import FormButtons from '~/components/ui/form/FormButtons.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import SelectWithTagsUi from '~/components/ui/form/select/SelectWithTagsUi.vue';
import SwitchUi from '~/components/ui/form/SwitchUi.vue';
import UploadFileUi from '~/components/ui/form/upload-file/UploadFileUi.vue';
import TagUi from '~/components/ui/TagUi.vue';
import NewsContentEditor from '~/domain/news/ui/NewsContentEditor.vue';
import { isNewsVisibleOnLanding } from '~/domain/news/utils/is-visible.utl';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';
import { transliterate } from '~/shared/utils/transliterate';

import useNewsForm from './_composables/useNewsForm';

const {
  isEditMode,
  formData,
  formErrors,
  loading,
  subcategories,
  hashtags,
  previewImageUrl,
  previewImageFile,
  savedUrl,
  getData,
  onSubmit,
  onPreviewImageUploaded,
  getBack,
} = useNewsForm();

const urlDescription = computed<string>(() => {
  const base =
    'Только латинские буквы, цифры и дефис. Без символов / ? # и т.д.';
  if (!isEditMode.value || !savedUrl.value) return base;
  return `${base}<br><a href="/news/${savedUrl.value}" target="_blank" class="news-preview-link">Открыть на сайте ↗</a>`;
});

const isVisibleDescription = computed<string>(() => {
  const isVisibleOnLanding = isNewsVisibleOnLanding(formData.value);
  const isVisiblePrefix = isVisibleOnLanding
    ? '<b>Сейчас новость показана на сайте</b>'
    : '<b>Сейчас новость скрыта с сайта</b>';
  return `${isVisiblePrefix}. Новость будет отображена на сайте, если выполняются <b>все</b> условия:
    <ul>
      <li>Категория видима на сайте</li>
      <li>Подкатегория видима на сайте</li>
      <li>Новость видима на сайте</li>
    </ul>`;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findSubcategoryOption(value: unknown): any {
  const opt = (subcategories.data.value || []).find((o) => o.value === value);
  if (opt) return opt;
  const initial = subcategories.initialOption.value;
  return initial?.value === value ? initial : null;
}

watch(
  () => formData.value.title,
  () => {
    if (isEditMode.value) return;
    formData.value.url = transliterate(formData.value.title || '');
  },
);

onBeforeMount(async () => {
  loading.value = true;
  await Promise.all([getData(), subcategories.getData(1), hashtags.getData(1)]);
  loading.value = false;
});

// --- SEO ---
definePageMeta({ title: 'Новость', middleware: 'admin' });
useAccountSeoTitle(() => formData.value.title, {
  snapshot: true,
  fallback: 'Новость',
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.news-preview-link {
  display: inline-block;
  margin-top: 8px;
  color: colors.$primary;
}

.news-preview-image {
  max-height: 200px;
  max-width: 100%;
  object-fit: contain;
  border-radius: 8px;
}
</style>
