<script setup>

  import { inject } from 'vue';
  import AuthAPI from '@/api/AuthAPI';
  import { reset } from '@formkit/vue'

  const toast = inject('toast')
  
  const handleSubmit = async ({ password_confirm, ...formData}) => {
    try {
      const { data } = await AuthAPI.register(formData)
      
      toast.open({
        type: 'success',
        message: data.msg,
      })

      reset('registerForm')

    } catch (error) {
      toast.open({
        type: 'error',
        message: error.response.data.msg,
      })
    }
  }
</script>

<template>
  <h1 class="text-6xl font-extrabold text-white text-center mt-10">Crea una cuenta</h1>

  <p class="text-2xl text-white text-center my-5">Cree una cuenta en AppSalón</p>

  <FormKit
    id="registerForm"
    type="form"
    :actions="false"
    incomplete-message="no se pudo enviar, revisa las notificaciones"
    @submit="handleSubmit"
  >
    <FormKit
      type="text"
      label="Nombre"
      name="name"
      placeholder="Tu nombre"
      validation="required|length:3"
      :validation-messages="{
        required: 'El nombre es requerido',
        length: 'El nombre debe tener al menos 3 caracteres'
      }"
    />

    <FormKit
      type="email"
      label="Email"
      name="email"
      placeholder="Email de Registro"
      validation="required|email"
      :validation-messages="{
        required: 'El email es requerido',
        email: 'Email no valido'
      }"
    />
    
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
    
    <FormKit
      type="password"
      label="Repetir password"
      name="password_confirm"
      placeholder="Repite el password"
      validation="required|confirm"
      :validation-messages="{
        required: 'El password es requerido',
        confirm: 'Los passwords no son iguales'
      }"
    />

    <FormKit
      type="submit"  
    >
      Crear cuenta
    </FormKit>
  </FormKit>
</template>
