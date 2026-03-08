interface QueuedRequest {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  retry: () => Promise<unknown>;
}

type RequestState = {
  isRefreshing: boolean;
  failedQueue: QueuedRequest[];
};

// Стор нужен для request-утилиты. Здесь хранится
// очередь запросов, которые "отложены" в момент,
// когда другой запрос получил 401 в ответе и в этот момент
// обновляет токены
const useRequestStore = defineStore('auth', {
  state: (): RequestState => ({
    isRefreshing: false,
    failedQueue: [] as QueuedRequest[],
  }),

  actions: {
    setRefreshing(status: boolean) {
      this.isRefreshing = status;
    },

    addToQueue(request: QueuedRequest) {
      this.failedQueue.push(request);
    },

    processQueue(error?: Error) {
      while (this.failedQueue.length) {
        const { resolve, reject, retry } = this.failedQueue.shift()!;
        if (error) {
          reject(error);
        } else {
          resolve(retry());
        }
      }
    },
  },
});

export default useRequestStore;
