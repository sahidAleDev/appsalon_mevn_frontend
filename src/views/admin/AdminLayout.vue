<script setup>
import { useUserStore } from '@/stores/user';
import { onBeforeMount } from 'vue';
import AuthAPI from '@/api/AuthAPI'
import AdminAppointment from '@/components/AdminAppointment.vue'

const user = useUserStore();

onBeforeMount(async () => {
  try {
    user.loading = true
    const { data } = await AuthAPI.auth()
    user.user = data
    await user.getUserAppointments()
  } catch (error) {
    console.log(error)
  } finally {
    user.loading = false
  }
})
</script>

<template>
  <div class="flex flex-col space-y-5 sm:space-y-0 sm:flex-row sm:justify-between">
    <div>
      <h1 class="text-2xl lg:text-6xl font-black text-white mb-2">App Salón</h1>
      <h2 class="text-xl lg:text-2xl font-black text-white">Panel de Administración</h2>
    </div>

    <div class="flex flex-col space-y-5">
      <div class="flex gap-2 items-center justify-end">
        <p class="text-white text-right">Hola: {{ user.getUserName }}</p>
        <button type="button"
          class="bg-red-600 hover:bg-red-700 p-2 text-white uppercase text-xs font-extrabold rounded-lg"
          @click="user.logout">
          Cerrar Sesión
        </button>
      </div>
    </div>
  </div>


  <main class="space-y-4">
    <p class="text-white text-lg mt-5">
      A continuación podrás administras tus próximas citas.
    </p>

    <p v-if="user.loading" class="text-white text-2xl text-center mt-5">
      Cargando...
    </p>

    <div v-else>
      <p v-if="user.noAppointments" class="text-white text-2xl text-center mt-5">
        No tienes proximas citas.
      </p>

      <div v-else class="grid grid-cols-1 gap-5 mt-10">
        <AdminAppointment v-for="appointment in user.userAppointments" :key="appointment._id"
          :appointment="appointment" />
      </div>
    </div>
  </main>
</template>
