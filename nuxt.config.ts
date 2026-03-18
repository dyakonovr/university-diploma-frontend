// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  imports: {
    scan: false,
  },
  components: {
    dirs: [],
  },
  build: {
    transpile: ['@vuepic/vue-datepicker'],
  },
  modules: [
    '@nuxt/eslint',
    'nuxt-viewport',
    '@pinia/nuxt',
    'nuxt-svgo-loader',
    '@vueuse/nuxt',
    'nuxt-keen-slider',
    'nuxt-charts',
  ],
  css: ['./app/assets/styles/main.scss'],
  viewport: {
    breakpoints: {
      xxl: 1920,
      xl: 1200,
      lg: 992,
      md: 768,
      sm: 576,
      xs: 360,
    },
    defaultBreakpoints: {
      xxl: 'xxl',
      xl: 'xl',
      lg: 'lg',
      md: 'md',
      sm: 'sm',
      xs: 'xs',
    },
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.BACKEND_API_URL,
    },
  },
  devServer: {
    port: 5173,
  }
});
