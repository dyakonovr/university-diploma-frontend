function useAbortRequests(abortOnUnmount: boolean = true) {
  const abortController = ref(new AbortController());

  const abortAllQueries = (isUnmount = false) => {
    abortController.value.abort();
    if (!isUnmount) {
      abortController.value = new AbortController();
    }
  };

  onUnmounted(() => {
    if (abortOnUnmount) {
      abortAllQueries(true);
    }
  });

  return { abortController, abortAllQueries };
}

export default useAbortRequests;
