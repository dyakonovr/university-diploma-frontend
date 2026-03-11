# Workspace Pages — Conventions & Patterns

## List Pages (CardsView vs TableView)

**TableView** is reserved for admin pages only. Since the app has no admin section, `TableView` is NOT used in workspace pages.

**CardsView** is used for list pages where each item navigates to a detail/edit page (e.g., tasks).

For lists without navigation (employees, integrations — items don't have standalone pages), use a custom card grid rendered directly in the template.

### CardsView usage
```vue
<cards-view
  v-model:current-page="meta.page"
  :data="data"
  :card-link="(item) => `/workspaces/${workspaceId}/entity/${item.id}`"
  :loading="loading"
  with-pagination
  :total-pages="meta.total_pages"
  empty-html="Нет данных"
  @update:current-page="getData()"
>
  <template #title="{ item }">{{ item.title }}</template>
  <template #body="{ item }"><!-- meta info --></template>
  <template #actions="{ item }">
    <table-action-menu @delete-click="handleDelete(item)" />
  </template>
</cards-view>
```

## Create/Edit Pages

Create and edit are **form pages**, never dialogs (exception: delete confirmation, invite member, and other specific actions).

Route pattern:
- `/workspaces/[workspaceId]/entity/[entityId]` — handles both create (`entityId = 'create'`) and edit (actual ID)
- Create button in list page uses `#buttons` slot with `ButtonUi :to="..."` (dynamic workspace path)

### Form page structure
```vue
<account-form-header @get-back="getBack" />
<form-container class="divided" :loading="loading">
  <template #header>
    <p class="form-container__title">{{ editId ? 'Редактировать' : 'Создать' }}</p>
  </template>
  <template v-if="!loading">
    <!-- fields -->
    <form-wrapper-ui :reserve-label-space="true">
      <button-ui :loading="saving" @click="onSubmit">
        {{ editId ? 'Сохранить' : 'Создать' }}
      </button-ui>
    </form-wrapper-ui>
  </template>
</form-container>
```

### Form composable pattern (page-based)
```ts
function useEntityForm(workspaceId: string) {
  const route = useRoute();
  const { getBack } = useGetBack(`/workspaces/${workspaceId}/entity`);
  const loading = ref(false);  // loading initial data
  const saving = ref(false);   // form submit loading
  const editId = ref<EntityId | null>(null);

  const getData = async () => {
    if (route.params.entityId && route.params.entityId !== 'create') {
      editId.value = route.params.entityId as EntityId;
      // load data...
    }
  };

  const onSubmit = async () => {
    // validate, then create or update based on editId
    // on success: getBack()
  };

  return { loading, saving, editId, formData, formErrors, getData, onSubmit, getBack };
}
```

## Composable Structure

Each list page has `_composables/`:
- `useEntityData.ts` — fetches list, returns `{ data, loading, meta, getData }`
- `useEntityFilters.ts` — filter state, returns `{ filters, resetFilters }` (options from domain constants)
- `useEntityForm.ts` — form for create/edit page

Domain composables/stores **only** when reused across multiple pages.

## Domain Constants

Labels, tag types, select options for entities live in `domain/[entity]/constants/`.

Example: `domain/task/constants/task.constants.ts` exports:
- `PRIORITY_LABELS`, `STATUS_LABELS` — display text
- `PRIORITY_TAG`, `STATUS_TAG` — TagUi type strings
- `PRIORITY_OPTIONS`, `STATUS_OPTIONS` — SelectOption[] for selects

Example: `domain/workspace/constants/workspace-member.constants.ts` exports:
- `ROLE_LABELS`, `ROLE_TAG`, `ROLE_OPTIONS`

## Empty States

- For custom card grids: use `<p class="...__empty">Нет данных</p>`
- For CardsView: use `:empty-html="'Нет данных'"`
- **Never** use `<notice-ui>` for empty states — it's for user information notices only

## SEO Block

Always at the **bottom** of `<script setup>`, separated by comment:
```ts
// --- SEO ---
const PAGE_TITLE = 'Заголовок';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
```

## AccountTableHeader for List Pages

```vue
<account-table-header
  :with-create-link="false"
  :filters-props="{ filters, loading }"
  @filters-search="onSearch"
  @filters-reset="onReset"
>
  <template #filters>
    <!-- filter inputs/selects -->
  </template>
  <template #buttons>
    <button-ui :to="`/workspaces/${workspaceId}/entity/create`">
      Создать
    </button-ui>
  </template>
</account-table-header>
```

Use `#buttons` slot for create navigation (dynamic workspaceId → can't use static `create-link-to`).

## Page-Level Composable Location

```
pages/workspaces/[workspaceId]/entity/
  _composables/
    useEntityData.ts      ← list data fetch
    useEntityFilters.ts   ← filter state
    useEntityForm.ts      ← create/edit form
  index.vue               ← list page
  [entityId].vue          ← form page
```

## Routing

- `/workspaces` — workspace list (uses custom card grid, not CardsView)
- `/workspaces/[workspaceId]/tasks` — task list (CardsView)
- `/workspaces/[workspaceId]/tasks/[taskId]` — task create/edit form
- `/workspaces/[workspaceId]/employees` — employee list (custom card grid)
- `/workspaces/[workspaceId]/integrations` — integration list (custom card grid)
- `/workspaces/[workspaceId]/integrations/create` — integration create form
