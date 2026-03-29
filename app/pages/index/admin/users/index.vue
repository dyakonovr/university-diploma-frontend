<template>
  <section class="admin-users-page">
    <account-table-header :with-filters="false" :with-create-link="false" />

    <table-view
      v-model:current-page="meta.page"
      with-pagination
      :header-columns="TABLE_COLUMNS"
      :table-data="data"
      :total-pages="meta.total_pages"
      :loading="loading"
      @update:current-page="getData()"
    >
      <template #name="item">
        {{ item.name || "—" }}
      </template>

      <template #email="item">
        {{ item.email }}
      </template>

      <template #is_admin="item">
        <tag-ui v-if="item.is_admin" type="success"> Админ </tag-ui>
      </template>

      <template #blocked_at="item">
        <tag-ui :type="item.blocked_at ? 'error' : 'success'">
          {{ item.blocked_at ? "Заблокирован" : "Активен" }}
        </tag-ui>
      </template>

      <template #created_at="item">
        {{ new Date(item.created_at).toLocaleDateString("ru-RU") }}
      </template>

      <template #actions="item">
        <table-action-menu :can-edit="false" :can-delete="false">
          <table-action-menu-item @click="toggleBlock(item)">
            <lock-icon />
            {{ item.blocked_at ? "Разблокировать" : "Заблокировать" }}
          </table-action-menu-item>
        </table-action-menu>
      </template>
    </table-view>
  </section>
</template>

<script setup lang="ts">
import LockIcon from "@/assets/images/icons/lock.svg";
import TableView from "~/components/list-views/TableView.vue";
import AccountTableHeader from "~/components/pages/account/AccountTableHeader.vue";
import TableActionMenu from "~/components/ui/tables/dropdowns/TableActionMenu.vue";
import TableActionMenuItem from "~/components/ui/tables/dropdowns/TableActionMenuItem.vue";
import TagUi from "~/components/ui/TagUi.vue";
import useAccountSeoTitle from "~/shared/composables/useAccountSeoTitle";

import useAdminUsersData from "./_composables/useAdminUsersData";
import useBlockUser from "./_composables/useBlockUser";

const { TABLE_COLUMNS, data, loading, meta, getData } = useAdminUsersData();
const { toggleBlock } = useBlockUser(() => getData());

onBeforeMount(async () => {
  await getData();
});

// --- SEO ---
const PAGE_TITLE = "Пользователи";
definePageMeta({ title: PAGE_TITLE, middleware: "admin" });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
.admin-users-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
