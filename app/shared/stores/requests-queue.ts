import { defineStore } from 'pinia';

type ResolveFn<T> = (value: T | PromiseLike<T>) => void;
type RejectFn = (reason?: unknown) => void;

export type QueuedRequest<T = unknown> = {
  id: number;
  retry: () => Promise<T>;
  resolve: ResolveFn<T>;
  reject: RejectFn;
  aborted: boolean;
  abortSignal?: AbortSignal | null;
};

export type RequestStoreState = {
  isRefreshing: boolean;
  queue: QueuedRequest[];
  lastId: number;
};

export const useRequestStore = defineStore('request', {
  state: (): RequestStoreState => ({
    isRefreshing: false,
    queue: [],
    lastId: 0,
  }),

  getters: {
    queueLength: (state) => state.queue.length,
  },

  actions: {
    startRefreshing() {
      this.isRefreshing = true;
    },

    finishRefreshing() {
      this.isRefreshing = false;
    },

    /**
     * Добавляет задачу в очередь.
     * @param retry - функция, которая повторно выполнит оригинальный запрос (должна возвращать Promise<T>)
     * @param signal - (опционально) AbortSignal - если сигнал абортнут до обработки очереди, задача будет отклонена
     * @returns Promise<T> - резолвится результатом retry после успешного refresh, или reject в случае ошибки/отмены
     */
    enqueue<T>(
      retry: () => Promise<T>,
      signal?: AbortSignal | null,
    ): Promise<T> {
      // если сигнал уже абортнут — reject сразу
      if (signal?.aborted) {
        return Promise.reject(new DOMException('aborted', 'AbortError'));
      }

      this.lastId += 1;
      const id = this.lastId;

      let resolveFn!: ResolveFn<T>;
      let rejectFn!: RejectFn;

      const promise = new Promise<T>((resolve, reject) => {
        resolveFn = resolve;
        rejectFn = reject;
      });

      const queued: QueuedRequest<T> = {
        id,
        retry: retry as unknown as () => Promise<T>,
        resolve: resolveFn,
        reject: rejectFn,
        aborted: false,
        abortSignal: signal ?? null,
      };

      // подписаться на abort сигнал (если есть)
      if (signal) {
        const onAbort = () => {
          queued.aborted = true;
          queued.reject(new DOMException('aborted', 'AbortError'));
          // удалить из очереди
          this.queue = this.queue.filter((q) => q.id !== id);
          signal.removeEventListener('abort', onAbort);
        };
        signal.addEventListener('abort', onAbort);
      }

      this.queue.push(queued as QueuedRequest);

      return promise;
    },

    /**
     * В случае успешного обновления токенов — перепроходит всю очередь.
     * Для каждой записи вызывает retry() и резолвит/реджектит сохранённый Promise.
     */
    async processQueueSuccess() {
      const q = [...this.queue];
      // очищаем очередь заранее, чтобы в процессе retry новые запросы могли добавляться в новую очередь
      this.queue = [];
      this.isRefreshing = false;

      await Promise.all(
        q.map(async (item) => {
          if (item.aborted) return;
          try {
            const result = await item.retry();
            item.resolve(result);
          } catch (err) {
            item.reject(err);
          }
        }),
      );
    },

    /**
     * В случае ошибки при обновлении токенов — отклоняет все элементы очереди.
     * Обычно здесь можно вызывать логаут / удаление токенов.
     */
    processQueueFailure(error?: unknown) {
      const q = [...this.queue];
      this.queue = [];
      this.isRefreshing = false;

      q.forEach((item) => {
        if (!item.aborted) {
          item.reject(error ?? new Error('Token refresh failed'));
        }
      });
    },

    /**
     * Полностью отменить все ожидающие запросы (например, при logout).
     */
    cancelAll(reason?: unknown) {
      const q = [...this.queue];
      this.queue = [];
      this.isRefreshing = false;
      q.forEach((item) => {
        item.reject(reason ?? new Error('Cancelled'));
      });
    },

    /**
     * Удалить конкретную задачу по id (реже нужно).
     */
    removeById(id: number) {
      this.queue = this.queue.filter((q) => q.id !== id);
    },

    async waitForRefresh(): Promise<void> {
      if (!this.isRefreshing) return;

      return this.enqueue(async () => undefined, null);
    },
  },
});

export default useRequestStore;
