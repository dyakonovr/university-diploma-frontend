<template>
  <div class="ws-switcher">
    <div
      class="ws-switcher__current"
      :class="{ 'ws-switcher__current--collapsed': isCollapsed }"
      @click="toggleDropdown"
      @keydown.enter="toggleDropdown"
    >
      <div class="ws-switcher__icon">
        {{ currentInitial }}
      </div>
      <template v-if="!isCollapsed">
        <span class="ws-switcher__name">
          {{ currentWorkspace?.name || "Воркспейс" }}
        </span>
        <chevron-down-icon class="ws-switcher__chevron" />
      </template>
    </div>

    <teleport to="body">
      <div
        v-if="isDropdownOpen"
        class="ws-switcher__backdrop"
        @click="isDropdownOpen = false"
      />
      <transition name="ws-switcher-fade">
        <div v-if="isDropdownOpen" class="ws-switcher__dropdown">
          <p class="ws-switcher__dropdown-title">Воркспейсы</p>
          <div
            v-for="ws in workspaces"
            :key="ws.id"
            class="ws-switcher__option"
            :class="{
              'ws-switcher__option--active': ws.id === currentWorkspaceId,
            }"
            @click="switchWorkspace(ws.id)"
          >
            <div class="ws-switcher__option-icon">
              {{ ws.name.charAt(0).toUpperCase() }}
            </div>
            <span>{{ ws.name }}</span>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import ChevronDownIcon from "@/assets/images/icons/chevron-down.svg";
import { getMyWorkspaces } from "~/domain/workspace/api/workspace.api";
import type { Workspace } from "~/domain/workspace/models/workspace.types";

type Props = {
  isCollapsed: boolean;
};

defineProps<Props>();

const route = useRoute();
const router = useRouter();

const isDropdownOpen = ref(false);
const workspaces = ref<Workspace[]>([]);
const currentWorkspace = ref<Workspace | null>(null);

const currentWorkspaceId = computed(
  () => route.params.workspaceId as string | undefined,
);

const currentInitial = computed(() => {
  const name = currentWorkspace.value?.name || "";
  return name.charAt(0).toUpperCase() || "W";
});

const toggleDropdown = () => {
  if (!workspaces.value.length) {
    loadWorkspaces();
  }
  isDropdownOpen.value = !isDropdownOpen.value;
};

const loadWorkspaces = async () => {
  try {
    const response = await getMyWorkspaces();
    workspaces.value = response.data;
  } catch {
    // silent — dropdown just won't show options
  }
};

const switchWorkspace = (id: string) => {
  isDropdownOpen.value = false;
  router.push(`/workspaces/${id}`);
};

// Load current workspace name
watch(
  currentWorkspaceId,
  async (id) => {
    if (!id) return;
    // Find in cached list or load all
    if (workspaces.value.length) {
      currentWorkspace.value =
        workspaces.value.find((ws) => ws.id === id) || null;
    } else {
      try {
        const response = await getMyWorkspaces();
        workspaces.value = response.data;
        currentWorkspace.value =
          response.data.find((ws) => ws.id === id) || null;
      } catch {
        // silent
      }
    }
  },
  { immediate: true },
);
</script>

<style lang="scss">
.ws-switcher {
  padding: 12px 6px 4px;

  &__current {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover {
      background-color: var(--sidebar-hover-bg);
    }

    &--collapsed {
      justify-content: center;
      padding: 8px;
    }
  }

  &__icon {
    width: 28px;
    height: 28px;
    min-width: 28px;
    border-radius: 6px;
    background-color: var(--sidebar-active-bg);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
  }

  &__name {
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
  }

  &__chevron {
    width: 14px;
    height: 14px;
    color: var(--sidebar-text);
    flex-shrink: 0;
  }

  &__backdrop {
    position: fixed;
    inset: 0;
    z-index: 1999;
  }

  &__dropdown {
    position: fixed;
    top: 60px;
    left: 12px;
    z-index: 2000;
    width: 230px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 4px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  &__dropdown-title {
    padding: 8px 10px 4px;
    font-size: 11px;
    font-weight: 600;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text);
    cursor: pointer;
    transition: background-color 0.15s;

    &:hover {
      background-color: var(--topbar-hover-bg);
    }

    &--active {
      background-color: var(--topbar-active-bg);
      color: var(--topbar-active-text);
    }
  }

  &__option-icon {
    width: 24px;
    height: 24px;
    min-width: 24px;
    border-radius: 4px;
    background-color: var(--color-primary);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
  }
}

.ws-switcher-fade-enter-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.ws-switcher-fade-leave-active {
  transition: opacity 0.1s ease;
}

.ws-switcher-fade-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.ws-switcher-fade-leave-to {
  opacity: 0;
}
</style>
