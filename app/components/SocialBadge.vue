<template>
  <div
    v-if="config"
    class="social-badge"
    :style="{
      backgroundColor: config.background,
      color: config.color,
    }"
  >
    <component
      :is="config.logo"
      class="social-badge__logo" />
    <span class="social-badge__label">
      {{ config.label }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import InstagramLogo from '@/assets/images/socials/instagram/instagram.svg';
import OkLogo from '@/assets/images/socials/ok/ok.svg';
import TgLogo from '@/assets/images/socials/telegram/telegram.svg';
// import TelegraphLogo from '@/assets/images/socials/telegram/telegraph.webp';
import VkLogo from '@/assets/images/socials/vk/vk.svg';
import WordpressLogo from '@/assets/images/socials/wordpress/wordpress.svg';
import DzenLogo from '@/assets/images/socials/yandex-dzen/yandex-dzen.svg';
import type { SocialAccountProviderName } from '~/domain/social-account/models/social-account-provider';

type Props = {
  provider: SocialAccountProviderName;
};

const props = defineProps<Props>();

type Config = {
  label: string;
  color: string;
  background: string;
  logo: string;
};

function withOpacity(hex: string, opacity: number): string {
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${alpha}`;
}

const map: Record<SocialAccountProviderName, Config> = {
  telegram: {
    label: 'Telegram',
    color: '#229ED9',
    background: withOpacity('#229ED9', 0.15),
    logo: TgLogo,
  },
  vk: {
    label: 'VK',
    color: '#0077FF',
    background: withOpacity('#0077FF', 0.15),
    logo: VkLogo,
  },
  odnoklassniki: {
    label: 'OK',
    color: '#EE8208',
    background: withOpacity('#EE8208', 0.15),
    logo: OkLogo,
  },
  instagram: {
    label: 'Instagram',
    color: '#E4405F',
    background: withOpacity('#E4405F', 0.15),
    logo: InstagramLogo,
  },
  wordpress: {
    label: 'WordPress',
    color: '#21759B',
    background: withOpacity('#21759B', 0.15),
    logo: WordpressLogo,
  },
  yandex_dzen: {
    label: 'Dzen',
    color: '#000000',
    background: withOpacity('#000000', 0.08),
    logo: DzenLogo,
  },
  // : {
  //   label: 'Telegraph',
  //   color: '#000000',
  //   background: withOpacity('#000000', 0.08),
  //   logo: TelegraphLogo,
  // },
};

const config = computed(() => map[props.provider]);
</script>

<style lang="scss" scoped>
.social-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;

  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;

  white-space: nowrap;
}

.social-badge__logo {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}
</style>
