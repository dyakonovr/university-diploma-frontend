<template>
  <word-press-layout>
    <section class="wp-cards">
      <article class="wp-card">
        <img
          class="wp-card__image"
          src="https://picsum.photos/600/400"
          alt="Preview"
        >

        <div class="wp-card__content">
          <p class="wp-card__meta">Technology · 2 min read</p>
          <h2 class="wp-card__title">
            How minimal design makes content more readable
          </h2>
          <p class="wp-card__excerpt">
            A short look at why WordPress themes focus on typography instead of
            heavy visuals.
          </p>
        </div>
      </article>
    </section>
  </word-press-layout>
</template>

<script setup lang="ts">
import WordPressLayout from './WordpressLayout.vue';
</script>

<style lang="scss">
.wp-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.wp-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }

  &__image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  &__content {
    padding: 20px;
  }

  &__meta {
    font-size: 13px;
    color: #646970;
    margin-bottom: 8px;
  }

  &__title {
    font-size: 20px;
    line-height: 1.3;
    font-weight: 600;
    margin-bottom: 8px;
  }

  &__excerpt {
    font-size: 15px;
    line-height: 1.6;
    color: #3c434a;
  }
}
</style>
