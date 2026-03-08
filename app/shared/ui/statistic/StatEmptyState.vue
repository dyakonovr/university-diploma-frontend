<template>
  <div class="stat-empty-state">
    <div class="stat-empty-state__chart">
      <area-chart
        :data="MOCK_CHART_DATA"
        :categories="MOCK_CATEGORIES"
        x-label="Время"
        y-label="Количество"
        :height="300"
        :padding="{ bottom: 10, left: 10, right: 0, top: 0 }"
      />
    </div>
    <div class="stat-empty-state__overlay">
      <p class="stat-empty-state__text">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  message?: string;
};

withDefaults(defineProps<Props>(), {
  message:
    'Нет данных для отображения статистики.\nДанные появятся после первого парсинга публикации.',
});

const MOCK_CHART_DATA = [
  { formattedTime: '01.01', views: 120, likes: 40 },
  { formattedTime: '02.01', views: 210, likes: 75 },
  { formattedTime: '03.01', views: 180, likes: 60 },
  { formattedTime: '04.01', views: 340, likes: 110 },
  { formattedTime: '05.01', views: 290, likes: 95 },
  { formattedTime: '06.01', views: 410, likes: 140 },
  { formattedTime: '07.01', views: 380, likes: 125 },
  { formattedTime: '08.01', views: 520, likes: 180 },
  { formattedTime: '09.01', views: 470, likes: 160 },
  { formattedTime: '10.01', views: 600, likes: 200 },
];

const MOCK_CATEGORIES = {
  views: { name: 'Просмотры', color: '#6366f1' },
  likes: { name: 'Лайки', color: '#3b82f6' },
};
</script>

<style lang="scss">
.stat-empty-state {
  position: relative;

  &__chart {
    filter: blur(6px);
    pointer-events: none;
    user-select: none;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 12px;
    z-index: 1;
  }

  &__text {
    text-align: center;
    font-size: 15px;
    line-height: 1.5;
    color: #374151;
    max-width: 400px;
    white-space: pre-line;
  }
}
</style>
