<template>
  <form-container class="divided">
    <template #header>
      <p class="permissions-title">{{ title }}</p>
      <p class="permissions-subtitle">
        {{ subtitle }}
      </p>
    </template>

    <select-ui
      v-model="model"
      :label="selectLabel || 'Выберите доступ'"
      :options="options"
      :searchable="false"
      :error="selectError"
      :select-props="{ placeholder: 'Выберите доступ', disabled: loading }"
    />
    
    <div class="form-container-padding form-container-top-half-padding">
      <button-ui
        class="permission-submit"
        :disabled="loading"
        @click="emit('onSaveButtonClick')"
      >
        {{ buttonLabel || 'Сохранить' }}
      </button-ui>
    </div>
  </form-container>
</template>

<script setup lang="ts">
import ButtonUi from '~/components/ui/ButtonUi.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { SelectOption } from '~/shared/types/ui/select.types';

defineProps<{
  title: string;
  subtitle: string;
  loading: boolean;
  options: SelectOption[];
  selectLabel?: string;
  selectError?: string | null;
  buttonLabel?: string;
}>();

const model = defineModel<EntityId | null>({ required: true });

const emit = defineEmits<{
  (e: 'onSaveButtonClick'): void;
}>();
</script>

<style scoped lang="scss">
@use '/assets/styles/base/colors' as colors;

.permissions {
  &-title {
    font-weight: 600;
    color: colors.$text;
    margin-bottom: 4px;
  }

  &-subtitle {
    font-size: 14px;
    color: colors.$text-light;
  }
}
</style>
