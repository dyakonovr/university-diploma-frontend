<template>
  <form-container class="form-container-padding">
    <h3>Конструктор шаблона</h3>
    <flow-form-constructor-instruction />

    <div
      v-if="$slots.notice"
      class="notices">
      <slot name="notice" />
    </div>

    <div class="stages-list">
      <div
        v-if="flowConstructorStore.tree.length"
        class="stages-list__toolbar">
        <button-ui
          :variant="isAllCollapsed ? 'filled' : 'outlined'"
          @click="toggleCollapseAll"
        >{{
          isAllCollapsed ? 'Развернуть конструктор' : 'Свернуть конструктор'
        }}</button-ui
        >
      </div>
      <p v-if="!flowConstructorStore.tree.length">Пока здесь нет этапов...</p>
      <flow-form-stage
        v-for="(item, index) in flowConstructorStore.tree"
        v-else
        :key="item.ui.uuid"
        v-model="flowConstructorStore.tree[index]!"
        :index="index"
      />

      <button-ui
        v-if="!flowConstructorStore.readonly"
        size="large"
        class="stages-list__add-button"
        variant="outlined"
        @click="flowActions.insertStageIntoTree"
      >Добавить этап</button-ui
      >
    </div>
  </form-container>
</template>

<script setup lang="ts">
import ButtonUi from '~/components/ui/ButtonUi.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import type { Stage } from '~/domain/flow/model/stage.types';
import type { EntityId } from '~/shared/types/core/base-entity.types';

import useFlowConstructorActions from '../composables/useFlowConstructorActions';
import { PRIVATE_FLOW_CONFIG, type FlowConstructorConfig } from '../models/constructor-config';
import useFlowConstructorStore from '../stores/constructor-store';
import FlowFormConstructorInstruction from './FlowFormConstructorInstruction.vue';
import FlowFormStage from './stage/FlowFormStage.vue';

type Props = {
  flowId: EntityId;
  stages: Stage[];
  config?: FlowConstructorConfig;
};

const props = withDefaults(defineProps<Props>(), {
  config: () => PRIVATE_FLOW_CONFIG,
});

const flowConstructorStore = useFlowConstructorStore();
const flowActions = useFlowConstructorActions();

const isAllCollapsed = computed(() => {
  const tree = flowConstructorStore.tree;
  if (!tree.length) return false;
  return tree.every((stage) => stage.ui.is_collapsed);
});

const toggleCollapseAll = () => {
  const collapse = !isAllCollapsed.value;
  for (const stage of flowConstructorStore.tree) {
    stage.ui.is_collapsed = collapse;
    for (const step of stage.steps) {
      step.ui.is_collapsed = collapse;
    }
  }
};

onBeforeMount(async () => {
  await flowActions.initConstructor(props.flowId, props.stages, props.config);
});

</script>

<style lang="scss">
.notices {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stages-list {
  display: flex;
  flex-direction: column;
  margin-top: 16px;

  &__toolbar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 8px;
  }

  &__add-button {
    align-self: center;
  }
}
</style>
