<template>
  <div
    v-if="hashtags.length"
    class="news-hashtags">
    <template v-if="asLinks">
      <nuxt-link
        v-for="tag in hashtags"
        :key="tag.id"
        :to="{ path: '/news', query: { hashtag_names: tag.name } }"
        class="news-hashtags__chip news-hashtags__chip--link text-12"
      >
        {{ tag.name }}
      </nuxt-link>
    </template>
    <template v-else>
      <span
        v-for="tag in hashtags"
        :key="tag.id"
        class="news-hashtags__chip text-12"
      >
        {{ tag.name }}
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { NewsHashtag } from '~/domain/news-hashtag/models/news-hashtag.types';

withDefaults(
  defineProps<{
    hashtags: NewsHashtag[];
    asLinks?: boolean;
  }>(),
  {
    asLinks: false,
  },
);
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.news-hashtags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  &__chip {
    --background-color: #{colors.$background};
    --color: #{colors.$primary};

    display: inline-block;
    padding: 4px 10px;
    border-radius: 20px;
    background-color: var(--background-color);
    color: var(--color);
    white-space: nowrap;

    &--link {
      text-decoration: none;
      transition:
        color 0.15s ease-in-out,
        background-color 0.15s ease-in-out;

      &:hover {
        --background-color: #{colors.$primary};
        --color: #{colors.$white};
      }
    }
  }
}

[data-theme='dark'] .news-hashtags {
  &__chip {
    --background-color: rgba(255, 255, 255, 0.1);
    --color: #{colors.$primary-light};

    &--link:hover {
      --background-color: #{colors.$primary};
      --color: #{colors.$white};
    }
  }
}
</style>
