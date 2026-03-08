<template>
  <account-form-header :with-back-button="false" />

  <form-container
    class="profile divided"
    :loading="initialLoading">
    <template #header>
      <p class="form-container__title">Профиль пользователя</p>
    </template>

    <div class="form-container-padding">
      <template v-if="!initialLoading && user">
        <div class="profile__info-grid">
          <div class="profile__info-row">
            <span class="profile__info-label">ID:</span>
            <span class="profile__info-value">{{ user.id }}</span>
          </div>

          <div class="profile__info-row">
            <span class="profile__info-label">Username:</span>
            <span class="profile__info-value">
              {{ user.username }}
            </span>
          </div>

          <div class="profile__info-row">
            <span class="profile__info-label">Email:</span>
            <span class="profile__info-value">
              {{ user.email }}
            </span>
          </div>

          <div class="profile__info-row">
            <span class="profile__info-label">Роли:</span>
            <span class="profile__info-value">
              {{ user.roles?.join(', ') }}
            </span>
          </div>
        </div>
      </template>
    </div>
  </form-container>

  <user-subscriptions-list
    :subscriptions="userStore.subscriptions || []"
    :loading="false"
  />

  <user-balance-transactions
    v-model:current-page="transactionsPage"
    :balance="userStore.balance"
    :transactions="transactions"
    :loading="transactionsLoading"
    :total-pages="transactionsTotalPages"
  />
</template>

<script setup lang="ts">
import AccountFormHeader from '~/components/pages/account/AccountFormHeader.vue';
import FormContainer from '~/components/ui/form/FormContainer.vue';
import useUserStore from '~/domain/user/stores/user';
import UserBalanceTransactions from '~/domain/user/ui/UserBalanceTransactions.vue';
import UserSubscriptionsList from '~/domain/user/ui/UserSubscriptionsList.vue';
import useAccountSeoTitle from '~/shared/composables/useAccountSeoTitle';

import useProfilePage from './_composables/useProfilePage';

const userStore = useUserStore();

const {
  user,
  initialLoading,
  transactionsLoading,
  transactions,
  transactionsPage,
  transactionsTotalPages,
  getData,
  fetchTransactions,
} = useProfilePage();

onBeforeMount(async () => {
  initialLoading.value = true;
  await getData();
  initialLoading.value = false;
  void fetchTransactions();
});

// --- SEO ---
const PAGE_TITLE = 'Профиль';
definePageMeta({ title: PAGE_TITLE });
useAccountSeoTitle(PAGE_TITLE);
</script>

<style lang="scss">
@use '/assets/styles/base/colors' as colors;

.profile {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid colors.$border;
  }

  &__info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }

  &__info-row {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px;
    background: colors.$background;
    border: 1px solid colors.$border;
    border-radius: 8px;
  }

  &__info-label {
    font-size: 13px;
    color: colors.$text-light;
    font-weight: 500;
  }

  &__info-value {
    font-size: 15px;
    font-weight: 500;
    color: colors.$text;
    word-break: break-word;
  }

  &__loading {
    text-align: center;
    padding: 40px;
    color: colors.$text-light;
  }
}

@media (max-width: 640px) {
  .profile {
    &__info-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
