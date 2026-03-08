<template>
  <section
    id="reviews"
    class="reviews">
    <div class="reviews__container landing-container">
      <h2 class="reviews__title headline-1 landing-title">
        {{ t('landing.reviews.title') }}
      </h2>
      <div class="reviews__subtitle text-18">
        {{ t('landing.reviews.subtitlePart1') }}
        <div class="reviews__subtitle-group">
          <span class="reviews__subtitle-stars">
            <star-icon
              v-for="key in 5"
              :key="key" />
          </span>
          {{ t('landing.reviews.subtitlePart2') }}
        </div>
      </div>
      <ul class="reviews__list list-reset">
        <li
          v-for="item in items"
          :key="rt(item.title)"
          class="reviews__item">
          <div class="reviews__item-header">
            <div class="reviews__item-avatar">
              <user-icon />
            </div>
            <div class="reviews__item-titles">
              <p
                class="reviews__item-title text-18"
                v-html="rt(item.title)" />
              <p
                class="reviews__item-subtitle text-12"
                v-html="rt(item.subtitle)"
              />
              <div class="reviews__item-stars">
                <client-only>
                  <star-icon
                    v-for="(_, idx) in Number(rt(item.rating))"
                    :key="idx"
                  />
                </client-only>
              </div>
            </div>
          </div>
          <expandable-text
            :text="rt(item.text)"
            :max-length="200"
            class="reviews__item-content text-14 weight-500"
          />
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
import StarIcon from '@/assets/images/icons/star.svg';
import UserIcon from '@/assets/images/icons/user.svg';
import ExpandableText from '~/components/ExpandableText.vue';
import type { Review } from '~/shared/types/ui/landing.types';
const { t, tm, rt } = useI18n();

const selectedIndexes = ref<number[]>([]);

const mathRandom = useState('faq-math-random', () => Math.random());

function pickIndexes(length: number) {
  const count = Math.floor(mathRandom.value) + 4;
  return [...Array(length).keys()]
    .sort(() => mathRandom.value - 0.5)
    .slice(0, count);
}

watchEffect(() => {
  const all = tm('landing.reviews.items') as Review[];

  if (!selectedIndexes.value.length && all.length) {
    selectedIndexes.value = pickIndexes(all.length);
  }
});

const items = computed<Review[]>(() => {
  const all = tm('landing.reviews.items') as Review[];
  return selectedIndexes.value.map((i) => all[i]).filter(Boolean) as Review[];
});
</script>

<style lang="scss">
@use '/assets/styles/base/offsets' as offsets;
@use '/assets/styles/base/colors' as colors;

.reviews {
  &__subtitle {
    --color: #{colors.$text-light};

    color: var(--color);
    text-align: center;

    &-stars {
      vertical-align: middle;
      display: inline-block;
    }

    &-group {
      display: inline-flex;
      align-items: center;
      white-space: nowrap;
      gap: 4px;
    }
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: offsets.$offset-24;
    margin-top: offsets.$offset-40;

    @media screen and (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 768px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  &__item {
    --border-color: #{colors.$border};
    --background-color: #{colors.$white};

    display: flex;
    flex-direction: column;
    gap: offsets.$offset-16;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: offsets.$offset-24;
    background-color: var(--background-color);

    &-header {
      display: flex;
      gap: 20px;
    }

    &-avatar {
      --border-color: #{colors.$border};
      --background-color: #{colors.$background};

      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 50px;
      max-width: 50px;
      height: 50px;
      border: 1px solid var(--border-color);
      border-radius: 100%;
      background-color: var(--background-color);

      svg {
        width: 30px;
        height: 30px;
        color: colors.$border;
      }
    }

    &-titles {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-bottom: 5px;
    }

    &-title {
      line-height: 20px;
    }

    &-stars {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 5px;
    }

    &-content {
      --color: #{colors.$text-light};

      color: var(--color);
    }
  }
}

[data-theme='dark'] .reviews {
  &__subtitle {
    --color: colors.$border;
  }

  &__item {
    --background-color: #{colors.$dark-grey};

    &-avatar {
      --background-color: transparent;
    }

    &-content {
      --color: #{colors.$background};
    }
  }
}
</style>
