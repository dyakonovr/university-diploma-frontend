import { defineStore } from 'pinia';

type GetBackState = {
  fromLink: string | null;
};

/** Store нужен, чтобы после авторизации/регистрации возвращаться на страницу,
* с которой нас выбросила из-за отсутсвия авторизации.
* Для этого при необходимости вызываем store и устанавливаем fromLink
* */
export const useGetBackStore = defineStore('get-back', {
  state: (): GetBackState => ({
    fromLink: null
  }),
  actions: {
    /**
     * Перенаправляет пользователя на предыдущую страницу (если она была сохранена)
     * или на страницу по умолчанию.
     * @param {string} [defaultLink='/'] - Ссылка для перенаправления по умолчанию
     * @example
     * // Перенаправит на сохранённую страницу или на главную (см. store)
     * getBackStore.activate();
     * 
     * // Перенаправит на сохранённую страницу или на /dashboard
     * getBackStore.activate('/dashboard');
     */
    activate(defaultLink: string = '/') {
      const router = useRouter();
      router.replace(this.fromLink ? this.fromLink : defaultLink);
      this.fromLink = null;
    },
  }
});