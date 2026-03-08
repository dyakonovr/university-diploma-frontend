<template>
  <div class="hero-tabs">
    <div class="hero-tabs__buttons">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="hero-tabs__button"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        <template v-if="tab === 'tab1'"><bulb-icon /> Создание поста</template>
        <template v-if="tab === 'tab2'"><calendar-icon /> Календарь</template>
        <template v-if="tab === 'tab3'"><file-check-icon /> Отчёт</template>
      </button>
    </div>

    <div class="hero-tabs__content">
      <div v-if="activeTab === 'tab1'"><hero-section-first-tab /></div>
      <div v-else-if="activeTab === 'tab2'"><hero-section-second-tab /></div>
      <div v-else>Контент таба 3</div>
    </div>
  </div>
</template>

<script setup>
import BulbIcon from '~/assets/images/icons/bulb.svg';
import CalendarIcon from '~/assets/images/icons/calendar.svg';
import FileCheckIcon from '~/assets/images/icons/file-check.svg';

import HeroSectionFirstTab from './HeroSectionFirstTab.vue';
import HeroSectionSecondTab from './HeroSectionSecondTab.vue';

const tabs = ['tab1', 'tab2', 'tab3'];
const activeTab = ref('tab1');
</script>

<style lang="scss" scoped>
@use '/assets/styles/base/colors' as colors;

.hero-tabs {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: colors.$background;

  &__buttons {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    height: 100%;
    border: 1px solid colors.$border;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    padding: 12px;

    svg {
      --size: 24px;

      width: var(--size);
      height: var(--size);
    }

    &.active {
      color: colors.$primary;
      border-bottom: 1px solid transparent;
    }

    @media screen and (max-width: 576px) {
      font-size: 10px;

      svg {
        --size: 14px;
      }
    }
  }

  &__content {
    flex: 1;
    border: 1px solid colors.$border;
    border-top: none;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    padding: 24px;
  }
}
</style>
