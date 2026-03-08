<template>
  <div />
</template>

<script setup lang="ts">
const router = useRouter();

onBeforeMount(() => {
  router.push('/workspaces');
});
</script>
