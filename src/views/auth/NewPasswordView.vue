<script setup>
  import { onMounted, inject, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router';
  import AuthAPI from '@/api/AuthAPI';
     
  const toast = inject('toast')
  const route = useRoute()
  const router = useRouter()

  const { token } = route.params
  const validToken = ref(false)

  const handleSubmit = async({password}) => {
    try {
      const { data } = await AuthAPI.updatePassword(token, { password })
      toast.open({
        type: 'success',
        message: data.msg,
      })
      setTimeout(() => {
        router.push({ name: 'login' })
      }, 3000)
    } catch (error) {
      toast.open({
        type: 'error',
        message: error.response.data.msg,
      })
    }
  }

  onMounted(async () => {
    try {
      const { data } = await AuthAPI.verifyPasswordResetToken(token)
      validToken.value = true
    } catch (error) {
      toast.open({
        type: 'error',
        message: error.response.data.msg,
      })
    }
  })
</script>

<template>
  <div v-if="validToken">

    <h1 class="text-6xl font-extrabold text-white text-center mt-10">Nuevo password</h1>
    <p class="text-2xl text-white text-center my-5">Coloca tu nuevo password</p>
  
    <FormKit
      id="newPasswordForm"
      type="form"
      :actions="false"
      incomplete-message="No se pudo enviar, revisa las notificaciones"
      @submit="handleSubmit"
    >
      <!-- 
        Con :actions="false" ocultamos los botones de submit y reset
      -->
      <FormKit
        type="password"
        label="Password"
        name="password"
        placeholder="Password de Usuario - Min 8 caracteres"
        validation="required|length:8"
        :validation-messages="{
          required: 'El password es requerido',
          length: 'El password debe contener al menos 8 caracteres'
        }"
      />
  
      <FormKit type="submit">Guardar Password</FormKit>
    </FormKit>
  </div>

  <div v-else>
    <h1 class="text-2xl font-extrabold text-white text-center mt-10">Token inválido</h1>
  </div>
</template>

