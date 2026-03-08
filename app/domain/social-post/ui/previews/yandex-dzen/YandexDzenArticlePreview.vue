<template>
  <yandex-dzen-layout>
    <button
      type="button"
      class="dzen-article__get-back"
      @click="onGetBackButtonClick"><arrow-left-icon /> Вернуться обратно</button>

    <article class="dzen-article">
      <!-- Заголовок -->
      <h1
        v-if="preview.title"
        class="article-title"
        v-html="preview.title" />

      <!-- <p class="article-lead">
        Иногда самые очевидные решения оказываются ошибочными. В этой статье
        разберёмся, почему так происходит, на примерах, таблицах и наглядных
        схемах.
      </p> -->

      <!-- <figure class="article-image">
        <img
          src="https://picsum.photos/900/450"
          alt="Иллюстрация к статье" >
        <figcaption>
          Иллюстрация: абстрактное изображение для привлечения внимания
        </figcaption>
      </figure> -->

      <p v-html="content" />
      <!-- <p>
        Мы привыкли доверять интуиции и прошлому опыту. Однако исследования
        показывают, что в ряде случаев такие решения приводят к систематическим
        ошибкам.
      </p>

      <h2>Пример из повседневной жизни</h2>

      <p>
        Представьте ситуацию: вы выбираете самый «надёжный» вариант, потому что
        он уже проверен временем. Но что, если условия изменились?
      </p>

      <ul>
        <li>Контекст больше не актуален</li>
        <li>Изменились внешние условия</li>
        <li>Появились новые альтернативы</li>
      </ul>

      <p>В результате привычное решение перестаёт быть оптимальным.</p>

      <blockquote>
        «Мы не ошибаемся потому, что плохо думаем. Мы ошибаемся потому, что
        думаем одинаково слишком долго».
      </blockquote>

      <h2>Сравнение подходов</h2>

      <p>
        Ниже приведена таблица, показывающая разницу между привычным и
        адаптивным подходами.
      </p>

      <table class="article-table">
        <thead>
          <tr>
            <th>Критерий</th>
            <th>Привычный подход</th>
            <th>Адаптивный подход</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Гибкость</td>
            <td>Низкая</td>
            <td>Высокая</td>
          </tr>
          <tr>
            <td>Скорость реакции</td>
            <td>Медленная</td>
            <td>Быстрая</td>
          </tr>
          <tr>
            <td>Результат</td>
            <td>Предсказуемый</td>
            <td>Оптимизированный</td>
          </tr>
        </tbody>
      </table>

      <h2>Нумерованный алгоритм действий</h2>

      <ol>
        <li>Оценить текущую ситуацию</li>
        <li>Сравнить с прошлым опытом</li>
        <li>Проверить, не изменились ли условия</li>
        <li>Выбрать стратегию под текущий контекст</li>
      </ol>

      <div class="article-highlight">
        <strong>Важно:</strong>
        даже небольшое изменение условий может полностью обесценить прошлый
        опыт.
      </div>

      <figure class="article-image">
        <img
          src="https://picsum.photos/900/500?random=2"
          alt="Дополнительная иллюстрация"
        >
        <figcaption>
          Иногда визуализация помогает понять проблему быстрее
        </figcaption>
      </figure>

      <h2>Вывод</h2>

      <p>
        Привычки — полезный инструмент, но только до тех пор, пока мы осознанно
        проверяем их актуальность. Гибкость мышления становится ключевым навыком
        в быстро меняющемся мире.
      </p> -->
    </article>
  </yandex-dzen-layout>
</template>

<script setup lang="ts">
import { marked } from 'marked';

import ArrowLeftIcon from '~/assets/images/icons/arrow-left.svg';
import type { SocialPostData } from '~/domain/social-post/models/social-post-preview.types';

import YandexDzenLayout from './YandexDzenLayout.vue';

type Props = {
  preview: SocialPostData['post']['preview'];
};
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'onGetBackButtonClick'): void;
}>();

marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * Предобработка контента Dzen-статьи. На вход приходит html
 *
 * Выполняет:
 * 1. Парсит markdown -> html
 */
function processContent(text: string | null | undefined): string {
  if (!text) return '';
  return marked.parse(text) as string;
}

const content = computed(() =>
  processContent(props.preview?.html),
);

const onGetBackButtonClick = () => emit('onGetBackButtonClick');
</script>

<style lang="scss" scoped>
.dzen-article {
  --zenColorStrokeImage: rgba(0, 0, 0, 0.12);
  --borderWidth: 0.5px;
  --borderImage: var(--borderWidth) solid var(--zenColorStrokeImage);

  max-width: 680px;
  margin: 0 auto;
  font-size: 16px;
  line-height: 1.6;

  &__get-back {
    display: flex;
    align-items: center;
    gap: 4px;
    color: blue;
    cursor: pointer;
    width: fit-content;
    
    svg {
      width: 20px;
    }
  }

  :deep(h1) {
    margin: 24px 0 16px;
    font-size: 28px;
    font-weight: 700;
  }

  :deep(h2) {
    margin: 32px 0 16px;
    font-size: 22px;
    font-weight: 600;
  }

  :deep(h3) {
    margin: 24px 0 12px;
  }

  :deep(p) {
    font-size: 17px;
    line-height: 28px;
    margin: 0 0 16px;
  }

  :deep(ul),
  :deep(ol) {
    margin: 0 0 20px 20px;

    :deep(li) {
      margin-bottom: 8px;
    }
  }

  :deep(blockquote) {
    margin: 24px 0;
    padding-left: 16px;
    border-left: 4px solid #000;
    font-style: italic;
  }

  :deep(img) {
    border: var(--borderImage);
    border-radius: 20px;
  }

  :deep(strong) {
    font-weight: 600;
  }
}

.article-title {
  margin-bottom: 12px;
}

.article-lead {
  font-size: 18px;
  color: #555;
  margin-bottom: 24px;
}

.article-image {
  margin: 24px 0;

  img {
    width: 100%;
    border-radius: 12px;
    display: block;
  }

  figcaption {
    margin-top: 6px;
    font-size: 13px;
    color: #777;
  }
}

.article-table {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;

  th,
  td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
  }

  th {
    background: #f5f5f5;
    font-weight: 600;
  }
}

.article-highlight {
  margin: 24px 0;
  padding: 16px;
  background: #fef3c7;
  border-radius: 12px;
}
</style>
