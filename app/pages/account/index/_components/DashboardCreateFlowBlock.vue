<template>
  <form-container
    v-if="showBlock"
    class="divided">
    <div class="dashboard-create-flow form-container-padding">
      <div class="dashboard-create-flow__icon">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      </div>
      <div class="dashboard-create-flow__content">
        <p class="dashboard-create-flow__title">Создайте ваш первый шаблон</p>
        <p class="dashboard-create-flow__description">
          Шаблоны автоматизируют создание контента для ваших социальных сетей.
        </p>
      </div>
      <nuxt-link
        to="/account/flows/private/create"
        class="dashboard-create-flow__link"
      >
        Создать шаблон
      </nuxt-link>
    </div>
  </form-container>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import { getPrivateFlows } from '~/domain/flow/api/private-flows.api';
// import { useCustomToast } from '~/shared/composables/useCustomToast';
import { objectToQueryString } from '~/shared/utils/core/objectToQueryString';

const showBlock = ref(false);
// const { toastError } = useCustomToast();

onBeforeMount(async () => {
  try {
    const params = objectToQueryString({ per_page: 1 });
    const response = await getPrivateFlows(params);
    showBlock.value = response.meta.pagination.total === 0;
  } catch {
    // toastError('Ошибка при проверке шаблонов');
  }
});
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.dashboard-create-flow {
  display: flex;
  align-items: center;
  gap: 16px;

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: linear-gradient(135deg, colors.$primary-light, colors.$primary);
    color: colors.$white;
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: colors.$text;
    margin-bottom: 4px;
  }

  &__description {
    font-size: 14px;
    color: colors.$text-light;
    line-height: 1.4;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    padding: 8px 20px;
    border-radius: 8px;
    background-color: colors.$primary;
    color: colors.$white;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    white-space: nowrap;
    transition: background-color 0.2s;

    &:hover {
      background-color: colors.$primary-dark;
    }
  }
}
</style>
