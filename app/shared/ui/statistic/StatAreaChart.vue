<template>
  <div class="stat-area-chart">
    <area-chart
      :data="data"
      :categories="categories"
      x-label="Время"
      x-grid-line
      x-tick-line
      :x-formatter="xFormatter"
      y-label="Количество"
      y-grid-line
      y-tick-line
      :y-formatter="yFormatter"
      :height="height"
      :legend-style="{ marginTop: '25px' }"
      :padding="{ bottom: 10, left: 10, right: 0, top: 0 }"
    />
  </div>
</template>

<script setup lang="ts">
type Props = {
  data: Record<string, unknown>[];
  categories: Record<string, BulletLegendItemInterface>;
  xFormatter?: (tick: number) => string;
  yFormatter?: (tick: number) => string;
  height?: number;
};

withDefaults(defineProps<Props>(), {
  xFormatter: undefined,
  yFormatter: undefined,
  height: 300,
});
</script>

<style lang="scss">
.stat-area-chart {
  max-width: 100%;
  overflow: hidden;
}
</style>
