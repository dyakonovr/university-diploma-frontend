import 'vue-toastification/dist/index.css';

import * as vt from 'vue-toastification';

import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vt.default, {
    maxToasts: 2,
    transition: 'Vue-Toastification__fade',
    newestOnTop: true,
  });
  return {
    provide: {
      toast: vt.useToast(),
    },
  };
});
