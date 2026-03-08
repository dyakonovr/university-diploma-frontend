<template>
  <div class="telegraph-page">
    <article class="telegraph-article">
      <!-- Заголовок -->
      <h1
        class="telegraph-title"
        v-html="preview.title || '<i>Заголовок не определен</i>'" />

      <!-- Дата -->
      <div class="telegraph-meta">1 января 2026</div>

      <!-- Контент -->
      <div
        class="telegraph-page__content"
        v-html="content" />

        <!-- <p>
          Мы часто думаем, что для продуктивности нужны
          <strong>большие усилия</strong>, но на практике всё работает наоборот.
        </p>

        <p>
          Иногда достаточно <em>10–15 минут</em> осознанного действия, чтобы
          сдвинуть задачу с мёртвой точки.
        </p>

        <figure class="telegraph-image">
          <img
            src="https://picsum.photos/900/500?1"
            alt="" >
          <figcaption>Маленькие шаги создают большое движение</figcaption>
        </figure>

        <blockquote>
          Не геройствуйте. Регулярность почти всегда побеждает мотивацию.
        </blockquote>

        <h2>С чего начать</h2>

        <ul>
          <li>Определите минимальное действие</li>
          <li>Уберите всё лишнее</li>
          <li>Начните без ожиданий</li>
        </ul>

        <h2>Что помогает удерживать фокус</h2>

        <ol>
          <li>Чёткое время начала</li>
          <li>Ограничение контекста</li>
          <li>Фиксация результата</li>
        </ol>

        <figure class="telegraph-gallery">
          <img src="https://picsum.photos/600/400?2" >
          <img src="https://picsum.photos/600/400?3" >
          <img src="https://picsum.photos/600/400?4" >
        </figure>

        <h2>Пример простой таблицы</h2>

        <table>
          <thead>
            <tr>
              <th>Действие</th>
              <th>Время</th>
              <th>Эффект</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Чтение</td>
              <td>10 мин</td>
              <td>Фокус</td>
            </tr>
            <tr>
              <td>Прогулка</td>
              <td>15 мин</td>
              <td>Энергия</td>
            </tr>
            <tr>
              <td>Запись мыслей</td>
              <td>5 мин</td>
              <td>Ясность</td>
            </tr>
          </tbody>
        </table>

        <h2>Код (Telegraph-style)</h2>

        <pre><code>
function startSmall() {
  return 'Consistency beats motivation';
}
        </code></pre>

        <p>
          Главное — не искать идеальные условия. Начните с того, что доступно
          прямо сейчас.
        </p> -->
    </article>
  </div>
</template>

<script lang="ts" setup>
import type { SocialPostData } from '~/domain/social-post/models/social-post-preview.types';

type Props = {
  preview: SocialPostData['post']['preview'];
};
const props = defineProps<Props>();

/**
 * Предобработка контента Telegraph-статьи. На вход приходит html
 *
 * Выполняет:
 * 1.
 */
function processContent(text: string | null | undefined): string {
  if (!text) return '';
  return text;
}

const content = computed(() =>
  processContent(props.preview?.html),
);
</script>

<style scoped lang="scss">
.telegraph-page {
  --tg-title-font:
    'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Helvetica, Arial, sans-serif;
  --tg-content-font:
    'Times New Roman', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      Helvetica, Arial, sans-serif;

  --text-main: #000;
  --text-muted: #6d6d6d;
  --border-light: #e6e6e6;
  --bg-page: #ffffff;

  background: var(--bg-page);
  font-family: var(--tg-content-font);
  display: flex;
  justify-content: center;
  padding: 32px 16px;
  border: 1px solid #e6e6e6;
  border-radius: 12px;
  
  &__title {
    font-family: var(--tg-title-font);
    font-size: 40px;
    line-height: 1.15;
    font-weight: 700;
    margin-bottom: 8px;
  }

  &__content {
    font-size: 18px;
    color: var(--text-main);

    :deep(p) {
      line-height: 1.58;
      margin: 0 0 16px;
    }
    
    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4),
    :deep(h5),
    :deep(h6) {
      font-family: var(--tg-title-font);
    }

    :deep(h2) {
      font-size: 26px;
      margin: 32px 0 12px;
    }

    :deep(ul),
    :deep(ol) {
      margin: 0 0 20px 20px;

      li {
        margin: 6px 0;
      }
    }

    :deep(blockquote) {
      margin: 24px 0;
      padding-left: 16px;
      border-left: 4px solid #000;
      font-style: italic;
    }

    :deep(table) {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
      font-size: 16px;

      :deep(th),
      :deep(td) {
        border: 1px solid var(--border-light);
        padding: 8px 10px;
        text-align: left;
      }

      :deep(th) {
        background: #f8f8f8;
      }
    }

    :deep(pre) {
      background: #f5f5f5;
      padding: 16px;
      overflow-x: auto;
      font-size: 14px;
      margin: 24px 0;
    }
  }
}

.telegraph-article {
  width: 100%;
  max-width: 720px;
}

.telegraph-meta {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 24px;
}

.telegraph-image {
  margin: 24px 0;

  img {
    width: 100%;
    border-radius: 4px;
  }

  figcaption {
    font-size: 14px;
    color: var(--text-muted);
    margin-top: 6px;
  }
}

.telegraph-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin: 24px 0;

  img {
    width: 100%;
    border-radius: 4px;
    object-fit: cover;
  }
}
</style>
