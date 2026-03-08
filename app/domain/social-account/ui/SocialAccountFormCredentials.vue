<template>
  <template
    v-for="(_, credName) in creds"
    :key="credName">
    <!-- post_mode -->
    <select-ui
      v-if="currentProvider.name === 'telegram' && credName === 'post_mode'"
      v-model="creds[credName]"
      :options="SOCIAL_ACCOUNT_TG_POST_MODE_OPTIONS"
      :label="credName"
      :error="errors[credName]"
      :searchable="false"
      :select-props="{ placeholder: 'Выберите режим постинга' }"
      :required="isRequiredCredential(credName)"
    />

    <!-- switches -->
    <switch-ui
      v-else-if="
        currentProvider.name === 'telegram' &&
          (credName === 'link_telegraph_in_message' ||
            credName === 'link_channel_in_telegraph')
      "
      v-model="creds[credName] as boolean | null"
      :label="credName"
      :error="errors[credName]"
      with-label
    />

    <!-- fallback для ВСЕХ остальных полей (включая telegram) -->
    <input-ui
      v-else
      v-model="creds[credName] as string | null"
      :label="credName"
      :error="errors[credName]"
      :required="isRequiredCredential(credName)"
    />
  </template>
</template>

<script lang="ts" setup>
import InputUi from '~/components/ui/form/InputUi.vue';
import SelectUi from '~/components/ui/form/select/SelectUi.vue';
import SwitchUi from '~/components/ui/form/SwitchUi.vue';

import { SOCIAL_ACCOUNT_TG_POST_MODE_OPTIONS } from '../constants/social-account.const';
import type { SocialAccountProvider } from '../models/social-account-provider';
import type { SocialAccountCredentialsErrors } from '../view-models/social-account.view-models';

type Props = {
  currentProvider: SocialAccountProvider;
  errors: SocialAccountCredentialsErrors;
};
const props = defineProps<Props>();

const creds = defineModel<Record<string, string | boolean | null>>({
  required: true,
});

const isRequiredCredential = (fieldName: string): boolean => {
  if (!props.currentProvider) return false;
  return props.currentProvider.required_fields.includes(fieldName);
};
</script>
