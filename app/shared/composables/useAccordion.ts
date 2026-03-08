function useAccordion(initialValue: boolean = false) {
  const isOpened = ref(initialValue);

  const toggle = () => (isOpened.value = !isOpened.value);

  return { isOpened, toggle };
}

export default useAccordion;
