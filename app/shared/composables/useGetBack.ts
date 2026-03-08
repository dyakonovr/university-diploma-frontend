import { useRouter } from 'vue-router';

function useGetBack(fallbackRoute: string) {
  const router = useRouter();

  const getBack = () => {
    if (
      router.options.history.state.back &&
      typeof router.options.history.state.back === 'string' &&
      router.options.history.state.back.startsWith(fallbackRoute)
    ) {
      router.back();
    } else {
      router.push(fallbackRoute);
    }
  };

  return {
    getBack,
  };
}

export default useGetBack;
