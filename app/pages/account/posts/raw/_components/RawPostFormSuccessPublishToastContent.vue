<template>
  <p
    v-if="isBulkPosting"
    class="toast-content">Посты успешно созданы. <a
      class="toast-content__link"
      :href="linkTo">Перейти к списку постов в соц. сетях</a></p>

  <p
    v-else
    class="toast-content">Пост успешно создан. <a
      class="toast-content__link"
      :href="linkTo">Перейти к детальной странице поста</a></p>
</template>

<script lang="ts" setup>
type Props = {
  isBulkPosting: boolean;
  linkTo: string;
};
defineProps<Props>();
</script>

<style scoped lang="scss">
@use '/assets/styles/base/colors' as colors;

.toast-content {
  font-size: 14px;
  color: colors.$white;

  &__link {
    color: colors.$white;
    text-decoration: underline;
  }
}
</style>
