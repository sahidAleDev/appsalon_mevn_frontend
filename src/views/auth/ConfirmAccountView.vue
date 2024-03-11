<script setup>

import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue';
import AuthAPI from '@/api/AuthAPI';
import { inject } from 'vue';

const route = useRoute()
const router = useRouter()
const toast = inject('toast')

const { token } = route.params

onMounted(async () => {
  try {
    const { data } = await AuthAPI.verifyAccount(token)
    toast.open({
      message: data.msg,
      type: 'success'
    })

    setTimeout(() => {
      router.push({ name: 'login' })
    }, 5000)

  } catch (error) {
    toast.open({
      message: error.response.data.msg,
      type: 'error'
    })
  }
})

</script>

<template>
  <h1 class="text-6xl font-extrabold text-white text-center mt-10">Verificar Cuenta</h1>
</template>
