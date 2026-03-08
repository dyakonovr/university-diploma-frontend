<template>
  <section
    id="faq"
    class="faq">
    <div class="faq__container landing-container">
      <h2 class="faq__title landing-title headline-1">
        {{ t('landing.faq.title') }}
      </h2>
      <div class="faq__list">
        <faq-section-accordion
          v-for="item in items"
          :key="item.name"
          :content="item"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { FaqItem } from '~/shared/types/ui/landing.types';

import FaqSectionAccordion from './FaqSectionAccordion.vue';

const { t, tm } = useI18n();

const selectedIndexes = ref<number[]>([]);

const mathRandom = useState('faq-math-random', () => Math.random());

function pickIndexes(length: number) {
  const count = Math.floor(mathRandom.value * 4) + 5;
  return [...Array(length).keys()]
    .sort(() => mathRandom.value - 0.5)
    .slice(0, count);
}

watchEffect(() => {
  const all = tm('landing.faq.items') as FaqItem[];

  if (!selectedIndexes.value.length && all.length) {
    selectedIndexes.value = pickIndexes(all.length);
  }
});

const items = computed<FaqItem[]>(() => {
  const all = tm('landing.faq.items') as FaqItem[];
  return selectedIndexes.value.map((i) => all[i]).filter(Boolean) as FaqItem[];
});
</script>

<style lang="scss">
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;

.faq {
  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: offsets.$offset-40;
  }
}
</style>
