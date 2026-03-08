<template>
  <dialog-ui
    v-model="model"
    :title="dialogTitle"
    :confirm-button-text="isEdit ? 'Сохранить' : 'Создать'"
    :auto-close-on-confirm="false"
    @confirm="handleConfirm"
  >
    <div class="schedule-slot-dialog">
      <notice-ui
        type="info"
        title="Время публикации">
        Мы не можем гарантировать, что пост будет опубликован точно в указанное
        время.
      </notice-ui>

      <input-ui
        v-model="formData.name"
        label="Название"
        :error="formErrors.name"
        description="Название будет отображено в слотах"
        :input-props="{
          placeholder: 'Введите название',
          disabled: loading,
          readonly: readonly,
        }"
      />

      <input-ui
        :model-value="
          DAYS_OF_WEEK.find((d) => d.value === formData.day_of_week)?.label ??
            ''
        "
        label="День недели"
        :input-props="{ readonly: true }"
      />

      <datepicker-ui
        v-model="timePickerModel"
        label="Время публикации"
        :error="formErrors.time"
        :disabled="loading"
        :readonly="readonly"
        :time-picker="true"
        :teleport-to-body="true"
      />

      <select-with-tags-ui
        v-if="!readonly"
        v-model="socialAccountTags"
        label="Аккаунты соц. сетей"
        :options="socialAccounts.data.value || []"
        :error="formErrors.social_account_ids"
        :select-props="{
          placeholder: 'Выберите аккаунт',
          disabled: loading || socialAccounts.loading.value,
        }"
        @update:search-query="socialAccounts.debouncedGetData(1, true)"
        @reach-end="socialAccounts.getData(socialAccounts.meta.value.page + 1)"
      >
        <template #tag="{ tag }">
          <span class="select-with-tags__tag-label">{{ tag.label }}</span>
          <social-badge
            v-if="getAccountProvider(tag.value as string)"
            :provider="getAccountProvider(tag.value as string)!"
          />
        </template>
        <template #option="{ option }">
          {{ option.label }}
          <social-badge
            v-if="getAccountProvider(option.value as string)"
            :provider="getAccountProvider(option.value as string)!"
          />
        </template>
      </select-with-tags-ui>
      <input-ui
        v-else-if="readonly && readonlyAccountLabel"
        :model-value="readonlyAccountLabel"
        label="Аккаунты соц. сетей"
        :input-props="{ readonly: true }"
      />

      <number-input-ui
        v-model="formData.lead_time_min"
        label="Время генерации до публикации (мин)"
        :min="0"
        :max="120"
        :step="10"
        :clearable="false"
        :input-props="{
          placeholder: '0',
          disabled: loading,
          readonly: readonly,
        }"
        :error="formErrors.lead_time_min"
        label-hint="За сколько минут до публикации нужно запустить генерацию"
      />

      <input-ui
        :model-value="formData.timezone"
        label="Часовой пояс"
        :input-props="{ readonly: true }"
      />

      <div
        v-if="readonly && timeSlot"
        class="schedule-slot-dialog__status-row">
        <form-wrapper-ui label="Статус">
          <tag-ui :type="timeSlot.status === 'active' ? 'success' : 'warning'">
            {{ timeSlot.status === 'active' ? 'Активен' : 'Приостановлен' }}
          </tag-ui>
        </form-wrapper-ui>
      </div>
    </div>

    <template #footer>
      <div class="schedule-slot-dialog__footer">
        <div class="schedule-slot-dialog__footer-left">
          <button-ui
            v-if="isEdit && !readonly"
            variant="outlined"
            color="danger"
            :disabled="loading"
            @click="handleDelete"
          >
            Удалить
          </button-ui>
          <button-ui
            v-if="isEdit && editingSlot && !readonly"
            variant="outlined"
            color="accent"
            :disabled="loading"
            @click="handlePauseResume"
          >
            {{
              editingSlot.status === 'active' ? 'Приостановить' : 'Возобновить'
            }}
          </button-ui>
        </div>

        <div class="schedule-slot-dialog__footer-right">
          <template v-if="readonly">
            <button-ui
              v-if="timeSlot"
              :to="`/account/flows/private/${timeSlot.flow_id}?tab=publish&slotId=${timeSlot.id}`"
              @click="model = false"
            >
              Открыть в расписании
            </button-ui>
            <button-ui
              variant="outlined"
              @click="model = false">
              Закрыть
            </button-ui>
          </template>
          <template v-else>
            <button-ui
              variant="outlined"
              :disabled="loading"
              @click="model = false"
            >
              Отмена
            </button-ui>
            <button-ui
              :disabled="loading"
              @click="
                handleConfirm(() => {
                  model = false;
                })
              "
            >
              {{ isEdit ? 'Сохранить' : 'Создать' }}
            </button-ui>
          </template>
        </div>
      </div>
    </template>
  </dialog-ui>
</template>

<script lang="ts" setup>
import SocialBadge from '~/components/SocialBadge.vue';
import ButtonUi from '~/components/ui/ButtonUi.vue';
import DialogUi from '~/components/ui/DialogUi.vue';
import DatepickerUi, {
  type TimePickerValue,
} from '~/components/ui/form/DatepickerUi.vue';
import FormWrapperUi from '~/components/ui/form/FormWrapperUi.vue';
import InputUi from '~/components/ui/form/InputUi.vue';
import NumberInputUi from '~/components/ui/form/NumberInputUi.vue';
import SelectWithTagsUi from '~/components/ui/form/select/SelectWithTagsUi.vue';
import NoticeUi from '~/components/ui/NoticeUi.vue';
import TagUi from '~/components/ui/TagUi.vue';
import {
  pauseScheduleTimeSlot,
  resumeScheduleTimeSlot,
} from '~/domain/schedule/api/schedule.api';
import { DAYS_OF_WEEK } from '~/domain/schedule/constants/schedule.const';
import type { ScheduleTimeSlot } from '~/domain/schedule/models/schedule.types';
import { getSocialAccounts } from '~/domain/social-account/api/social-account.api';
import type { SocialAccount } from '~/domain/social-account/models/social-account.types';
import type { SocialAccountProviderName } from '~/domain/social-account/models/social-account-provider';
import { useCustomToast } from '~/shared/composables/useCustomToast';
import useSelectInfiniteScroll from '~/shared/composables/useSelectInfiniteScroll';
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { SelectOption } from '~/shared/types/ui/select.types';

import useScheduleTimeSlotForm from '../composables/useScheduleTimeSlotForm';

type Props = {
  flowId: EntityId;
  dayOfWeek: number;
  timeSlot?: ScheduleTimeSlot;
  readonly?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  timeSlot: undefined,
});
const model = defineModel<boolean>();

const flowIdRef = computed(() => props.flowId);

const emit = defineEmits<{
  (e: 'saved'): void;
}>();

const { toastSuccess, toastError } = useCustomToast();

const {
  loading,
  formData,
  formErrors,
  isEdit,
  editingSlot,
  initForm,
  onSubmit,
  onDelete,
} = useScheduleTimeSlotForm({
  flowId: flowIdRef,
  onSuccess: () => {
    emit('saved');
  },
});

const dialogTitle = computed(() => {
  if (props.readonly) return 'Просмотр слота';
  return isEdit.value ? 'Редактирование слота' : 'Создание слота';
});

const timePickerModel = computed<TimePickerValue | null>({
  get() {
    const time = formData.value.time;
    if (!time) return null;
    const parts = (time as string).split(':').map(Number);
    return { hours: parts[0] ?? 0, minutes: parts[1] ?? 0 };
  },
  set(val: TimePickerValue | null) {
    if (!val) {
      formData.value.time = null;
      return;
    }
    formData.value.time = `${String(val.hours).padStart(2, '0')}:${String(val.minutes).padStart(2, '0')}`;
  },
});

const socialAccounts = useSelectInfiniteScroll<SocialAccount>({
  errorMessage: 'Ошибка загрузки аккаунтов',
  requestFunc: getSocialAccounts,
  mapFunc: (item) => ({
    label: `${item.account_name}`,
    value: item.id,
  }),
});

const getAccountProvider = (
  id: string,
): SocialAccountProviderName | undefined => {
  return socialAccounts.rawData.value?.find((a) => a.id === id)?.provider;
};

const socialAccountTags = computed<SelectOption[] | null>({
  get() {
    const ids = formData.value.social_account_ids as EntityId[] | null;
    if (!ids?.length) return null;
    return ids.map((id) => {
      const raw = socialAccounts.rawData.value?.find((a) => a.id === id);
      return { label: raw?.account_name ?? String(id), value: id };
    });
  },
  set(tags: SelectOption[] | null) {
    formData.value.social_account_ids = tags?.length
      ? tags.map((t) => t.value as EntityId)
      : (null as unknown as EntityId[]);
  },
});

const readonlyAccountLabel = computed(() => {
  const ids = props.timeSlot?.social_account_ids;
  if (!ids?.length) return '';
  return ids
    .map((id) => {
      const account = socialAccounts.rawData.value?.find((a) => a.id === id);
      return account ? `${account.account_name} (${account.provider})` : '';
    })
    .filter(Boolean)
    .join(', ');
});

const handleConfirm = async (done: () => void) => {
  await onSubmit(done);
};

const handleDelete = async () => {
  await onDelete(() => {
    model.value = false;
  });
};

const handlePauseResume = async () => {
  if (!editingSlot.value) return;
  const isActive = editingSlot.value.status === 'active';
  try {
    loading.value = true;
    if (isActive) {
      await pauseScheduleTimeSlot(editingSlot.value.id);
      editingSlot.value = { ...editingSlot.value, status: 'paused' };
      toastSuccess('Слот приостановлен');
    } else {
      await resumeScheduleTimeSlot(editingSlot.value.id);
      editingSlot.value = { ...editingSlot.value, status: 'active' };
      toastSuccess('Слот возобновлён');
    }
    emit('saved');
  } catch {
    toastError(
      isActive
        ? 'Ошибка при приостановке слота'
        : 'Ошибка при возобновлении слота',
    );
  } finally {
    loading.value = false;
  }
};

watch(
  model,
  async (newValue) => {
    if (newValue) {
      initForm(props.dayOfWeek, props.timeSlot);
      await socialAccounts.getData(1);
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;

.schedule-slot-dialog {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 1000px;

  @media screen and (max-width: 600px) {
    min-width: unset;
  }
}

.schedule-slot-dialog__status-row {
  margin-top: -4px;
}

.schedule-slot-dialog__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 8px;

  @media screen and (max-width: 576px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
}

.schedule-slot-dialog__footer-left {
  display: flex;
  gap: 8px;

  @media screen and (max-width: 576px) {
    flex-direction: column;

    > * {
      max-width: unset;
      width: 100%;
    }
  }
}

.schedule-slot-dialog__footer-right {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  align-items: center;

  @media screen and (max-width: 576px) {
    flex-direction: column;

    > * {
      max-width: unset;
      width: 100%;
    }
  }
}

.schedule-slot-dialog__flow-link {
  text-decoration: none;
}
</style>
