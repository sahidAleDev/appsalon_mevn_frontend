<script setup>
  import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router'
  const router = useRouter()


  onBeforeMount(() => {
    router.push('/auth/login')
  })
</script>

<template>
  <main>
  </main>
</template>
