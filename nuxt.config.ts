// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'nuxt-svgo-loader',
    'nuxt-viewport',
    'nuxt-charts',
  ],
  css: [
    '@/assets/styles/app.scss'
  ],
  viewport: {
    breakpoints: {
      xxl: 1920,
      xl: 1200,
      lg: 992,
      md: 768,
      sm: 576,
      xs: 360
    },
    defaultBreakpoints: {
      xxl: 'xxl',
      xl: 'xl',
      lg: 'lg',
      md: 'md',
      sm: 'sm',
      xs: 'xs'
    },
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.BACKEND_API_URL,
    },
  },
});