# Frontend Plan: News Feed Module

## Context

The backend now supports a News module — an aggregated industry news feed for the CEO/director. News articles are fetched from external sources (Yandex Dzen RSS or a custom parsing service) via the integration system and stored in the backend database. The frontend needs a new "Новости" page where workspace members can browse the news feed.

News is **read-only** — all articles come from external sync. No create/edit/delete on the frontend side. The user can trigger sync from the integrations page (existing flow).

---

## Backend API

### List news articles
```
GET /api/v1/workspaces/{workspaceId}/news?page=1&per_page=20&source_name=...&category=...&integration_id=...
```

Response:
```json
{
  "data": [
    {
      "id": "uuid",
      "workspace_id": "uuid",
      "integration_id": "uuid",
      "title": "Конкурент запустил новую линейку продуктов",
      "summary": "Краткое описание новости...",
      "content": "Полный текст статьи...",
      "source_url": "https://original-source.com/article",
      "image_url": "https://cdn.example.com/image.jpg",
      "source_name": "ТехКрунч",
      "category": "Рынок",
      "published_at": "2026-03-27T10:00:00Z",
      "external_id": "article-123",
      "external_source": "custom_parser",
      "created_at": "2026-03-27T10:05:00Z"
    }
  ],
  "meta": {
    "request_id": "...",
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 42,
      "total_pages": 3
    }
  }
}
```

Query parameters (all optional):
| Param | Type | Description |
|-------|------|-------------|
| `source_name` | string | Filter by source name (e.g. "РБК") |
| `category` | string | Filter by category (e.g. "Технологии") |
| `integration_id` | uuid | Filter by specific integration |
| `page` | int | Page number (default 1) |
| `per_page` | int | Items per page (default 20) |

### Get single article
```
GET /api/v1/workspaces/{workspaceId}/news/{articleId}
```

Response: same article shape, wrapped in `{ "data": ... }`.

### Sync (from integrations page — already exists)
```
POST /api/v1/workspaces/{workspaceId}/integrations/{integrationId}/sync
```
Response: `{ "data": { "created": 5, "updated": 2, "errors": [] } }`

### Integration config (already handled by integrations page)

The `GET /api/v1/workspaces/{workspaceId}/integrations/available` endpoint now returns two new `news_source` providers:

- **yandex_dzen** — RSS feed from Yandex Dzen. Config: `feed_url` (required), `topic` (optional).
- **webhook** (Custom News Service) — external parsing service. Config: `news_fetch_url`, `health_url` (required), `auth_token` (optional).

The existing integrations create/edit form should already render these dynamically from `config_fields`. No frontend changes needed for this.

---

## Implementation

### Step 1: Domain — Types

**File:** `app/domain/news/models/news.types.ts`

```typescript
import type { BaseEntity, EntityId } from '~/shared/types/core/base-entity.types';

export type NewsArticle = BaseEntity & {
  workspace_id: EntityId;
  integration_id: EntityId;
  title: string;
  summary: string | null;
  content: string | null;
  source_url: string | null;
  image_url: string | null;
  source_name: string;
  category: string | null;
  published_at: string;
  external_id: string;
  external_source: string;
  created_at: string;
};

export type NewsFilters = {
  source_name: string | null;
  category: string | null;
  integration_id: string | null;
};
```

### Step 2: Domain — API

**File:** `app/domain/news/api/news.api.ts`

```typescript
import type { EntityId } from '~/shared/types/core/base-entity.types';
import type { QueryParams, ResponseWithPagination, Response } from '~/shared/types/core/request.types';
import type { NewsArticle } from '../models/news.types';
import request from '~/shared/utils/core/request.client';

export function getNewsArticles(
  workspaceId: EntityId,
  params?: QueryParams,
  signal: AbortSignal | null = null,
) {
  return request<ResponseWithPagination<NewsArticle[]>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/news`,
    method: 'GET',
    params,
    signal,
  });
}

export function getNewsArticle(
  articleId: EntityId,
  workspaceId: EntityId,
  signal: AbortSignal | null = null,
) {
  return request<Response<NewsArticle>>({
    baseUrl: 'MAIN',
    url: `/workspaces/${workspaceId}/news/${articleId}`,
    method: 'GET',
    signal,
  });
}
```

### Step 3: Domain — Constants

**File:** `app/domain/news/constants/news.constants.ts`

```typescript
// Table column definitions for list view
import type { TableViewHeaderColumn } from '~/components/list-views/table-view.types';

export const NEWS_TABLE_COLUMNS: TableViewHeaderColumn[] = [
  { prop: 'title', label: 'Заголовок', minWidth: 280 },
  { prop: 'source_name', label: 'Источник', minWidth: 120 },
  { prop: 'category', label: 'Категория', minWidth: 120 },
  { prop: 'published_at', label: 'Дата', minWidth: 140 },
  { prop: 'actions', label: '', minWidth: 60 },
];

// External source labels for display
export const EXTERNAL_SOURCE_LABELS: Record<string, string> = {
  yandex_dzen: 'Яндекс Дзен',
  custom_parser: 'Парсер новостей',
};
```

### Step 4: Composables

**File:** `app/pages/index/workspaces/[workspaceId]/news/_composables/useNewsData.ts`

```typescript
import { ref } from 'vue';
import type { ResponsePagination } from '~/shared/types/core/request.types';
import type { NewsArticle, NewsFilters } from '~/domain/news/models/news.types';
import { getNewsArticles } from '~/domain/news/api/news.api';
import { objectToQueryString } from '~/shared/utils/core/query.utils';

function useNewsData(
  workspaceId: string,
  options?: {
    requestParams?: () => Record<string, string | null | number>;
  },
) {
  const { toastError } = useCustomToast();

  const loading = ref(false);
  const data = ref<NewsArticle[]>([]);
  const meta = ref<ResponsePagination>({
    page: 1,
    total_pages: 1,
    per_page: 20,
    total: 0,
  });

  const getData = async () => {
    try {
      loading.value = true;

      const params = objectToQueryString({
        page: meta.value.page,
        per_page: meta.value.per_page,
        ...options?.requestParams?.(),
      });

      const response = await getNewsArticles(workspaceId, params);
      data.value = response.data;
      meta.value = response.meta.pagination;
    } catch (e) {
      console.error(e);
      toastError('Ошибка загрузки новостей');
      showRequestError(e);
    } finally {
      loading.value = false;
    }
  };

  return { loading, data, meta, getData };
}

export default useNewsData;
```

**File:** `app/pages/index/workspaces/[workspaceId]/news/_composables/useNewsTableFilters.ts`

```typescript
import { ref } from 'vue';
import type { NewsFilters } from '~/domain/news/models/news.types';

function useNewsTableFilters() {
  const filters = ref<NewsFilters>({
    source_name: null,
    category: null,
    integration_id: null,
  });

  const resetFilters = () => {
    filters.value = {
      source_name: null,
      category: null,
      integration_id: null,
    };
  };

  return { filters, resetFilters };
}

export default useNewsTableFilters;
```

### Step 5: Pages

#### List page

**File:** `app/pages/index/workspaces/[workspaceId]/news/index.vue`

```vue
<template>
  <section class="news-page">
    <account-table-header
      :with-create-link="false"
      :filters-props="{ filters, loading }"
      @filters-search="onSearch"
      @filters-reset="onReset"
    >
      <template #filters>
        <input-ui
          v-model="filters.source_name"
          label="Источник"
          placeholder="Название источника"
        />
        <input-ui
          v-model="filters.category"
          label="Категория"
          placeholder="Категория"
        />
      </template>
    </account-table-header>

    <!-- Card layout for news (not a table — news is more visual) -->
    <div v-if="loading" class="news-page__loading">
      <!-- loading skeleton or spinner -->
    </div>

    <div v-else-if="data.length === 0" class="news-page__empty">
      <p>Нет новостей.</p>
      <p>Настройте источник новостей в разделе
        <nuxt-link :to="`/workspaces/${workspaceId}/integrations`">Интеграции</nuxt-link>.
      </p>
    </div>

    <div v-else class="news-page__grid">
      <news-card
        v-for="article in data"
        :key="article.id"
        :article="article"
        @click="openArticle(article)"
      />
    </div>

    <!-- Pagination -->
    <pagination-ui
      v-if="meta.total_pages > 1"
      v-model:current-page="meta.page"
      :total-pages="meta.total_pages"
      @update:current-page="getData()"
    />
  </section>
</template>

<script setup lang="ts">
import type { NewsArticle } from '~/domain/news/models/news.types';
import { WORKSPACE_ID_KEY } from '~/shared/constants/provide-keys';
import useNewsData from './_composables/useNewsData';
import useNewsTableFilters from './_composables/useNewsTableFilters';

const workspaceId = inject(WORKSPACE_ID_KEY)!;
const router = useRouter();

const { filters, resetFilters } = useNewsTableFilters();

const { data, loading, meta, getData } = useNewsData(workspaceId, {
  requestParams: () => ({
    source_name: filters.value.source_name,
    category: filters.value.category,
    integration_id: filters.value.integration_id,
  }),
});

const onSearch = () => {
  meta.value.page = 1;
  getData();
};

const onReset = () => {
  resetFilters();
  onSearch();
};

const openArticle = (article: NewsArticle) => {
  router.push(`/workspaces/${workspaceId}/news/${article.id}`);
};

onBeforeMount(async () => {
  await getData();
});

const PAGE_TITLE = 'Новости';
definePageMeta({ title: 'Новости' });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
.news-page {
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 16px;
    padding: 16px 0;
  }

  &__empty {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-secondary);

    a {
      color: var(--primary);
    }
  }
}
</style>
```

#### Detail page

**File:** `app/pages/index/workspaces/[workspaceId]/news/[articleId].vue`

```vue
<template>
  <div class="news-detail-page">
    <account-form-header @get-back="getBack" />

    <div v-if="loading" class="news-detail-page__loading">
      <!-- loading spinner -->
    </div>

    <article v-else-if="article" class="news-detail-page__article">
      <header class="news-detail-page__header">
        <h1>{{ article.title }}</h1>
        <div class="news-detail-page__meta">
          <tag-ui type="info">{{ article.source_name }}</tag-ui>
          <tag-ui v-if="article.category" type="default">{{ article.category }}</tag-ui>
          <span class="news-detail-page__date">
            {{ formatDate(article.published_at) }}
          </span>
        </div>
      </header>

      <img
        v-if="article.image_url"
        :src="article.image_url"
        :alt="article.title"
        class="news-detail-page__image"
      />

      <div v-if="article.content" class="news-detail-page__content">
        {{ article.content }}
      </div>
      <div v-else-if="article.summary" class="news-detail-page__content">
        {{ article.summary }}
      </div>

      <footer class="news-detail-page__footer">
        <a
          v-if="article.source_url"
          :href="article.source_url"
          target="_blank"
          rel="noopener noreferrer"
          class="news-detail-page__source-link"
        >
          Читать оригинал &rarr;
        </a>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { NewsArticle } from '~/domain/news/models/news.types';
import { getNewsArticle } from '~/domain/news/api/news.api';
import { WORKSPACE_ID_KEY } from '~/shared/constants/provide-keys';

const workspaceId = inject(WORKSPACE_ID_KEY)!;
const route = useRoute();
const { getBack } = useGetBack(`/workspaces/${workspaceId}/news`);
const { toastError } = useCustomToast();

const loading = ref(false);
const article = ref<NewsArticle | null>(null);

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

onBeforeMount(async () => {
  const articleId = route.params.articleId as string;
  loading.value = true;
  try {
    const response = await getNewsArticle(articleId, workspaceId);
    article.value = response.data;
  } catch (e) {
    toastError('Ошибка загрузки новости');
    showRequestError(e);
    getBack();
  } finally {
    loading.value = false;
  }
});

const PAGE_TITLE = 'Новость';
definePageMeta({ title: 'Новость' });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
.news-detail-page {
  &__header {
    margin-bottom: 20px;

    h1 {
      font-size: 1.5rem;
      margin-bottom: 12px;
    }
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__date {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  &__image {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  &__content {
    line-height: 1.6;
    white-space: pre-wrap;
    margin-bottom: 24px;
  }

  &__source-link {
    color: var(--primary);
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
```

### Step 6: News Card Component

**File:** `app/pages/index/workspaces/[workspaceId]/news/_components/NewsCard.vue`

```vue
<template>
  <div class="news-card" @click="$emit('click')">
    <div v-if="article.image_url" class="news-card__image">
      <img :src="article.image_url" :alt="article.title" />
    </div>
    <div class="news-card__body">
      <h3 class="news-card__title">{{ article.title }}</h3>
      <p v-if="article.summary" class="news-card__summary">
        {{ truncate(article.summary, 150) }}
      </p>
      <div class="news-card__footer">
        <div class="news-card__tags">
          <tag-ui type="info" size="small">{{ article.source_name }}</tag-ui>
          <tag-ui v-if="article.category" type="default" size="small">
            {{ article.category }}
          </tag-ui>
        </div>
        <span class="news-card__date">{{ relativeDate(article.published_at) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NewsArticle } from '~/domain/news/models/news.types';

defineProps<{
  article: NewsArticle;
}>();

defineEmits<{
  click: [];
}>();

const truncate = (text: string, maxLen: number) => {
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
};

const relativeDate = (dateStr: string) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'только что';
  if (diffHours < 24) return `${diffHours} ч. назад`;
  if (diffDays < 7) return `${diffDays} дн. назад`;
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
};
</script>

<style lang="scss">
.news-card {
  background: var(--surface);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s;
  border: 1px solid var(--border);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &__image {
    height: 180px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__body {
    padding: 16px;
  }

  &__title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__summary {
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 12px;
    line-height: 1.4;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__tags {
    display: flex;
    gap: 4px;
  }

  &__date {
    font-size: 0.75rem;
    color: var(--text-tertiary);
  }
}
</style>
```

### Step 7: Sidebar Navigation

**File:** `app/components/layouts/account/sidebar/sidebar-menu.config.ts`

Add a new entry to the workspace section (after the existing items like Tasks, Calendar, etc.):

```typescript
{
  type: 'workspace-route',
  workspacePath: '/news',
  title: 'Новости',
  icon: NewsIcon, // use any suitable icon from assets/images/icons/
},
```

---

## Testing with Backend

The backend has a full test environment with a mock news API and connector. To seed test data:

```bash
# In the backend repo:
make test-env-init          # starts all services (secretary + redmine + mattermost + news)
# or
bash scripts/setup-test-env.sh news   # only news services
```

After seeding:
- **Secretary** runs at `http://localhost:8000`
- **Mock News API** at `http://localhost:9002` (returns 6 industry news articles)
- **News Connector** at `http://localhost:9001` (translates mock API format → Secretary contract)
- Login: `admin@mail.com` / `admin123456`
- The seeder auto-creates a `news_source` integration (Custom News Service) and syncs 6 articles

You can immediately test the frontend against this environment — the `GET /news` endpoint will return the synced articles.

---

## File Summary

| Action | File |
|--------|------|
| CREATE | `app/domain/news/models/news.types.ts` |
| CREATE | `app/domain/news/api/news.api.ts` |
| CREATE | `app/domain/news/constants/news.constants.ts` |
| CREATE | `app/pages/index/workspaces/[workspaceId]/news/index.vue` |
| CREATE | `app/pages/index/workspaces/[workspaceId]/news/[articleId].vue` |
| CREATE | `app/pages/index/workspaces/[workspaceId]/news/_composables/useNewsData.ts` |
| CREATE | `app/pages/index/workspaces/[workspaceId]/news/_composables/useNewsTableFilters.ts` |
| CREATE | `app/pages/index/workspaces/[workspaceId]/news/_components/NewsCard.vue` |
| UPDATE | `app/components/layouts/account/sidebar/sidebar-menu.config.ts` |

## Implementation Order

1. Domain layer — types, API, constants
2. Composables — `useNewsData`, `useNewsTableFilters`
3. `NewsCard` component
4. List page (`news/index.vue`)
5. Detail page (`news/[articleId].vue`)
6. Sidebar entry
7. Test against `make test-env-init` backend

## Notes

- No create/edit/delete — news is read-only, all data comes from sync
- No "mark as read" — not needed for MVP
- No categories/tags CRUD — categories come as-is from external sources
- The integrations page already handles `news_source` type dynamically via `config_fields` — no changes needed there
- Sync is triggered from the integrations page (existing "Sync" button)
