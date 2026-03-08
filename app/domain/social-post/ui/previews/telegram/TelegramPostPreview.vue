<template>
  <div class="tg-post-preview">
    <!-- Шапка канала -->
    <div class="tg-post-preview__channel-header">
      <div class="tg-post-preview__channel-title">Telegram Channel</div>
      <div class="tg-post-preview__channel-subs">100 000 subscribers</div>
    </div>

    <!-- Пост -->
    <div class="tg-post-preview__post">
      <!-- Медиа -->
      <!-- <div class="tg-post__media tg-media tg-media--grid-2">
        <img
          src="https://picsum.photos/600/400?1"
          alt="photo" >
        <img
          src="https://picsum.photos/600/400?2"
          alt="photo" >
      </div> -->

      <!-- Media -->
      <div
        v-if="preview.images.length"
        class="tg-post-preview__media tg-media"
        :class="gridClass"
      >
        <img
          v-for="(img, index) in preview.images"
          :key="index"
          :src="img"
          alt="post image"
        >
      </div>

      <!-- Контент -->
      <p
        v-if="html"
        class="tg-post-preview__html"
        v-html="html" />

      <!-- <div class="tg-post__content">
        <p class="tg-text">
          <strong>Февраль — это не просто 28 дней.</strong><br >
          Это целых <strong>28 поводов</strong> устроить себе маленький праздник
          💚
        </p>

        <p class="tg-text">
          Не обязательно ждать особого случая — иногда достаточно
          <em>маленьких шагов</em>, чтобы порадовать себя или близких.
        </p>

        <blockquote class="tg-quote">
          Начните с простого: чашка хорошего кофе, прогулка без спешки или
          покупка чего-то давно желанного.
        </blockquote>

        <p class="tg-text">
          А если хочется чего-то особенного —
          <tg-spoiler
          >в феврале для клиентов СберПремьера доступны персональные
            предложения</tg-spoiler
          >.
        </p>

        <ul class="tg-list">
          <li>повышенный кешбэк в выбранных категориях</li>
          <li>спецпредложения от партнёров</li>
          <li>бонусы за повседневные покупки</li>
        </ul>

        <p class="tg-text">
          Выбирайте любой повод для радости и помните: даже небольшие покупки
          могут быть выгоднее ✨
        </p>
      </div> -->

      <!-- Подвал поста -->
      <div class="tg-post__footer">
        <span class="tg-post__views">25K</span>
        <span class="tg-post__time">12:00</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { SocialPostData } from '~/domain/social-post/models/social-post-preview.types';

type Props = {
  preview: SocialPostData['post']['preview'];
};
const props = defineProps<Props>();

const gridClass = computed(() => {
  const count = props.preview.images.length;

  if (count === 1) return 'tg-media--grid-1';
  if (count === 2) return 'tg-media--grid-2';
  if (count === 3) return 'tg-media--grid-3';
  if (count >= 4) return 'tg-media--grid-4';

  return '';
});

/**
 * Предобработка контента Telegram-поста. На вход приходит plain-text
 *
 * Выполняет:
 * 1. Превращает \n -> <br>.
 */
function processContent(text: string | null | undefined): string {
  if (!text) return '';

  let result = text;

  // \n -> <br>
  result = result.replace(/\n/gu, '<br>')

  return result;
}

const html = computed(() =>
  processContent(props.preview?.text),
);
</script>

<style scoped lang="scss">
.tg-post-preview {
  --tg-font:
    'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Helvetica, Arial, sans-serif;
  --tg-font:
    'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Helvetica, Arial, sans-serif;
  --tg-bg: #e7ebf0;
  --tg-post-bg: #ffffff;
  --tg-text: #000000;
  --tg-muted: #707579;
  --tg-accent: #3390ec;
  --tg-border: #dfe3e8;
  --tg-quote: #e3f2fd;

  font-family: var(--tg-font);
  background: var(--tg-bg);
  padding: 0 0 12px;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--tg-border);

  &__channel-header {
    padding: 12px 16px 8px;
    background: var(--tg-post-bg);
    border-bottom: 1px solid var(--tg-border);
  }

  &__channel-title {
    font-size: 17px;
    font-weight: 600;
    color: var(--tg-text);
  }

  &__channel-subs {
    font-size: 13px;
    color: var(--tg-muted);
    margin-top: 2px;
  }

  &__post {
    width: 100%;
    max-width: 420px;
    background: var(--tg-post-bg);
    border-radius: 12px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    padding: 16px;
    margin: 12px;
  }

  &__media {
    display: grid;
    gap: 4px;
    margin-bottom: 8px;

    img,
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }

    &--grid-1 {
      grid-template-columns: 1fr;
    }

    &--grid-2 {
      grid-template-columns: repeat(2, 1fr);
    }

    &--grid-3 {
      grid-template-columns: 2fr 1fr;
      grid-auto-rows: 120px;
    }

    &--grid-4 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  &__html {
    font-size: 16px;
    color: var(--tg-text);
    line-height: 1.25;

    :deep(p) {
      margin: 0 0 12px;
    }

    /* img {
      width: 100%;
      border-radius: 8px;
      margin: 8px 0;
    } */

    :deep(ul), :deep(ol) {
      margin: 8px 0 12px 20px;
    }

    :deep(blockquote) {
      margin: 12px 0;
      padding: 8px 12px;
      border-left: 4px solid var(--tg-accent);
      background: var(--tg-quote);
      border-radius: 4px;
    }

    :deep(table) {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      font-size: 14px;

      th,
      td {
        border: 1px solid var(--tg-border);
        padding: 6px 8px;
        text-align: left;
      }

      th {
        background: #f5f6f7;
      }
    }
    
    :deep(.tg-hashtag) {
      color: var(--tg-accent);
      font-weight: 500;
    }
    
    :deep(.tg-table-wrapper) {
      overflow-x: auto;
      margin: 12px 0;
    }
  }
}

.tg-spoiler {
  background: #cfd3d8;
  color: transparent;
  border-radius: 4px;
  padding: 0 4px;
  cursor: pointer;

  &:hover {
    color: var(--tg-text);
  }
}

.tg-quote {
  margin: 12px 0;
  padding: 8px 12px;
  border-left: 4px solid var(--tg-accent);
  background: var(--tg-quote);
  border-radius: 4px;
  font-size: 15px;
}

.tg-list {
  margin: 8px 0 12px 20px;
  padding: 0;

  li {
    margin: 4px 0;
  }

  &--ordered {
    list-style: decimal;
  }
}

.tg-table {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  font-size: 14px;

  th,
  td {
    border: 1px solid var(--tg-border);
    padding: 6px 8px;
    text-align: left;
  }

  th {
    background: #f5f6f7;
  }
}

.tg-photos {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  margin: 12px 0;

  img {
    width: 100%;
    border-radius: 8px;
    object-fit: cover;
  }
}

.tg-file {
  display: flex;
  align-items: center;
  border: 1px solid var(--tg-border);
  border-radius: 8px;
  padding: 8px;
  margin: 12px 0;

  &__icon {
    width: 42px;
    height: 42px;
    background: var(--tg-accent);
    color: #fff;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-right: 10px;
  }

  &__name {
    font-size: 14px;
  }

  &__size {
    font-size: 12px;
    color: var(--tg-muted);
  }
}

.tg-link-preview {
  display: block;
  text-decoration: none;
  border-left: 4px solid var(--tg-accent);
  padding: 8px 12px;
  margin-top: 12px;

  &__title {
    font-weight: 600;
    color: var(--tg-text);
  }

  &__desc {
    font-size: 14px;
    color: var(--tg-muted);
    margin: 4px 0;
  }

  &__url {
    font-size: 13px;
    color: var(--tg-accent);
  }
}

.tg-post__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 6px;
  font-size: 12px;
  color: var(--tg-muted);
}

.tg-post__views::before {
  content: '👁';
  margin-right: 4px;
  font-size: 12px;
}
</style>
